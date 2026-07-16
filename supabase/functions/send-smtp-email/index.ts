// Edge Function: send-smtp-email
// Envia emails via SMTP usando o servidor Hestia (mail.memindsport.it)
//
// Public (anonymous quiz) callers MUST pass { lead_id, ... }. The function
// resolves the recipient from `quiz_leads.email` server-side (caller-supplied
// `to` is ignored), enforces a fixed subject prefix and sanitizes the HTML
// body to strip active content. Admin callers (verified via has_role) may
// send arbitrary { to, subject, html } — e.g. admin resend from /admin/quiz.

import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SMTP_HOST = "mail.memindsport.it";
const SMTP_PORT = 465; // SSL/TLS
const SMTP_USER = "noreply@memindsport.it";
const SMTP_FROM_NAME = "MeMindSport";

const ALLOWED_SUBJECT_PREFIX = "Il tuo profilo MeMindSport";
const MAX_HTML_BYTES = 200_000;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface SendPayload {
  lead_id?: string;
  to?: string;
  subject?: string;
  html: string;
  text?: string;
  replyTo?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isUuid(v: unknown): v is string {
  return typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}

// Strip active/dangerous constructs. This is a defense-in-depth measure — the
// canonical protection is that the recipient is locked to the lead row.
function sanitizeHtml(html: string): string {
  let s = html;
  // Drop entire dangerous elements including contents.
  const dropTags = ["script", "iframe", "object", "embed", "form", "style", "link", "meta", "base", "svg", "math"];
  for (const t of dropTags) {
    const re = new RegExp(`<\\s*${t}\\b[^>]*>[\\s\\S]*?<\\s*\\/\\s*${t}\\s*>`, "gi");
    s = s.replace(re, "");
    // Self-closing / unmatched variants.
    const reSelf = new RegExp(`<\\s*\\/?\\s*${t}\\b[^>]*>`, "gi");
    s = s.replace(reSelf, "");
  }
  // Remove inline event handlers (onclick=, onload=, etc.).
  s = s.replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "");
  s = s.replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "");
  s = s.replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "");
  // Neutralize javascript:, data:, vbscript: URIs in href/src.
  s = s.replace(/(href|src)\s*=\s*"(\s*(?:javascript|data|vbscript)\s*:[^"]*)"/gi, '$1="#"');
  s = s.replace(/(href|src)\s*=\s*'(\s*(?:javascript|data|vbscript)\s*:[^']*)'/gi, "$1='#'");
  return s;
}

// Simple in-memory rate limit per IP (best-effort, per-instance).
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const token = authHeader.slice("Bearer ".length).trim();

  // Rate limit per IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const password = Deno.env.get("SMTP_PASSWORD");
  if (!password || !supabaseUrl || !serviceRoleKey) {
    console.error("Email service misconfigured");
    return new Response(
      JSON.stringify({ error: "Email service unavailable" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  let payload: SendPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!payload.html || typeof payload.html !== "string") {
    return new Response(
      JSON.stringify({ error: "Contenuto HTML mancante" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
  if (new TextEncoder().encode(payload.html).byteLength > MAX_HTML_BYTES) {
    return new Response(
      JSON.stringify({ error: "Contenuto HTML troppo grande" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // Determine caller class:
  //   - service role: full trust (server-to-server).
  //   - authenticated admin: full trust (admin resend UI).
  //   - anon/authenticated non-admin: MUST provide lead_id; recipient is
  //     forced to quiz_leads.email; html is sanitized; subject is validated.
  const admin = createClient(supabaseUrl, serviceRoleKey);
  const isServiceRole = token === serviceRoleKey;

  let isAdminUser = false;
  if (!isServiceRole && token !== anonKey) {
    try {
      const { data: userData } = await admin.auth.getUser(token);
      const uid = userData?.user?.id;
      if (uid) {
        const { data: roleRow } = await admin
          .from("user_roles")
          .select("role")
          .eq("user_id", uid)
          .eq("role", "admin")
          .maybeSingle();
        isAdminUser = !!roleRow;
      }
    } catch (e) {
      console.error("Admin check failed:", e);
    }
  }

  let recipient: string;
  let subject: string;
  let html: string;

  if (isServiceRole || isAdminUser) {
    // Trusted callers may specify recipient/subject/html directly.
    if (!payload.to || !isValidEmail(payload.to)) {
      return new Response(JSON.stringify({ error: "Destinatario non valido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!payload.subject || payload.subject.length > 500) {
      return new Response(JSON.stringify({ error: "Subject non valido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    recipient = payload.to.trim();
    subject = payload.subject;
    html = payload.html;
  } else {
    // Public (anonymous quiz) path — REQUIRES lead_id; recipient is server-derived.
    if (!isUuid(payload.lead_id)) {
      return new Response(JSON.stringify({ error: "lead_id mancante o non valido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    let lead: { email: string | null } | null = null;
    try {
      const { data, error } = await admin
        .from("quiz_leads")
        .select("email")
        .eq("id", payload.lead_id)
        .maybeSingle();
      if (error) throw error;
      lead = data;
    } catch (e) {
      console.error("Lead lookup failed:", e);
      return new Response(JSON.stringify({ error: "Email service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!lead || !lead.email || !isValidEmail(lead.email)) {
      return new Response(JSON.stringify({ error: "Lead non trovato" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    recipient = lead.email.trim();

    // Enforce fixed subject prefix; ignore any deviation.
    if (payload.subject && payload.subject.startsWith(ALLOWED_SUBJECT_PREFIX) && payload.subject.length <= 200) {
      subject = payload.subject;
    } else {
      subject = ALLOWED_SUBJECT_PREFIX;
    }

    html = sanitizeHtml(payload.html);
  }

  const client = new SMTPClient({
    connection: {
      hostname: SMTP_HOST,
      port: SMTP_PORT,
      tls: true,
      auth: {
        username: SMTP_USER,
        password,
      },
    },
  });

  try {
    await client.send({
      from: `${SMTP_FROM_NAME} <${SMTP_USER}>`,
      to: recipient,
      replyTo: payload.replyTo && isValidEmail(payload.replyTo) ? payload.replyTo : undefined,
      subject,
      content: payload.text ?? "Per visualizzare correttamente questa email usa un client che supporta HTML.",
      html,
    });
    await client.close();

    console.log(`Email inviata a ${recipient}: "${subject}"`);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    try {
      await client.close();
    } catch {
      // ignore close errors
    }
    const message = error instanceof Error ? error.message : String(error);
    console.error("SMTP send failed:", message);
    return new Response(
      JSON.stringify({ error: "Email sending failed. Please try again later." }),
      {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

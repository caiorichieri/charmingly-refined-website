// Edge Function: send-smtp-email
// Envia emails via SMTP usando o servidor Hestia (mail.memindsport.it)
// Recebe: { to, subject, html, text?, replyTo? }

import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SMTP_HOST = "mail.memindsport.it";
const SMTP_PORT = 465; // SSL/TLS
const SMTP_USER = "noreply@memindsport.it";
const SMTP_FROM_NAME = "MeMindSport";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface SendPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

  // --- AuthN/AuthZ: Supabase gateway enforces verify_jwt=true (anon key or user JWT required).
  // For anonymous quiz callers we additionally require that the recipient exists in quiz_leads,
  // preventing arbitrary recipients / spam relay.
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

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
  if (!password) {
    console.error("SMTP_PASSWORD não configurado");
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

  const { to, subject, html, text, replyTo } = payload;

  if (!to || !isValidEmail(to)) {
    return new Response(
      JSON.stringify({ error: "Destinatario non valido" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
  if (!subject || subject.length > 500) {
    return new Response(JSON.stringify({ error: "Subject non valido" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!html || html.length > 1_000_000) {
    return new Response(
      JSON.stringify({ error: "Contenuto HTML mancante o troppo grande" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // Validate the recipient against quiz_leads (unless caller is service role).
  const token = authHeader.slice("Bearer ".length).trim();
  const isServiceRole = !!serviceRoleKey && token === serviceRoleKey;
  if (!isServiceRole) {
    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for recipient validation");
      return new Response(JSON.stringify({ error: "Email service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    try {
      const admin = createClient(supabaseUrl, serviceRoleKey);
      const { data: lead, error: leadErr } = await admin
        .from("quiz_leads")
        .select("id")
        .ilike("email", to.trim())
        .limit(1)
        .maybeSingle();
      if (leadErr || !lead) {
        return new Response(JSON.stringify({ error: "Recipient not allowed" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } catch (e) {
      console.error("Recipient validation failed:", e);
      return new Response(JSON.stringify({ error: "Email service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
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
      to,
      replyTo: replyTo && isValidEmail(replyTo) ? replyTo : undefined,
      subject,
      content: text ?? "Per visualizzare correttamente questa email usa un client che supporta HTML.",
      html,
    });
    await client.close();

    console.log(`Email inviata a ${to}: "${subject}"`);

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
    // Log details server-side only; never leak SMTP internals to client.
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

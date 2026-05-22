// Edge Function: send-smtp-email
// Envia emails via SMTP usando o servidor Hestia (mail.memindsport.it)
// Recebe: { to, subject, html, text?, replyTo? }

import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const SMTP_HOST = "mail.memindsport.it";
const SMTP_PORT = 465; // SSL/TLS
const SMTP_USER = "noreply@memindsport.it";
const SMTP_FROM_NAME = "MEM IN Sport";

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

  const password = Deno.env.get("SMTP_PASSWORD");
  if (!password) {
    console.error("SMTP_PASSWORD não configurado");
    return new Response(
      JSON.stringify({ error: "SMTP non configurato" }),
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
    console.error("SMTP send failed:", message);
    return new Response(
      JSON.stringify({ error: "Invio fallito", details: message }),
      {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

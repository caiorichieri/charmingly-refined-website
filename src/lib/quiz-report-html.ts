// Genera l'HTML del report email-friendly per un lead del quiz.
// Tutta la grafica è SVG inline + stili inline (compatibile con i client email).
import {
  PROFILE_COLORS,
  PROFILE_LABELS,
  PROFILE_ORDER,
  TYPE_COORDS,
  ZONES,
  FRASE_MAPPA,
  buildInsight,
  buildTags,
  getAthletePoint,
  type ProfileResult,
} from "./quiz-profile";

type LeadInfo = { name: string; email: string; phone?: string | null };

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---------- Mappa del campo (SVG) ----------
function mappaSVG(result: ProfileResult): string {
  const W = 560, H = 380, cx = W / 2, cy = H / 2, rx = 240, ry = 160;
  const toArena = (x: number, y: number) => ({
    x: cx + (x - 0.5) * 2 * rx * 0.78,
    y: cy + (0.5 - y) * 2 * ry * 0.78,
  });
  const p = getAthletePoint(result);
  const pin = toArena(p.x, p.y);
  const target = toArena(0.32, 0.78);
  const primary = PROFILE_COLORS[result.primary];
  const primaryZone = TYPE_COORDS[result.primary].zone;
  const mx = (pin.x + target.x) / 2;
  const my = (pin.y + target.y) / 2 - 50;
  const path = `M ${pin.x} ${pin.y} Q ${mx} ${my} ${target.x} ${target.y}`;

  const zoneCenters = [
    { zone: "flusso", x: 0.27, y: 0.80 },
    { zone: "fuoco", x: 0.73, y: 0.80 },
    { zone: "mappa", x: 0.27, y: 0.20 },
    { zone: "silenzio", x: 0.73, y: 0.20 },
  ] as const;

  const zoneGradients = zoneCenters
    .map((zc) => {
      const z = ZONES[zc.zone];
      const col = PROFILE_COLORS[z.type];
      const op = zc.zone === primaryZone ? 0.55 : 0.18;
      return `<radialGradient id="zg-${zc.zone}" cx="50%" cy="50%" r="65%">
        <stop offset="0%" stop-color="${col}" stop-opacity="${op}"/>
        <stop offset="100%" stop-color="${col}" stop-opacity="0"/>
      </radialGradient>`;
    })
    .join("");

  const zoneBlobs = zoneCenters
    .map((zc) => {
      const c = toArena(zc.x, zc.y);
      return `<circle cx="${c.x}" cy="${c.y}" r="150" fill="url(#zg-${zc.zone})"/>`;
    })
    .join("");

  const zoneLabels = zoneCenters
    .map((zc) => {
      const c = toArena(zc.x, zc.y);
      const z = ZONES[zc.zone];
      const col = PROFILE_COLORS[z.type];
      const active = zc.zone === primaryZone;
      const name = z.name.replace("Zona del ", "").replace("Zona della ", "");
      return `<text x="${c.x}" y="${c.y - 8}" text-anchor="middle" font-size="13" font-weight="${active ? 700 : 600}" fill="${col}" opacity="${active ? 1 : 0.85}" style="letter-spacing:0.05em; text-transform:uppercase">${name}</text>
        <text x="${c.x}" y="${c.y + 12}" text-anchor="middle" font-size="11" fill="${col}" opacity="${active ? 0.9 : 0.55}">${PROFILE_LABELS[z.type].name}</text>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" style="max-width:560px;display:block;margin:0 auto;color:#0a0a0a">
    <defs>
      <radialGradient id="arenaBg" cx="50%" cy="50%" r="65%">
        <stop offset="0%" stop-color="#000" stop-opacity="0.04"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.16"/>
      </radialGradient>
      ${zoneGradients}
      <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${primary}" stop-opacity="0.7"/>
        <stop offset="100%" stop-color="${primary}" stop-opacity="0"/>
      </radialGradient>
      <marker id="arr" markerWidth="10" markerHeight="10" refX="7" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 L2,4 Z" fill="${primary}"/>
      </marker>
      <clipPath id="cl"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/></clipPath>
    </defs>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#arenaBg)"/>
    <g clip-path="url(#cl)" stroke="#000" stroke-opacity="0.15" stroke-width="1" fill="none">
      <ellipse cx="${cx}" cy="${cy}" rx="${rx * 0.95}" ry="${ry * 0.95}"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${rx * 0.55}" ry="${ry * 0.55}"/>
      <circle cx="${cx}" cy="${cy}" r="22"/>
      <line x1="${cx}" y1="${cy - ry}" x2="${cx}" y2="${cy + ry}" stroke-dasharray="2 6"/>
    </g>
    <g clip-path="url(#cl)">${zoneBlobs}</g>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#000" stroke-opacity="0.25" stroke-width="1.5"/>
    ${zoneLabels}
    <path d="${path}" fill="none" stroke="${primary}" stroke-width="2" stroke-dasharray="2 6" marker-end="url(#arr)" opacity="0.85"/>
    <circle cx="${pin.x}" cy="${pin.y}" r="32" fill="url(#pinGlow)"/>
    <circle cx="${pin.x}" cy="${pin.y}" r="18" fill="${primary}" stroke="white" stroke-width="2.5"/>
    <text x="${pin.x}" y="${pin.y + 5}" text-anchor="middle" font-size="12" font-weight="800" fill="white" style="letter-spacing:0.06em">TU</text>
    <circle cx="${target.x}" cy="${target.y}" r="5" fill="none" stroke="${primary}" stroke-width="1.5" opacity="0.6"/>
  </svg>`;
}

// ---------- Distribuzione profilo (HTML bar chart, email-safe) ----------
function ragnatelaSVG(result: ProfileResult): string {
  const max = 12;
  const rows = PROFILE_ORDER.map((k, i) => {
    const v = result.scores[i] ?? 0;
    const pct = Math.max(2, Math.round((v / max) * 100));
    const col = PROFILE_COLORS[k];
    const isPrimary = k === result.primary;
    const isSecondary = k === result.secondary;
    const weight = isPrimary ? 700 : isSecondary ? 600 : 500;
    const labelColor = isPrimary || isSecondary ? col : "#333";
    return `
      <tr>
        <td style="padding:6px 10px 6px 0;font-size:13px;color:${labelColor};font-weight:${weight};white-space:nowrap;vertical-align:middle;width:140px">
          ${escape(PROFILE_LABELS[k].name)}
        </td>
        <td style="padding:6px 0;vertical-align:middle">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse">
            <tr>
              <td style="background:#f0f0f0;border-radius:6px;height:14px;padding:0">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${pct}%" style="border-collapse:collapse">
                  <tr>
                    <td style="background:${col};height:14px;border-radius:6px;font-size:0;line-height:0">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
        <td style="padding:6px 0 6px 10px;font-size:12px;color:${col};font-weight:${weight};text-align:right;width:40px;vertical-align:middle">
          ${v}/${max}
        </td>
      </tr>`;
  }).join("");

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;max-width:560px;margin:0 auto">
    ${rows}
  </table>`;
}

// ---------- HTML report ----------
export function buildReportHTML(result: ProfileResult, lead: LeadInfo): string {
  const primary = PROFILE_LABELS[result.primary];
  const secondary = result.secondary ? PROFILE_LABELS[result.secondary] : null;
  const primaryColor = PROFILE_COLORS[result.primary];
  const zone = ZONES[TYPE_COORDS[result.primary].zone];
  const fraseMappa = FRASE_MAPPA[result.primary];
  const insight = buildInsight(result);
  const tags = buildTags(result);

  const forzaTags = tags.forza
    .map(
      (t) =>
        `<span style="display:inline-block;border:1px solid ${primaryColor}55;color:${primaryColor};border-radius:999px;padding:6px 12px;margin:3px;font-size:13px;font-weight:500">${escape(t)}</span>`
    )
    .join("");
  const lavoroTags = tags.lavoro
    .map(
      (t) =>
        `<span style="display:inline-block;border:1px solid #00000022;background:#f5f5f5;color:#666;border-radius:999px;padding:6px 12px;margin:3px;font-size:13px">${escape(t)}</span>`
    )
    .join("");

  const titolo = secondary
    ? `${primary.name} <span style="color:#888;font-weight:400">×</span> ${secondary.name}`
    : primary.name;

  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Report MeMindSport — ${escape(lead.name.split(" ")[0])}</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0a0a0a;line-height:1.55">
  <div style="max-width:640px;margin:0 auto;padding:32px 24px">

    <!-- Header -->
    <div style="text-align:center;padding-bottom:24px;border-bottom:1px solid #eee">
      <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#888">MeMindSport · Profilo</div>
      <h1 style="font-size:24px;margin:8px 0 4px;font-weight:700">Gentile ${escape(lead.name.split(" ")[0])},</h1>
      <p style="font-size:15px;color:#555;margin:0">Ecco il tuo profilo funzionale, secondo il Modello PROFILER — MeMindSport.</p>
      <p style="font-size:13px;color:#888;margin:12px 0 0"><strong>Disclaimer:</strong> questo profilo non costituisce una diagnosi clinica: è una descrizione del tuo funzionamento come atleta, elaborata sulla base delle risposte al questionario.</p>
    </div>

    <!-- Atto 1 -->
    <div style="margin-top:32px">
      <div style="text-align:center;margin-bottom:16px">
        <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${primaryColor};font-weight:600">Sezione 1 — Distribuzione del profilo</div>
        <h2 style="font-size:22px;margin:6px 0 0;font-weight:700">${escape(zone.name)}</h2>
        <p style="font-size:13px;color:#777;margin:6px 0 0">Rappresentazione grafica dei sei profili previsti dal modello MeMindSport, calcolata sulla base delle risposte fornite.</p>
      </div>
      ${ragnatelaSVG(result)}
      <div style="margin-top:16px;padding:16px 18px;border:1px solid ${primaryColor}55;background:${primaryColor}11;border-radius:12px">
        <p style="margin:0;font-size:15px;color:#222">${escape(fraseMappa)}</p>
      </div>
    </div>

    <!-- Atto 2 -->
    <div style="margin-top:40px;padding-top:32px;border-top:1px solid #eee">
      <div style="text-align:center;margin-bottom:16px">
        <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${primaryColor};font-weight:600">Sezione 2 — Collocazione nel modello</div>
        <h2 style="font-size:22px;margin:6px 0 0;font-weight:700">${titolo}</h2>
        <p style="font-size:13px;color:#777;margin:6px 0 0">Posizionamento all'interno della matrice energia-controllo elaborata negli studi MeMindSport.</p>
      </div>
      ${mappaSVG(result)}
      <div style="margin-top:16px;padding:16px 18px;border:1px solid ${primaryColor}55;background:${primaryColor}11;border-radius:12px">
        <p style="margin:0;font-size:15px;color:#222">${escape(insight)}</p>
      </div>
    </div>

    <!-- Tag -->
    <div style="margin-top:40px;padding-top:32px;border-top:1px solid #eee">
      <h3 style="font-size:13px;letter-spacing:0.15em;text-transform:uppercase;color:#666;margin:0 0 12px">Caratteristiche prevalenti</h3>
      <div>${forzaTags}</div>
      <h3 style="font-size:13px;letter-spacing:0.15em;text-transform:uppercase;color:#666;margin:24px 0 12px">Aree di approfondimento</h3>
      <div>${lavoroTags}</div>
    </div>

    <!-- Nota metodologica -->
    <div style="margin-top:32px;padding:18px 20px;background:#f7f7f7;border-radius:12px">
      <p style="margin:0;font-size:13px;color:#555;line-height:1.6">
        <strong style="color:#333">Nota metodologica.</strong> I contenuti del presente profilo derivano dall'elaborazione delle risposte al questionario secondo i criteri definiti negli studi MeMindSport. Si tratta di una restituzione descrittiva a fini conoscitivi: non esprime giudizi di valore, non prevede esiti sportivi e non sostituisce una valutazione professionale.
      </p>
    </div>

    <!-- Footer -->
    <div style="margin-top:32px;padding-top:24px;border-top:1px solid #eee;text-align:center;font-size:11px;color:#999;line-height:1.6">
      <p style="margin:0">Documento generato per ${escape(lead.email)}</p>
      <p style="margin:4px 0 0">MeMindSport — Studi e strumenti per la preparazione mentale nello sport.</p>
    </div>

  </div>
</body>
</html>`;
}

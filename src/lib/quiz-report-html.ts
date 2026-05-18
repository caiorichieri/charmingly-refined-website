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

// ---------- Ragnatela (SVG) ----------
function ragnatelaSVG(result: ProfileResult): string {
  const W = 460, H = 380, cx = W / 2, cy = H / 2, R = 140;
  const N = PROFILE_ORDER.length;
  const max = 12;
  const angle = (i: number) => (-Math.PI / 2) + (i * 2 * Math.PI) / N;
  const point = (i: number, v: number) => ({
    x: cx + Math.cos(angle(i)) * R * (v / max),
    y: cy + Math.sin(angle(i)) * R * (v / max),
  });
  const grid = [3, 6, 9, 12]
    .map((step) => {
      const pts = PROFILE_ORDER.map((_, i) => {
        const p = point(i, step);
        return `${p.x},${p.y}`;
      }).join(" ");
      return `<polygon points="${pts}" fill="none" stroke="#000" stroke-opacity="0.1"/>`;
    })
    .join("");
  const axes = PROFILE_ORDER.map((_, i) => {
    const p = point(i, max);
    return `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="#000" stroke-opacity="0.08"/>`;
  }).join("");
  const labels = PROFILE_ORDER.map((k, i) => {
    const p = point(i, max + 2);
    return `<text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="${PROFILE_COLORS[k]}" font-weight="600">${PROFILE_LABELS[k].short}</text>`;
  }).join("");
  const shape = PROFILE_ORDER.map((_, i) => {
    const p = point(i, result.scores[i] ?? 0);
    return `${p.x},${p.y}`;
  }).join(" ");
  const primary = PROFILE_COLORS[result.primary];
  const dots = PROFILE_ORDER.map((_, i) => {
    const p = point(i, result.scores[i] ?? 0);
    return `<circle cx="${p.x}" cy="${p.y}" r="3" fill="${primary}"/>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" style="max-width:460px;display:block;margin:0 auto">
    ${grid}${axes}${labels}
    <polygon points="${shape}" fill="${primary}" fill-opacity="0.25" stroke="${primary}" stroke-width="2"/>
    ${dots}
  </svg>`;
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
<title>Report MeMindSport — ${escape(lead.name)}</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0a0a0a;line-height:1.55">
  <div style="max-width:640px;margin:0 auto;padding:32px 24px">

    <!-- Header -->
    <div style="text-align:center;padding-bottom:24px;border-bottom:1px solid #eee">
      <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#888">MeMindSport · Profiler</div>
      <h1 style="font-size:24px;margin:8px 0 4px;font-weight:700">Ciao ${escape(lead.name.split(" ")[0])},</h1>
      <p style="font-size:15px;color:#555;margin:0">ecco il tuo profilo mentale di atleta.</p>
    </div>

    <!-- Atto 1 -->
    <div style="margin-top:32px">
      <div style="text-align:center;margin-bottom:16px">
        <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${primaryColor};font-weight:600">Atto 1 — La mappa del campo</div>
        <h2 style="font-size:22px;margin:6px 0 0;font-weight:700">${escape(zone.name)}</h2>
      </div>
      ${mappaSVG(result)}
      <div style="margin-top:16px;padding:16px 18px;border:1px solid ${primaryColor}55;background:${primaryColor}11;border-radius:12px">
        <p style="margin:0;font-size:15px;color:#222">${escape(fraseMappa)}</p>
      </div>
    </div>

    <!-- Atto 2 -->
    <div style="margin-top:40px;padding-top:32px;border-top:1px solid #eee">
      <div style="text-align:center;margin-bottom:16px">
        <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${primaryColor};font-weight:600">Atto 2 — La tua forma</div>
        <h2 style="font-size:22px;margin:6px 0 0;font-weight:700">${titolo}</h2>
      </div>
      ${ragnatelaSVG(result)}
      <div style="margin-top:16px;padding:16px 18px;border:1px solid ${primaryColor}55;background:${primaryColor}11;border-radius:12px">
        <p style="margin:0;font-size:15px;color:#222">${escape(insight)}</p>
      </div>
    </div>

    <!-- Tag -->
    <div style="margin-top:40px;padding-top:32px;border-top:1px solid #eee">
      <h3 style="font-size:13px;letter-spacing:0.15em;text-transform:uppercase;color:#666;margin:0 0 12px">Punti di forza</h3>
      <div>${forzaTags}</div>
      <h3 style="font-size:13px;letter-spacing:0.15em;text-transform:uppercase;color:#666;margin:24px 0 12px">Aree di lavoro</h3>
      <div>${lavoroTags}</div>
    </div>

    <!-- CTA -->
    <div style="margin-top:40px;padding:24px;background:#0a0a0a;border-radius:14px;text-align:center;color:white">
      <p style="margin:0 0 12px;font-size:15px;line-height:1.5">Vuoi trasformare questo profilo in un percorso reale di crescita mentale e sportiva?</p>
      <a href="https://memindsport.it" style="display:inline-block;background:white;color:#0a0a0a;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:8px;font-size:14px">Scopri i percorsi MeMindSport →</a>
    </div>

    <!-- Footer -->
    <div style="margin-top:32px;padding-top:24px;border-top:1px solid #eee;text-align:center;font-size:11px;color:#999;line-height:1.6">
      <p style="margin:0">Report generato per ${escape(lead.email)}</p>
      <p style="margin:4px 0 0">MeMindSport — il tuo allenamento mentale, su misura.</p>
    </div>

  </div>
</body>
</html>`;
}

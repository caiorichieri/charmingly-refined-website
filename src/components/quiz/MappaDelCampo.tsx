import { PROFILE_COLORS, PROFILE_LABELS, TYPE_COORDS, ZONES, getAthletePoint, type ProfileResult } from "@/lib/quiz-profile";

type Props = { result: ProfileResult; pinLabel?: string };

// Atto 1 — Mappa del campo, in chiave "campo sportivo stilizzato":
// arena ovale con 4 zone sfumate, pin luminoso dell'atleta, traiettoria curva
// verso la zona del flusso. Nessun asse cartesiano, tipografia display.
export function MappaDelCampo({ result, pinLabel = "TU" }: Props) {
  const W = 480;
  const H = 360;
  const cx = W / 2;
  const cy = H / 2;
  const rx = 200; // raggio orizzontale arena
  const ry = 150; // raggio verticale arena

  // Mappa coordinate doc (0..1) → punti dentro l'ellisse arena.
  const toArena = (x: number, y: number) => {
    const nx = (x - 0.5) * 2; // -1..1
    const ny = (0.5 - y) * 2; // -1..1 (y doc: 0 basso → in alto)
    // riduce leggermente per non toccare il bordo
    return { x: cx + nx * rx * 0.78, y: cy + ny * ry * 0.78 };
  };

  const athletePoint = getAthletePoint(result);
  const pin = toArena(athletePoint.x, athletePoint.y);
  // Target = centro della zona del flusso (alto-sx)
  const target = toArena(0.32, 0.78);

  const primaryColor = PROFILE_COLORS[result.primary];
  const primaryZone = TYPE_COORDS[result.primary].zone;

  // Curva di Bezier morbida dal pin al target
  const mx = (pin.x + target.x) / 2;
  const my = (pin.y + target.y) / 2 - 40;
  const path = `M ${pin.x} ${pin.y} Q ${mx} ${my} ${target.x} ${target.y}`;

  // Definizione delle 4 zone in coordinate doc (centro di ciascuna)
  const zoneCenters: Array<{ zone: keyof typeof ZONES; doc: { x: number; y: number } }> = [
    { zone: "flusso",   doc: { x: 0.27, y: 0.80 } },
    { zone: "fuoco",    doc: { x: 0.73, y: 0.80 } },
    { zone: "mappa",    doc: { x: 0.27, y: 0.20 } },
    { zone: "silenzio", doc: { x: 0.73, y: 0.20 } },
  ];

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-lg mx-auto block" role="img" aria-label="Mappa del campo">
        <defs>
          {/* Gradiente arena */}
          <radialGradient id="arenaBg" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.04" />
            <stop offset="70%" stopColor="currentColor" stopOpacity="0.10" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.16" />
          </radialGradient>

          {/* Sfumature zone */}
          {(Object.entries(ZONES) as Array<[keyof typeof ZONES, typeof ZONES[keyof typeof ZONES]]>).map(([key, z]) => (
            <radialGradient key={key} id={`zone-${key}`} cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor={PROFILE_COLORS[z.type]} stopOpacity={key === primaryZone ? 0.55 : 0.18} />
              <stop offset="100%" stopColor={PROFILE_COLORS[z.type]} stopOpacity="0" />
            </radialGradient>
          ))}

          {/* Glow pin */}
          <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.7" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
          </radialGradient>

          {/* Freccia */}
          <marker id="arenaArrow" markerWidth="10" markerHeight="10" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 L2,4 Z" fill={primaryColor} />
          </marker>

          {/* Clip arena ovale */}
          <clipPath id="arenaClip">
            <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
          </clipPath>
        </defs>

        {/* Arena base */}
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#arenaBg)" />

        {/* Linee curve di campo (estetica sportiva) */}
        <g clipPath="url(#arenaClip)" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" fill="none">
          <ellipse cx={cx} cy={cy} rx={rx * 0.95} ry={ry * 0.95} />
          <ellipse cx={cx} cy={cy} rx={rx * 0.55} ry={ry * 0.55} />
          <circle cx={cx} cy={cy} r="22" />
          <line x1={cx} y1={cy - ry} x2={cx} y2={cy + ry} strokeDasharray="2 6" />
        </g>

        {/* Zone (radial blobs) */}
        <g clipPath="url(#arenaClip)">
          {zoneCenters.map((zc) => {
            const c = toArena(zc.doc.x, zc.doc.y);
            return (
              <circle
                key={zc.zone}
                cx={c.x}
                cy={c.y}
                r="130"
                fill={`url(#zone-${zc.zone})`}
              />
            );
          })}
        </g>

        {/* Bordo arena */}
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />

        {/* Etichette zone */}
        {zoneCenters.map((zc) => {
          const c = toArena(zc.doc.x, zc.doc.y);
          const z = ZONES[zc.zone];
          const isActive = zc.zone === primaryZone;
          const col = PROFILE_COLORS[z.type];
          return (
            <g key={`label-${zc.zone}`}>
              <text
                x={c.x}
                y={c.y - 6}
                textAnchor="middle"
                fontSize="11"
                fontWeight={isActive ? 700 : 600}
                fill={col}
                opacity={isActive ? 1 : 0.85}
                style={{ letterSpacing: "0.04em", textTransform: "uppercase" }}
              >
                {z.name.replace("Zona del ", "").replace("Zona della ", "")}
              </text>
              <text
                x={c.x}
                y={c.y + 10}
                textAnchor="middle"
                fontSize="9"
                fill={col}
                opacity={isActive ? 0.85 : 0.55}
              >
                {PROFILE_LABELS[z.type].name}
              </text>
            </g>
          );
        })}

        {/* Traiettoria curva pin → target */}
        <path
          d={path}
          fill="none"
          stroke={primaryColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="2 6"
          markerEnd="url(#arenaArrow)"
          opacity="0.85"
        />

        {/* Glow + pin */}
        <circle cx={pin.x} cy={pin.y} r="28" fill="url(#pinGlow)" />
        <circle cx={pin.x} cy={pin.y} r="16" fill={primaryColor} stroke="white" strokeWidth="2.5" />
        <text
          x={pin.x}
          y={pin.y + 4}
          textAnchor="middle"
          fontSize="10"
          fontWeight={800}
          fill="white"
          style={{ letterSpacing: "0.06em" }}
        >
          {pinLabel}
        </text>

        {/* Target marker discreto */}
        <circle cx={target.x} cy={target.y} r="5" fill="none" stroke={primaryColor} strokeWidth="1.5" opacity="0.6" />
      </svg>

      <p className="mt-2 text-center text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        Sei qui · La direzione è il flusso
      </p>
    </div>
  );
}

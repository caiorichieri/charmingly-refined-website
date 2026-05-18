import { PROFILE_COLORS, PROFILE_LABELS, TYPE_COORDS, ZONES, getAthletePoint, type ProfileResult } from "@/lib/quiz-profile";

type Props = { result: ProfileResult; athleteInitials: string };

// Concept C — Mappa del campo (4 quadranti + punto atleta + freccia verso la zona del flusso).
export function MappaDelCampo({ result, athleteInitials }: Props) {
  const W = 360;
  const H = 320;
  const pad = 28;
  const innerW = W - pad * 2;
  const innerH = H - pad * 2;

  const point = getAthletePoint(result);
  // y coord nel doc: 0 = basso, 1 = alto. SVG: 0 = alto.
  const px = pad + point.x * innerW;
  const py = pad + (1 - point.y) * innerH;

  // Zona target = sempre flusso (centro-alto-sx).
  const targetX = pad + 0.45 * innerW;
  const targetY = pad + (1 - 0.85) * innerH;

  const primaryColor = PROFILE_COLORS[result.primary];
  const primaryZone = TYPE_COORDS[result.primary].zone;

  const quadrants: Array<{
    zone: keyof typeof ZONES;
    x: number; y: number; w: number; h: number;
  }> = [
    { zone: "mappa",    x: pad,                  y: pad + innerH / 2, w: innerW / 2, h: innerH / 2 },
    { zone: "flusso",   x: pad,                  y: pad,              w: innerW / 2, h: innerH / 2 },
    { zone: "silenzio", x: pad + innerW / 2,     y: pad + innerH / 2, w: innerW / 2, h: innerH / 2 },
    { zone: "fuoco",    x: pad + innerW / 2,     y: pad,              w: innerW / 2, h: innerH / 2 },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-md mx-auto block">
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={primaryColor} />
          </marker>
        </defs>

        {/* Quadranti */}
        {quadrants.map((q) => {
          const z = ZONES[q.zone];
          const col = PROFILE_COLORS[z.type];
          const isActive = q.zone === primaryZone;
          return (
            <g key={q.zone}>
              <rect
                x={q.x}
                y={q.y}
                width={q.w}
                height={q.h}
                fill={col}
                fillOpacity={isActive ? 0.18 : 0.07}
                stroke={col}
                strokeOpacity={0.4}
                strokeWidth={0.5}
              />
              <text x={q.x + 10} y={q.y + 18} fontSize={10} fontWeight={700} fill={col}>
                {z.name}
              </text>
              <text x={q.x + 10} y={q.y + 32} fontSize={8} fill="currentColor" opacity={0.7}>
                {z.axisLabel}
              </text>
              <text x={q.x + 10} y={q.y + q.h - 10} fontSize={9} fontWeight={600} fill={col}>
                {PROFILE_LABELS[z.type].name}
              </text>
            </g>
          );
        })}

        {/* Assi */}
        <line x1={pad} y1={pad + innerH / 2} x2={pad + innerW} y2={pad + innerH / 2}
              stroke="currentColor" strokeOpacity={0.3} strokeDasharray="3,3" strokeWidth={0.5} />
        <line x1={pad + innerW / 2} y1={pad} x2={pad + innerW / 2} y2={pad + innerH}
              stroke="currentColor" strokeOpacity={0.3} strokeDasharray="3,3" strokeWidth={0.5} />

        {/* Freccia percorso */}
        <line
          x1={px} y1={py} x2={targetX} y2={targetY}
          stroke={primaryColor} strokeWidth={1.5} strokeDasharray="4,3"
          markerEnd="url(#arrowhead)"
          opacity={0.8}
        />

        {/* Punto atleta */}
        <circle cx={px} cy={py} r={15} fill={primaryColor} stroke="white" strokeWidth={2} />
        <text x={px} y={py + 4} fontSize={10} fontWeight={700} fill="white" textAnchor="middle">
          {athleteInitials}
        </text>
      </svg>
    </div>
  );
}

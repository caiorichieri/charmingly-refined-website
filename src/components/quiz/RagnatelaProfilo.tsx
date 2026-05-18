import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { PROFILE_COLORS, PROFILE_LABELS, PROFILE_ORDER, type ProfileResult } from "@/lib/quiz-profile";

type Props = { result: ProfileResult };

// Concept A — Ragnatela del profilo (radar a 6 assi, scala 0–12).
export function RagnatelaProfilo({ result }: Props) {
  const data = PROFILE_ORDER.map((key, i) => ({
    axis: PROFILE_LABELS[key].short,
    value: result.scores[i],
    fullMark: 12,
  }));

  const color = PROFILE_COLORS[result.primary];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 12, right: 24, bottom: 12, left: 24 }}>
          <PolarGrid stroke="currentColor" strokeOpacity={0.18} />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fontSize: 11, fontWeight: 500, fill: "currentColor", opacity: 0.85 }}
          />
          <PolarRadiusAxis angle={90} domain={[0, 12]} tick={{ fontSize: 9, opacity: 0.4 }} tickCount={5} />
          <Radar
            name="profilo"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            fill={color}
            fillOpacity={0.18}
            dot={{ r: 5, fill: color, stroke: "white", strokeWidth: 2 }}
            activeDot={{ r: 7 }}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(v: number) => [`${v}/12`, "punteggio"]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

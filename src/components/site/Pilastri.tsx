import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Brain,
  Timer,
  RefreshCw,
  HeartPulse,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";

type Path = { id: string; title: string; description: string; icon: string | null };

const iconMap: Record<string, LucideIcon> = {
  brain: Brain,
  timer: Timer,
  "refresh-cw": RefreshCw,
  "heart-pulse": HeartPulse,
  sparkles: Sparkles,
  target: Target,
};

const accents = [
  "var(--brand-green)",
  "var(--brand-blue)",
  "var(--brand-red)",
];

export function Pilastri() {
  const { data: rows = [] } = useQuery({
    queryKey: ["public", "paths"],
    queryFn: async () => {
      const { data } = await supabase
        .from("paths")
        .select("id, title, description, icon")
        .eq("published", true)
        .order("display_order");
      return (data ?? []) as Path[];
    },
  });

  return (
    <section className="bg-off py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-[1180px] mx-auto">
        <div className="reveal">
          <div className="eyebrow mb-4">Percorsi mentali</div>
          <h2 className="h-display text-[clamp(34px,4.2vw,56px)]">
            Le aree di lavoro<br />del nostro metodo.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {rows.map((p, i) => {
            const Icon = (p.icon && iconMap[p.icon]) || Sparkles;
            const color = accents[i % accents.length];
            return (
              <article
                key={p.id}
                className="reveal group bg-white border border-line rounded-lg p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: `color-mix(in oklab, ${color} 14%, transparent)`,
                    color,
                  }}
                >
                  <Icon size={22} strokeWidth={2.2} />
                </div>
                <h3 className="font-display text-[22px] font-extrabold leading-tight mb-3">
                  {p.title}
                </h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed">
                  {p.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

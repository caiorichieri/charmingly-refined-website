import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Path = { id: string; title: string; description: string; icon: string | null };

const fallbackImages = [
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=85",
  "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=85",
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=85",
];
const colors = ["var(--brand-green)", "var(--brand-blue)", "var(--brand-red)"];
const tags = ["Professionisti", "VR immersiva", "App + AI"];

export function Pilastri() {
  const { data: rows = [] } = useQuery({
    queryKey: ["public", "paths"],
    queryFn: async () => {
      const { data } = await supabase.from("paths").select("id, title, description, icon").eq("published", true).order("display_order");
      return (data ?? []) as Path[];
    },
  });

  const visible = rows.slice(0, 3);

  return (
    <section className="bg-off py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-[1180px] mx-auto">
        <div className="reveal">
          <div className="eyebrow mb-4">L'ecosistema</div>
          <h2 className="h-display text-[clamp(34px,4.2vw,56px)]">Un ecosistema costruito<br />per chi compete.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {visible.map((p, i) => {
            const isUrl = !!p.icon && /^(https?:)?\/\//.test(p.icon);
            const img = isUrl ? (p.icon as string) : fallbackImages[i];
            const color = colors[i];
            const tag = tags[i];
            return (
              <article
                key={p.id}
                className="reveal group bg-white border border-line rounded-lg overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="h-44 overflow-hidden relative">
                  <img src={img} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-7">
                  <span
                    className="inline-block text-[11px] font-bold tracking-[0.14em] uppercase px-3 py-1 rounded mb-3"
                    style={{ background: `color-mix(in oklab, ${color} 14%, transparent)`, color }}
                  >
                    {tag}
                  </span>
                  <h3 className="font-display text-[22px] font-extrabold leading-tight mb-3">{p.title}</h3>
                  <p className="text-[14px] text-muted-foreground leading-relaxed">{p.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

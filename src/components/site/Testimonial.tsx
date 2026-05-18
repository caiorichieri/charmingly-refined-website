import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type T = { id: string; author_name: string; author_role: string; content: string; photo_url: string | null; rating: number };

export function Testimonial() {
  const { data: testi = [] } = useQuery({
    queryKey: ["public", "testimonials"],
    queryFn: async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("id, author_name, author_role, content, photo_url, rating")
        .eq("approved", true)
        .order("display_order");
      return (data ?? []) as T[];
    },
  });

  if (testi.length === 0) return null;

  return (
    <section className="bg-white py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-[1180px] mx-auto">
        <div className="reveal">
          <div className="eyebrow mb-4">Chi lo usa</div>
          <h2 className="h-display text-[clamp(34px,4.2vw,56px)]">Atleti che hanno scelto<br />di lavorare sulla mente</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {testi.map((t, i) => (
            <figure
              key={t.id}
              className="reveal flex flex-col gap-4 bg-off border border-line rounded-lg p-7 transition-all duration-500 hover:bg-white hover:shadow-card hover:-translate-y-1 relative"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="font-display text-6xl text-brand-green/25 leading-none absolute top-3 right-5 select-none">
                "
              </div>
              <div className="text-[15px] tracking-[2px]" style={{ color: "oklch(0.78 0.16 75)" }}>{"★".repeat(t.rating)}</div>
              <blockquote className="text-[14.5px] leading-relaxed italic text-foreground">{t.content}</blockquote>
              <figcaption className="flex items-center gap-3 mt-auto pt-3 border-t border-line">
                {t.photo_url && (
                  <div className="h-11 w-11 rounded-full overflow-hidden flex-shrink-0">
                    <img src={t.photo_url} alt={t.author_name} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                )}
                <div>
                  <div className="text-[14px] font-semibold text-foreground">{t.author_name}</div>
                  <div className="text-[12px] text-muted-foreground">{t.author_role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

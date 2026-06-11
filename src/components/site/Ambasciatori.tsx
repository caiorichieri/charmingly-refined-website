import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Row = {
  id: string;
  slug: string;
  full_name: string;
  tagline: string | null;
  location: string | null;
  photo_url: string | null;
  video_url: string | null;
  roles: { label: string; organization: string }[];
};

export function Ambasciatori() {
  const { data = [] } = useQuery({
    queryKey: ["public", "ambassadors", "home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ambassadors" as never)
        .select("id, slug, full_name, tagline, location, photo_url, video_url, roles")
        .eq("published", true)
        .order("display_order")
        .limit(4);
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  if (data.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-ink-deep text-white py-24 md:py-32 px-6 md:px-12">
      {/* Decorative background: olympic rings + sunburst */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <svg
          className="absolute -top-20 -right-20 w-[600px] h-[600px]"
          viewBox="0 0 200 200"
          fill="none"
        >
          {/* Sunburst rays */}
          {Array.from({ length: 36 }).map((_, i) => (
            <line
              key={i}
              x1="100"
              y1="100"
              x2="100"
              y2="0"
              stroke="currentColor"
              strokeWidth="0.5"
              transform={`rotate(${i * 10} 100 100)`}
            />
          ))}
        </svg>
        {/* Olympic-style rings (stylized, non-IOC colors to avoid trademark) */}
        <svg className="absolute -bottom-10 -left-10 w-[500px]" viewBox="0 0 300 100" fill="none">
          <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="3" />
          <circle cx="110" cy="50" r="35" stroke="currentColor" strokeWidth="3" />
          <circle cx="170" cy="50" r="35" stroke="currentColor" strokeWidth="3" />
          <circle cx="80" cy="75" r="35" stroke="currentColor" strokeWidth="3" />
          <circle cx="140" cy="75" r="35" stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>

      {/* Gradient accent blobs */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-30"
        style={{ background: "var(--gradient-green)" }} />

      <div className="relative max-w-[1240px] mx-auto">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end mb-16">
          <div>
            <div className="flex items-center gap-3 mb-5">
              {/* Medal icon */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-brand-green">
                <path d="M7 4l2 6M17 4l-2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="15" r="6" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 12l1 2 2 .3-1.5 1.5.4 2.2L12 17l-1.9 1 .4-2.2L9 14.3l2-.3 1-2z" fill="currentColor"/>
              </svg>
              <div className="eyebrow text-brand-green">Ambasciatori MeMindSport</div>
            </div>
            <h2 className="h-display text-[clamp(34px,5vw,62px)] leading-[1.02]">
              Chi ha vinto contro tutto,
              <br />
              <em
                className="not-italic"
                style={{
                  background: "var(--gradient-green)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                oggi allena la mente con noi.
              </em>
            </h2>
          </div>
          <p className="text-white/70 text-[16px] leading-[1.7] max-w-md">
            Atleti paralimpici, campioni, imprenditori. Storie di superazione che diventano
            metodo. Ogni medaglia è il risultato di una mente allenata.
          </p>
        </div>

        {/* Featured collage: first ambassador large, others as cutouts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          {/* HERO ambassador (first one) */}
          {data[0] && (
            <Link
              to="/ambasciatori/$slug"
              params={{ slug: data[0].slug }}
              className="group relative lg:col-span-7 rounded-3xl overflow-hidden bg-gradient-to-br from-brand-green/20 to-ink min-h-[520px] flex items-end"
            >
              {/* Sun/halo behind */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[500px] h-[500px] rounded-full"
                style={{ background: "radial-gradient(circle, rgba(34,197,94,0.35) 0%, transparent 65%)" }} />
              {/* Olympic arch */}
              <svg className="absolute top-8 right-8 w-32 h-32 text-brand-green opacity-30" viewBox="0 0 100 100" fill="none">
                <path d="M10 80 Q50 0 90 80" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M20 80 Q50 15 80 80" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M30 80 Q50 30 70 80" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {/* Photo cutout */}
              {data[0].photo_url && (
                <img
                  src={data[0].photo_url}
                  alt={data[0].full_name}
                  className="absolute right-0 bottom-0 h-[105%] w-auto object-contain object-bottom transition-transform duration-700 group-hover:scale-[1.03] drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]"
                  style={{
                    maskImage:
                      "linear-gradient(to top, rgba(0,0,0,1) 80%, rgba(0,0,0,0.95) 100%)",
                  }}
                />
              )}
              {/* Video badge */}
              {data[0].video_url && (
                <div className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-white/95 text-ink font-bold text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full shadow-xl">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Video racconto
                </div>
              )}
              {/* Bottom info */}
              <div className="relative z-10 p-8 md:p-10 max-w-[58%]">
                {data[0].location && (
                  <div className="text-[11px] tracking-[0.15em] uppercase font-bold text-brand-green mb-3">
                    📍 {data[0].location}
                  </div>
                )}
                <h3 className="font-display text-3xl md:text-5xl font-extrabold leading-[1.02] mb-3">
                  {data[0].full_name}
                </h3>
                {data[0].roles?.[0] && (
                  <div className="text-white/80 text-sm md:text-base mb-4 font-semibold">
                    {data[0].roles[0].label}
                  </div>
                )}
                <span className="inline-flex items-center gap-2 text-brand-green font-bold text-sm group-hover:gap-3 transition-all">
                  Scopri la storia
                  <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          )}

          {/* Side stack: secondary ambassadors */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {data.slice(1, 3).map((a) => (
              <Link
                key={a.id}
                to="/ambasciatori/$slug"
                params={{ slug: a.slug }}
                className="group relative rounded-3xl overflow-hidden bg-white/5 backdrop-blur border border-white/10 min-h-[245px] flex hover:bg-white/[0.08] transition-all hover:-translate-y-1"
              >
                {/* Glow */}
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-40 blur-3xl"
                  style={{ background: "var(--gradient-green)" }} />
                {/* Photo cutout right */}
                {a.photo_url && (
                  <img
                    src={a.photo_url}
                    alt={a.full_name}
                    className="absolute right-0 bottom-0 h-[110%] w-auto object-contain object-bottom transition-transform duration-700 group-hover:scale-105"
                    style={{
                      maskImage:
                        "linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
                    }}
                  />
                )}
                {/* Decorative medal */}
                <svg className="absolute top-4 right-4 w-10 h-10 text-brand-green opacity-60" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="14" r="6" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 4l2 6M16 4l-2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <div className="relative z-10 p-6 max-w-[60%] flex flex-col justify-end">
                  {a.location && (
                    <div className="text-[10px] tracking-[0.12em] uppercase font-bold text-brand-green mb-2">
                      {a.location}
                    </div>
                  )}
                  <h3 className="font-display text-xl md:text-2xl font-extrabold leading-tight mb-2">
                    {a.full_name}
                  </h3>
                  {a.roles?.[0] && (
                    <div className="text-white/70 text-[12px] font-semibold line-clamp-2">
                      {a.roles[0].label}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA strip */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10">
          <div className="flex items-center gap-5 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-brand-green text-lg">🥇</span>
              <span className="font-semibold">Record mondiali</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-brand-green text-lg">🎯</span>
              <span className="font-semibold">Mente da campione</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-brand-green text-lg">🔥</span>
              <span className="font-semibold">Superazione</span>
            </div>
          </div>
          <Link
            to="/ambasciatori"
            className="inline-flex items-center gap-2 bg-brand-green text-white font-bold rounded-full px-7 py-3.5 hover:brightness-110 transition-all hover:gap-3"
          >
            Tutti gli ambasciatori →
          </Link>
        </div>
      </div>
    </section>
  );
}

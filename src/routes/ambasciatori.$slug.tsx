import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useRef, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { ExternalLink } from "lucide-react";

type Ambassador = {
  id: string;
  slug: string;
  full_name: string;
  tagline: string | null;
  location: string | null;
  bio: string | null;
  photo_url: string | null;
  cover_url: string | null;
  website_url: string | null;
  video_url: string | null;
  social_links: Record<string, string>;
  roles: { label: string; organization: string }[];
  stats: { value: string; label: string }[];
  organizations: { name: string; description?: string; logo_url?: string; url?: string }[];
  honors: { title: string; issuer?: string; year?: string; image_url?: string; description?: string }[];
  values: { title: string; body: string }[];
  quote_text: string | null;
};

async function fetchAmbassador(slug: string): Promise<Ambassador | null> {
  const { data, error } = await supabase
    .from("ambassadors" as never)
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as Ambassador) ?? null;
}

export const Route = createFileRoute("/ambasciatori/$slug")({
  loader: async ({ params }) => {
    const row = await fetchAmbassador(params.slug);
    if (!row) throw notFound();
    return { ambassador: row };
  },
  head: ({ loaderData }) => {
    const a = loaderData?.ambassador;
    const title = a ? `${a.full_name} — Ambasciatore MeMindSport` : "Ambasciatore — MeMindSport";
    const desc = a?.tagline ?? "Ambasciatori MeMindSport";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(a?.photo_url ? [{ property: "og:image" as const, content: a.photo_url }] : []),
      ],
    };
  },
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-8 text-center">
      <p className="text-muted-foreground">Errore: {error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center gap-4">
      <h1 className="font-display text-3xl font-bold">Ambasciatore non trovato</h1>
      <Link to="/ambasciatori" className="text-brand-green font-semibold hover:underline">
        ← Torna agli ambasciatori
      </Link>
    </div>
  ),
  component: AmbasciatoreDetail,
});

function AmbasciatoreDetail() {
  const { slug } = Route.useParams();
  const initial = Route.useLoaderData().ambassador;
  const { data } = useQuery<Ambassador | null>({
    queryKey: ["public", "ambassador", slug],
    queryFn: () => fetchAmbassador(slug),
    initialData: initial,
  });
  const a: Ambassador | null = data ?? initial;

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSectionRef = useRef<HTMLElement>(null);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);

  useEffect(() => {
    if (!videoSectionRef.current || !a?.video_url || hasAutoPlayed) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current && !hasAutoPlayed) {
            setHasAutoPlayed(true);
            const timer = setTimeout(() => {
              videoRef.current?.play().catch(() => {});
            }, 2500);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(videoSectionRef.current);
    return () => observer.disconnect();
  }, [a?.video_url, hasAutoPlayed]);

  if (!a) return null;

  return (
    <>
      <Nav />
      <main className="pt-[96px]">
        {/* Hero */}
        <section className="bg-off py-16 md:py-24 px-6 md:px-12">
          <div className="max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <Link
                to="/ambasciatori"
                className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
              >
                ← Ambasciatori
              </Link>
              {a.location && <div className="eyebrow mb-3">{a.location}</div>}
              <h1 className="h-display text-[clamp(36px,5vw,68px)] mb-5 leading-[1.05]">
                {a.full_name}
              </h1>
              {a.roles?.length > 0 && (
                <ol className="flex flex-col gap-1.5 mb-6">
                  {a.roles.map((r, i) => (
                    <li key={i} className="text-[15px] text-foreground/80">
                      <span className="text-brand-green font-bold mr-2">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-semibold">{r.label}</span>
                      {r.organization && (
                        <span className="text-muted-foreground"> · {r.organization}</span>
                      )}
                    </li>
                  ))}
                </ol>
              )}
              {a.tagline && (
                <p className="text-[17px] text-foreground/75 leading-[1.75] max-w-[560px] mb-6">
                  {a.tagline}
                </p>
              )}
              {a.website_url && (
                <a
                  href={a.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-ink text-white font-bold rounded-full px-6 py-3 hover:brightness-110"
                >
                  Sito ufficiale <ExternalLink size={14} />
                </a>
              )}
            </div>
            <div className="relative">
              {a.photo_url && (
                <img
                  src={a.photo_url}
                  alt={a.full_name}
                  className="w-full h-auto max-h-[600px] object-contain"
                />
              )}
            </div>
          </div>
        </section>

        {/* Stats */}
        {a.stats?.length > 0 && (
          <section className="bg-white py-16 px-6 md:px-12 border-b border-line">
            <div className="max-w-[1180px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
              {a.stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="font-display text-5xl md:text-6xl font-extrabold text-brand-green mb-2">
                    {s.value}
                  </div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Organizations */}
        {a.organizations?.length > 0 && (
          <section className="bg-off py-20 px-6 md:px-12">
            <div className="max-w-[1180px] mx-auto">
              <div className="eyebrow mb-3">Le realtà che rappresenta</div>
              <h2 className="h-display text-[clamp(28px,3.5vw,44px)] mb-10">
                Dove porta il suo impegno.
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {a.organizations.map((o, i) => {
                  const Wrapper = o.url ? "a" : "div";
                  return (
                    <Wrapper
                      key={i}
                      {...(o.url
                        ? { href: o.url, target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="bg-white border border-line rounded-2xl p-6 flex flex-col gap-4 transition-all hover:shadow-card hover:-translate-y-0.5"
                    >
                      {o.logo_url && (
                        <div className="h-16 flex items-center">
                          <img
                            src={o.logo_url}
                            alt={o.name}
                            className="max-h-full max-w-[140px] object-contain"
                          />
                        </div>
                      )}
                      <div>
                        <div className="font-display font-bold text-lg text-ink">{o.name}</div>
                        {o.description && (
                          <div className="text-sm text-muted-foreground mt-1">{o.description}</div>
                        )}
                      </div>
                    </Wrapper>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Honors */}
        {a.honors?.length > 0 && (
          <section className="bg-white py-20 px-6 md:px-12">
            <div className="max-w-[1180px] mx-auto">
              <div className="eyebrow mb-3">Onorificenze e riconoscimenti</div>
              <h2 className="h-display text-[clamp(28px,3.5vw,44px)] mb-10">
                Riconoscimenti ufficiali.
              </h2>
              <div className="flex flex-col gap-6">
                {a.honors.map((h, i) => (
                  <article
                    key={i}
                    className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 bg-off border border-line rounded-2xl p-6"
                  >
                    {h.image_url && (
                      <div className="h-32 md:h-40 flex items-center justify-center">
                        <img
                          src={h.image_url}
                          alt={h.title}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}
                    <div>
                      {h.year && (
                        <div className="text-xs uppercase tracking-wider font-bold text-brand-green mb-2">
                          {h.year}
                        </div>
                      )}
                      <h3 className="font-display text-2xl font-extrabold text-ink mb-2">
                        {h.title}
                      </h3>
                      {h.issuer && (
                        <div className="text-sm font-semibold text-foreground/70 mb-3">
                          {h.issuer}
                        </div>
                      )}
                      {h.description && (
                        <p className="text-[15px] text-foreground/75 leading-relaxed">
                          {h.description}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Video */}
        {a.video_url && (
          <section ref={videoSectionRef} className="bg-ink py-20 px-6 md:px-12">
            <div className="max-w-[1000px] mx-auto">
              <div className="eyebrow text-white/60 mb-3">In sua voce</div>
              <h2 className="h-display text-white text-[clamp(28px,3.5vw,44px)] mb-8">
                {a.full_name} racconta MeMindSport.
              </h2>
              <div className="rounded-2xl overflow-hidden bg-black aspect-video shadow-card relative group">
                <video
                  ref={videoRef}
                  src={a.video_url}
                  controls
                  muted
                  playsInline
                  preload="metadata"
                  poster={a.photo_url ?? undefined}
                  className="w-full h-full object-contain bg-black"
                />
              </div>
            </div>
          </section>
        )}

        {/* MeMindSport quote */}
        {a.quote_text && (
          <section className="bg-ink-deep text-white py-20 px-6 md:px-12">
            <div className="max-w-[900px] mx-auto text-center">
              <div className="eyebrow text-white/60 mb-4">Ambasciatore MeMindSport</div>
              <blockquote className="font-display text-[clamp(24px,3vw,36px)] font-bold italic leading-[1.35] text-white">
                « {a.quote_text} »
              </blockquote>
              <div className="mt-6 text-white/70">— {a.full_name}</div>
            </div>
          </section>
        )}

        {/* Bio */}
        {a.bio && (
          <section className="bg-white py-20 px-6 md:px-12">
            <div className="max-w-[800px] mx-auto">
              <div className="eyebrow mb-3">Biografia</div>
              <h2 className="h-display text-[clamp(28px,3.5vw,44px)] mb-6">Un percorso, una visione.</h2>
              <div className="text-[17px] text-foreground/80 leading-[1.85] whitespace-pre-line">
                {a.bio}
              </div>
            </div>
          </section>
        )}

        {/* Values */}
        {a.values?.length > 0 && (
          <section className="bg-off py-20 px-6 md:px-12">
            <div className="max-w-[1180px] mx-auto">
              <div className="eyebrow mb-3">Valori</div>
              <h2 className="h-display text-[clamp(28px,3.5vw,44px)] mb-10">
                I principi che guidano ogni scelta.
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {a.values.map((v, i) => (
                  <div key={i} className="bg-white border border-line rounded-2xl p-6">
                    <div className="font-display text-xl font-extrabold text-ink mb-3">
                      {v.title}
                    </div>
                    <p className="text-[14px] text-foreground/70 leading-relaxed">{v.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/ambasciatori/")({
  head: () => ({
    meta: [
      { title: "Ambasciatori — MeMindSport" },
      {
        name: "description",
        content:
          "Le persone che portano il metodo MeMindSport nel mondo dello sport: storie, valori e riconoscimenti dei nostri ambasciatori.",
      },
      { property: "og:title", content: "Ambasciatori — MeMindSport" },
      {
        property: "og:description",
        content:
          "Persone che allenano la mente e portano il metodo MeMindSport nel mondo dello sport.",
      },
    ],
  }),
  component: AmbasciatoriIndex,
});

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

function AmbasciatoriIndex() {
  const { data = [] } = useQuery({
    queryKey: ["public", "ambassadors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ambassadors" as never)
        .select("id, slug, full_name, tagline, location, photo_url, video_url, roles")
        .eq("published", true)
        .order("display_order");
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  return (
    <>
      <Nav />
      <main className="pt-[96px]">
        <section className="bg-off py-24 md:py-32 px-6 md:px-12">
          <div className="max-w-[1180px] mx-auto">
            <div className="max-w-3xl">
              <div className="eyebrow mb-4">Ambasciatori MeMindSport</div>
              <h1 className="h-display text-[clamp(34px,5vw,64px)] mb-5">
                Persone che allenano la mente,
                <br />
                <em
                  className="not-italic"
                  style={{
                    background: "var(--gradient-green)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontStyle: "italic",
                  }}
                >
                  e portano il metodo nel mondo.
                </em>
              </h1>
              <p className="text-[17px] text-foreground/70 leading-[1.75] max-w-[680px]">
                Imprenditori, atleti, dirigenti e professionisti che hanno scelto
                MeMindSport e ne raccontano la storia sul territorio. Ognuno con il
                proprio percorso, lo stesso impegno: mettere la mente al centro della
                performance e del benessere.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28 px-6 md:px-12">
          <div className="max-w-[1180px] mx-auto">
            {data.length === 0 ? (
              <p className="text-center text-muted-foreground py-16">
                I primi ambasciatori arrivano presto.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {data.map((a) => (
                  <Link
                    key={a.id}
                    to="/ambasciatori/$slug"
                    params={{ slug: a.slug }}
                    className="group flex flex-col bg-white border-2 border-line rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-card hover:border-transparent"
                  >
                    <div className="relative h-72 bg-off overflow-hidden">
                      {a.photo_url && (
                        <img
                          src={a.photo_url}
                          alt={a.full_name}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      )}
                      {a.video_url && (
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-ink font-bold text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          Video
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col gap-3 flex-1">
                      {a.location && (
                        <div className="text-[11px] tracking-[0.12em] uppercase font-bold text-brand-green">
                          {a.location}
                        </div>
                      )}
                      <h2 className="font-display text-2xl font-extrabold text-ink leading-tight">
                        {a.full_name}
                      </h2>
                      {a.roles?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {a.roles.slice(0, 3).map((r, i) => (
                            <span
                              key={i}
                              className="text-[11px] font-semibold bg-off text-foreground/70 px-2 py-1 rounded"
                            >
                              {r.label}
                            </span>
                          ))}
                        </div>
                      )}
                      {a.tagline && (
                        <p className="text-[14px] text-foreground/70 leading-relaxed line-clamp-3">
                          {a.tagline}
                        </p>
                      )}
                      <span className="mt-auto pt-3 text-sm font-bold text-brand-green group-hover:underline">
                        Scopri la storia →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-ink-deep text-white py-20 px-6 md:px-12">
          <div className="max-w-[800px] mx-auto text-center">
            <div className="eyebrow text-white/60 mb-4">Diventa ambasciatore</div>
            <h2 className="h-display text-[clamp(28px,3.5vw,44px)] mb-5">
              Vuoi portare MeMindSport nel tuo territorio?
            </h2>
            <p className="text-white/70 mb-8 text-[16px] leading-relaxed">
              Cerchiamo persone con visione, impegno civico e radici nello sport. Se
              pensi di poter raccontare il metodo MeMindSport nella tua comunità,
              contattaci.
            </p>
            <a
              href="https://wa.me/393313904736?text=Ciao%2C%20vorrei%20informazioni%20sul%20programma%20Ambasciatori%20MeMindSport"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-green text-white font-bold rounded-full px-7 py-3.5 hover:brightness-110"
            >
              Scrivici su WhatsApp →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

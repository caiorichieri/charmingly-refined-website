import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, MapPin, Ticket } from "lucide-react";

type EventRow = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  location: string;
  event_date: string;
  cover_url: string;
  price: string;
  price_detail: string;
  info: string;
  sold_out: boolean;
};

export const Route = createFileRoute("/eventi")({
  head: () => ({
    meta: [
      { title: "Formazione MeMindSport — Workshop per psicologi dello sport" },
      {
        name: "description",
        content:
          "Workshop e convegni per psicologi: mental coaching evidence-based, realtà virtuale e neurofeedback nell'allenamento mentale degli atleti.",
      },
      { property: "og:title", content: "Formazione MeMindSport — Workshop per psicologi" },
      {
        property: "og:description",
        content:
          "Workshop e convegni per psicologi: mental coaching, realtà virtuale immersiva e neurofeedback nell'allenamento mentale degli atleti.",
      },
      { property: "og:url", content: "https://memindsport.it/eventi" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://memindsport.it/eventi" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Formazione MeMindSport per psicologi dello sport",
          url: "https://memindsport.it/eventi",
        }),
      },
    ],
  }),
  component: EventiPage,
});

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

function formatTime(d: string) {
  try {
    return new Date(d).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function EventiPage() {
  useReveal();
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["public", "events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("published", true)
        .order("event_date", { ascending: true });
      if (error) throw error;
      return (data ?? []) as EventRow[];
    },
  });

  return (
    <main className="bg-background">
      <Nav />

      <section className="pt-[140px] pb-16 px-6 md:px-12 bg-ink-deep text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(60% 60% at 80% 30%, color-mix(in oklab, var(--brand-green) 22%, transparent), transparent 70%)",
          }}
        />
        <div className="relative max-w-[1180px] mx-auto">
          <div className="eyebrow mb-4">Formazione MeMindSport</div>
          <h1 className="h-display text-[clamp(40px,5vw,72px)] max-w-3xl">
            Formazione per{" "}
            <em
              className="not-italic"
              style={{
                background: "var(--gradient-green)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontStyle: "italic",
              }}
            >
              psicologi
            </em>{" "}
            dello sport.
          </h1>
          <p className="mt-5 max-w-2xl text-[17px] text-white/65 leading-[1.75]">
            Workshop, convegni e giornate formative dedicati a chi vuole portare
            mental coaching evidence-based, realtà virtuale immersiva e neurofeedback
            nella pratica clinica con gli atleti.
          </p>
        </div>
      </section>

      <section className="bg-off py-20 px-6 md:px-12">
        <div className="max-w-[1180px] mx-auto">
          {isLoading && (
            <p className="text-center text-muted-foreground">Caricamento eventi…</p>
          )}

          {!isLoading && events.length === 0 && (
            <p className="text-center text-muted-foreground">
              Nessun evento in programma al momento. Torna a trovarci presto.
            </p>
          )}

          <div className="flex flex-col gap-10">
            {events.map((ev) => (
              <article
                key={ev.id}
                className="reveal group grid grid-cols-1 md:grid-cols-2 gap-0 bg-white border border-line rounded-2xl overflow-hidden hover:shadow-card transition-all duration-500"
              >
                <div className="relative h-64 md:h-full min-h-[280px] overflow-hidden">
                  <img
                    src={ev.cover_url}
                    alt={ev.title}
                    loading="lazy"
                    width={1280}
                    height={768}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {ev.sold_out && (
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm py-3 text-center shadow-[0_4px_24px_rgba(0,0,0,0.18)] rotate-[-4deg]">
                      <span className="font-display text-2xl md:text-3xl font-extrabold tracking-[0.18em] text-ink">
                        SOLD OUT
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-8 md:p-10 flex flex-col gap-4 justify-center">
                  <div className="flex flex-wrap items-center gap-3 text-[12px] font-bold tracking-[0.14em] uppercase text-brand-green">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={14} />
                      {formatDate(ev.event_date)} · {formatTime(ev.event_date)}
                    </span>
                  </div>

                  <h2 className="font-display text-[clamp(22px,2.4vw,32px)] font-extrabold leading-tight text-ink">
                    {ev.title}
                  </h2>
                  {ev.subtitle && (
                    <p className="text-[14px] font-semibold text-foreground/80">{ev.subtitle}</p>
                  )}

                  <p className="text-[15px] text-muted-foreground leading-relaxed">
                    {ev.description}
                  </p>

                  <div className="flex flex-col gap-2 text-[14px] text-foreground/80 mt-2">
                    {ev.location && (
                      <span className="inline-flex items-center gap-2">
                        <MapPin size={16} className="text-brand-green shrink-0" />
                        {ev.location}
                      </span>
                    )}
                    {ev.price && (
                      <span className="inline-flex items-center gap-2">
                        <Ticket size={16} className="text-brand-green shrink-0" />
                        <span>
                          <strong className="font-bold text-ink">{ev.price}</strong>
                          {ev.price_detail && (
                            <span className="text-muted-foreground"> · {ev.price_detail}</span>
                          )}
                        </span>
                      </span>
                    )}
                  </div>

                  {ev.info && (
                    <div
                      className={`mt-3 rounded-xl p-4 text-[13.5px] leading-relaxed ${
                        ev.sold_out
                          ? "bg-off text-muted-foreground border border-line"
                          : "bg-brand-green/10 text-foreground border border-brand-green/20"
                      }`}
                    >
                      {ev.info}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

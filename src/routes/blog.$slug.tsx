import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";
import { posts } from "@/lib/blog-posts";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.h} — MeMindSport` },
          { name: "description", content: loaderData.post.p },
          { property: "og:title", content: loaderData.post.h },
          { property: "og:description", content: loaderData.post.p },
          { property: "og:image", content: loaderData.post.img },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <main className="min-h-screen grid place-items-center bg-background">
      <div className="text-center">
        <h1 className="h-display text-5xl mb-4">Articolo non trovato</h1>
        <Link to="/blog" className="btn-primary">Torna al blog</Link>
      </div>
    </main>
  ),
  errorComponent: ({ error }) => (
    <main className="min-h-screen grid place-items-center bg-background px-6">
      <div className="text-center max-w-md">
        <h1 className="h-display text-4xl mb-3">Qualcosa è andato storto</h1>
        <p className="text-muted-foreground mb-6">{error.message}</p>
        <Link to="/blog" className="btn-primary">Torna al blog</Link>
      </div>
    </main>
  ),
  component: PostPage,
});

function PostPage() {
  useReveal();
  const { post } = Route.useLoaderData();
  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main className="bg-background">
      <Nav />

      <article>
        <div className="pt-[120px] pb-12 px-6 md:px-12 bg-ink-deep text-white relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(60% 60% at 70% 30%, color-mix(in oklab, var(--brand-green) 22%, transparent), transparent 70%)",
            }}
          />
          <div className="relative max-w-[860px] mx-auto">
            <Link to="/blog" className="text-[13px] text-white/60 hover:text-white inline-flex items-center gap-1.5 mb-6">
              ← Tutti gli articoli
            </Link>
            <div className="eyebrow mb-4">{post.tag}</div>
            <h1 className="h-display text-[clamp(34px,4.5vw,60px)] mb-5">{post.h}</h1>
            <div className="text-[13px] text-white/55">
              {post.date} · {post.readingTime} di lettura
            </div>
          </div>
        </div>

        <div className="px-6 md:px-12 -mt-6">
          <div className="max-w-[1000px] mx-auto rounded-2xl overflow-hidden shadow-card">
            <img src={post.img} alt={post.h} className="w-full h-[320px] md:h-[460px] object-cover" />
          </div>
        </div>

        <div className="py-16 md:py-20 px-6 md:px-12">
          <div className="max-w-[720px] mx-auto prose-content text-[17px] leading-[1.85] text-foreground/85 flex flex-col gap-5">
            <p className="text-[19px] leading-[1.75] text-foreground/90 font-medium">{post.p}</p>
            <p>
              Lo sport di prestazione mette costantemente l'atleta di fronte a momenti in cui la
              tecnica non basta: il pensiero, l'emozione e la percezione del contesto diventano
              variabili decisive. Allenare la mente significa imparare a gestire queste variabili
              prima, durante e dopo la competizione.
            </p>
            <h2 className="font-display text-[28px] font-extrabold mt-4">Perché conta</h2>
            <p>
              La ricerca in psicologia sportiva mostra come le abilità mentali — concentrazione,
              regolazione emotiva, self-talk, visualizzazione — siano allenabili esattamente come
              quelle fisiche. Non sono qualità "naturali": sono competenze che si costruiscono.
            </p>
            <h2 className="font-display text-[28px] font-extrabold mt-4">Come lavorarci</h2>
            <p>
              Il percorso con uno psicologo sportivo o un mental coach permette di costruire
              strumenti pratici: routine pre-gara, protocolli di gestione dell'errore, esercizi di
              attenzione, lavoro sull'identità sportiva. Gli ambienti immersivi aggiungono la
              possibilità di esperire e allenare le risposte mentali in scenari controllati.
            </p>
            <blockquote className="border-l-[3px] border-brand-green bg-brand-green/8 pl-5 pr-4 py-4 italic font-display text-[20px] leading-snug">
              La mente non si allena leggendo: si allena vivendo esperienze guidate e ripetute.
            </blockquote>
            <p>
              Se ti riconosci in questo articolo, il primo passo è capire da dove partire: il
              questionario di orientamento di MeMindSport ti aiuta a individuare il professionista
              più adatto al tuo sport, al tuo livello e al momento della stagione.
            </p>
          </div>

          <div className="reveal max-w-[720px] mx-auto mt-12 p-7 rounded-2xl bg-off border border-line text-center">
            <div className="font-display text-[22px] font-extrabold mb-2">
              Vuoi iniziare il tuo percorso?
            </div>
            <p className="text-[14px] text-muted-foreground mb-5">
              Compila il questionario di orientamento e scopri il professionista più adatto a te.
            </p>
            <Link to="/" hash="cta" className="btn-primary">
              Scopri il tuo profilo mentale →
            </Link>
          </div>
        </div>
      </article>

      <section className="bg-off py-20 px-6 md:px-12 border-t border-line">
        <div className="max-w-[1180px] mx-auto">
          <div className="eyebrow mb-4">Continua a leggere</div>
          <h2 className="h-display text-[clamp(26px,3vw,40px)] mb-8">Altri articoli</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {others.map((p) => (
              <Link
                key={p.slug}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="group bg-white border border-line rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:shadow-card hover:-translate-y-1"
              >
                <div className="h-40 overflow-hidden">
                  <img src={p.img} alt={p.h} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-brand-green">{p.tag}</span>
                  <h3 className="font-display text-[17px] font-extrabold leading-tight">{p.h}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

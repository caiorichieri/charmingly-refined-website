import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";
import { posts } from "@/lib/blog-posts";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — MeMindSport · Psicologia sportiva e mental coaching" },
      {
        name: "description",
        content:
          "Approfondimenti su psicologia dello sport, mental coaching, performance mentale, gestione della pressione, ansia da prestazione e ambienti immersivi.",
      },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  useReveal();
  const [hero, ...rest] = posts;

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
          <div className="eyebrow mb-4">Blog MeMindSport</div>
          <h1 className="h-display text-[clamp(40px,5vw,72px)] max-w-3xl">
            Mente, sport,{" "}
            <em
              className="not-italic"
              style={{
                background: "var(--gradient-green)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontStyle: "italic",
              }}
            >
              performance.
            </em>
          </h1>
          <p className="mt-5 max-w-2xl text-[17px] text-white/65 leading-[1.75]">
            Articoli su psicologia dello sport, mental coaching, allenamento mentale,
            gestione della pressione e benessere psicologico dell'atleta.
          </p>
        </div>
      </section>

      <section className="bg-off py-20 px-6 md:px-12">
        <div className="max-w-[1180px] mx-auto">
          <Link
            to="/blog/$slug"
            params={{ slug: hero.slug }}
            className="reveal group grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border border-line rounded-2xl overflow-hidden hover:shadow-card transition-all duration-500"
          >
            <div className="h-64 md:h-full overflow-hidden">
              <img
                src={hero.img}
                alt={hero.h}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-8 md:p-10 flex flex-col justify-center gap-4">
              <div className="flex items-center gap-3 text-[11px] font-bold tracking-[0.14em] uppercase">
                <span className="text-brand-green">{hero.tag}</span>
                <span className="text-muted-foreground">· {hero.date} · {hero.readingTime}</span>
              </div>
              <h2 className="font-display text-[clamp(26px,3vw,40px)] font-extrabold leading-tight">
                {hero.h}
              </h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed">{hero.p}</p>
              <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-green group-hover:gap-2.5 transition-all">
                Leggi l'articolo →
              </span>
            </div>
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {rest.map((post, i) => (
              <Link
                key={post.slug}
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="reveal group bg-white border border-line rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:shadow-card hover:-translate-y-1"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="h-44 overflow-hidden">
                  <img
                    src={post.img}
                    alt={post.h}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase">
                    <span className="text-brand-green">{post.tag}</span>
                    <span className="text-muted-foreground">· {post.readingTime}</span>
                  </div>
                  <h3 className="font-display text-[20px] font-extrabold leading-tight">{post.h}</h3>
                  <p className="text-[13.5px] text-muted-foreground leading-relaxed flex-1">{post.p}</p>
                  <span className="text-[12px] text-muted-foreground mt-auto">{post.date}</span>
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

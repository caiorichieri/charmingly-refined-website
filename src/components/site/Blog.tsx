import { Link } from "@tanstack/react-router";
import { posts } from "@/lib/blog-posts";

export function Blog() {
  const featured = posts.slice(0, 3);
  return (
    <section id="blog" className="bg-off py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-[1180px] mx-auto">
        <div className="reveal max-w-2xl flex flex-col gap-3">
          <div className="eyebrow">Dal blog</div>
          <h2 className="h-display text-[clamp(34px,4.2vw,56px)]">Approfondimenti</h2>
          <p className="text-[16px] text-muted-foreground">
            Articoli su mente, sport, performance e benessere psicologico dell'atleta.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {featured.map((post, i) => (
            <Link
              key={post.slug}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="reveal group bg-white border border-line rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:shadow-card hover:-translate-y-1"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="h-44 overflow-hidden">
                <img src={post.img} alt={post.h} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6 flex flex-col gap-3 flex-1">
                <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-brand-green">
                  {post.tag}
                </span>
                <h3 className="font-display text-[20px] font-extrabold leading-tight">{post.h}</h3>
                <p className="text-[13.5px] text-muted-foreground leading-relaxed flex-1">{post.p}</p>
                <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-green mt-auto group-hover:gap-2.5 transition-all">
                  Leggi l'articolo →
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="reveal mt-12 flex justify-center">
          <Link to="/blog" className="btn-primary">
            Vedi tutti gli articoli →
          </Link>
        </div>
      </div>
    </section>
  );
}

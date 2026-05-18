import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";
import { supabase } from "@/integrations/supabase/client";
import { QuizCTA } from "@/components/quiz/QuizCTA";

type Post = {
  id: string;
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  content: string;
  cover_url: string;
  reading_time: string;
  published_at: string;
};

export const Route = createFileRoute("/blog/$slug")({
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

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return d;
  }
}

function PostPage() {
  useReveal();
  const { slug } = Route.useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["public", "blog_post", slug],
    queryFn: async (): Promise<Post | null> => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      return (data ?? null) as Post | null;
    },
  });

  const { data: others = [] } = useQuery({
    queryKey: ["public", "blog_posts_others", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, slug, tag, title, cover_url")
        .eq("published", true)
        .neq("slug", slug)
        .order("display_order")
        .limit(3);
      return (data ?? []) as Pick<Post, "id" | "slug" | "tag" | "title" | "cover_url">[];
    },
  });

  if (isLoading) {
    return <main className="min-h-screen grid place-items-center text-muted-foreground">Caricamento…</main>;
  }
  if (!post) throw notFound();

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
            <h1 className="h-display text-[clamp(34px,4.5vw,60px)] mb-5">{post.title}</h1>
            <div className="text-[13px] text-white/55">
              {formatDate(post.published_at)} · {post.reading_time} di lettura
            </div>
          </div>
        </div>

        <div className="px-6 md:px-12 -mt-6">
          <div className="max-w-[1000px] mx-auto rounded-2xl overflow-hidden shadow-card">
            <img src={post.cover_url} alt={post.title} className="w-full h-[320px] md:h-[460px] object-cover" />
          </div>
        </div>

        <div className="py-16 md:py-20 px-6 md:px-12">
          <div className="max-w-[720px] mx-auto prose-content text-[17px] leading-[1.85] text-foreground/85 flex flex-col gap-5">
            <p className="text-[19px] leading-[1.75] text-foreground/90 font-medium">{post.excerpt}</p>
            <div className="whitespace-pre-line">{post.content}</div>
          </div>

          <div className="reveal max-w-[720px] mx-auto mt-12 p-7 rounded-2xl bg-off border border-line text-center">
            <div className="font-display text-[22px] font-extrabold mb-2">Vuoi iniziare il tuo percorso?</div>
            <p className="text-[14px] text-muted-foreground mb-5">
              Compila il questionario di orientamento e scopri il professionista più adatto a te.
            </p>
            <QuizCTA />

          </div>
        </div>
      </article>

      {others.length > 0 && (
        <section className="bg-off py-20 px-6 md:px-12 border-t border-line">
          <div className="max-w-[1180px] mx-auto">
            <div className="eyebrow mb-4">Continua a leggere</div>
            <h2 className="h-display text-[clamp(26px,3vw,40px)] mb-8">Altri articoli</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {others.map((p) => (
                <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }} className="group bg-white border border-line rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:shadow-card hover:-translate-y-1">
                  <div className="h-40 overflow-hidden">
                    <img src={p.cover_url} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-5 flex flex-col gap-2 flex-1">
                    <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-brand-green">{p.tag}</span>
                    <h3 className="font-display text-[17px] font-extrabold leading-tight">{p.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

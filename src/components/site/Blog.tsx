const posts = [
  {
    tag: "Psicologia sportiva",
    h: "Ansia da prestazione: quando la pressione entra in gara prima di te",
    p: "Come riconoscere i segnali mentali e fisici della pressione agonistica e perché lavorare sulla mente può aiutarti a restare lucido nei momenti decisivi.",
    img: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=85",
  },
  {
    tag: "Mental coaching",
    h: "Routine pre-gara: perché i grandi atleti non improvvisano",
    p: "Respirazione, visualizzazione, focus attentivo e self-talk: le routine mentali aiutano a creare continuità quando la competizione si fa intensa.",
    img: "https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=800&q=85",
  },
  {
    tag: "Performance mentale",
    h: "Dopo un errore: come recuperare concentrazione e fiducia",
    p: "Nello sport l'errore è inevitabile. La differenza sta in quanto velocemente riesci a rientrare nella prestazione senza restare bloccato nella testa.",
    img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=85",
  },
];

export function Blog() {
  return (
    <section id="blog" className="bg-off py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-[1180px] mx-auto">
        <div className="reveal max-w-2xl">
          <div className="eyebrow mb-4">Dal blog</div>
          <h2 className="h-display text-[clamp(34px,4.2vw,56px)] mb-3">Approfondimenti</h2>
          <p className="text-[16px] text-muted-foreground">
            Articoli su mente, sport, performance e benessere psicologico dell'atleta.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {posts.map((post, i) => (
            <article
              key={post.h}
              className="reveal group bg-white border border-line rounded-lg overflow-hidden flex flex-col transition-all duration-500 hover:shadow-card hover:-translate-y-1"
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
                <a href="#" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-green mt-auto group-hover:gap-2.5 transition-all">
                  Leggi l'articolo →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

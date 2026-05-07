const pilastri = [
  {
    tag: "Professionisti",
    h: "Specialisti del contesto sportivo",
    p: "Non professionisti generalisti: psicologi e mental coach la cui specializzazione principale è lo sport. Conoscono il ciclo gara-allenamento, la pressione del podio, la mente di chi compete.",
    img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=85",
    color: "var(--brand-green)",
  },
  {
    tag: "VR immersiva",
    h: "Non solo colloquio: ambienti immersivi",
    p: "Alcune fasi del percorso si svolgono in ambienti immersivi progettati per allenare visualizzazione, respirazione, concentrazione e gestione della pressione, sempre con il professionista.",
    img: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=85",
    color: "var(--brand-blue)",
  },
  {
    tag: "App + AI",
    h: "Continua ad allenarti tra le sessioni",
    p: "L'app accompagna il percorso tra una sessione e l'altra con esercizi, diario mentale, routine e monitoraggio. Nei piani avanzati, strumenti AI supportano la continuità del lavoro.",
    img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=85",
    color: "var(--brand-yellow)",
  },
];

export function Pilastri() {
  return (
    <section className="bg-off py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-[1180px] mx-auto">
        <div className="reveal">
          <div className="eyebrow mb-4">L'ecosistema</div>
          <h2 className="h-display text-[clamp(34px,4.2vw,56px)]">Un ecosistema costruito<br />per chi compete.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {pilastri.map((p, i) => (
            <article
              key={p.h}
              className="reveal group bg-white border border-line rounded-lg overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="h-44 overflow-hidden relative">
                <img src={p.img} alt={p.h} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-7">
                <span
                  className="inline-block text-[11px] font-bold tracking-[0.14em] uppercase px-3 py-1 rounded mb-3"
                  style={{ background: `color-mix(in oklab, ${p.color} 14%, transparent)`, color: p.color }}
                >
                  {p.tag}
                </span>
                <h3 className="font-display text-[22px] font-extrabold leading-tight mb-3">{p.h}</h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed">{p.p}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

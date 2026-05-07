const steps = [
  {
    t: "Scopri il tuo profilo mentale",
    d: "Compila il questionario di orientamento: sport, livello, obiettivi, difficoltà ricorrenti, momenti critici della performance.",
    img: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=700&q=85",
  },
  {
    t: "Costruiamo il percorso più adatto",
    d: "Ti orientiamo verso lo psicologo sportivo o il mental coach più adatto, costruito sul tuo sport e sulla fase della stagione.",
    img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=700&q=85",
  },
  {
    t: "Inizia l'allenamento mentale",
    d: "Sessioni online con specialisti, esercizi pratici, routine pre-gara, gestione dell'errore, visualizzazione e regolazione emotiva.",
    img: "https://images.unsplash.com/photo-1591035897819-f4bdf739f446?w=700&q=85",
  },
  {
    t: "Porta l'esperienza in VR",
    d: "Quando utile, il percorso integra ambienti immersivi per allenare respirazione, ansia anticipatoria, flow state e fiducia.",
    img: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=700&q=85",
  },
];

export function ComeFunziona() {
  return (
    <section id="come-funziona" className="bg-off py-24 md:py-32 px-6 md:px-12 relative">
      <div className="max-w-[1180px] mx-auto">
        <div className="reveal max-w-2xl">
          <div className="eyebrow mb-4">Il percorso</div>
          <h2 className="h-display text-[clamp(34px,4.2vw,56px)]">
            Come funziona<br />l'allenamento mentale
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          {steps.map((s, i) => (
            <article
              key={s.t}
              className="reveal group bg-white border border-line rounded-md overflow-hidden relative transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="h-36 overflow-hidden">
                <img src={s.img} alt={s.t} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6 relative">
                <span className="font-display absolute -top-1 right-3 text-[88px] font-extrabold leading-none text-ink/[0.06] select-none pointer-events-none">
                  {i + 1}
                </span>
                <div className="font-display text-[11px] tracking-[0.16em] text-brand-green font-bold uppercase mb-2 relative">
                  Step 0{i + 1}
                </div>
                <h3 className="font-display text-[19px] font-extrabold leading-tight mb-2 relative">{s.t}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed relative">{s.d}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="reveal mt-14 flex flex-col items-center gap-3">
          <a href="#cta" className="btn-primary">
            Inizia l'allenamento mentale →
          </a>
          <div className="text-[13px] text-muted-foreground">
            Questionario di orientamento · Profilo mentale sportivo · Percorso personalizzato
          </div>
        </div>
      </div>
    </section>
  );
}

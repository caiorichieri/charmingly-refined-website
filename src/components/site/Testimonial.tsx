const testi = [
  {
    text: "Prima delle gare importanti mi bloccavo. Non capivo perché in allenamento andavo forte e in gara perdevo tutto. Con lo psicologo sportivo ho iniziato a capire cosa succedeva. Ora ho strumenti per lavorarci sopra.",
    name: "M. R.",
    sport: "Nuotatore agonistico · 24 anni",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80",
  },
  {
    text: "Il mental coach mi ha aiutato a costruire una routine pre-gara che funziona davvero. Non è magia — è metodo. Entro in campo con un'altra testa. Sono più presente, più lucida, meno in balia degli eventi.",
    name: "S. B.",
    sport: "Pallavolista · Serie B",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80",
  },
  {
    text: "Dopo l'infortunio avevo paura di tornare. Il corpo stava bene ma la testa no. Con il percorso ho lavorato sulla fiducia e sull'ansia anticipatoria. Ho ripreso a competere — e a divertirmi.",
    name: "L. T.",
    sport: "Maratoneta · Amatoriale evoluto",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&q=80",
  },
];

export function Testimonial() {
  return (
    <section className="bg-white py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-[1180px] mx-auto">
        <div className="reveal">
          <div className="eyebrow mb-4">Chi lo usa</div>
          <h2 className="h-display text-[clamp(34px,4.2vw,56px)]">Atleti che hanno scelto<br />di lavorare sulla mente</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {testi.map((t, i) => (
            <figure
              key={t.name}
              className="reveal flex flex-col gap-4 bg-off border border-line rounded-lg p-7 transition-all duration-500 hover:bg-white hover:shadow-card hover:-translate-y-1 relative"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="font-display text-6xl text-brand-green/25 leading-none absolute top-3 right-5 select-none">
                "
              </div>
              <div className="text-[15px] tracking-[2px]" style={{ color: "oklch(0.78 0.16 75)" }}>★★★★★</div>
              <blockquote className="text-[14.5px] leading-relaxed italic text-foreground">
                {t.text}
              </blockquote>
              <figcaption className="flex items-center gap-3 mt-auto pt-3 border-t border-line">
                <div className="h-11 w-11 rounded-full overflow-hidden flex-shrink-0">
                  <img src={t.avatar} alt={t.name} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-foreground">{t.name}</div>
                  <div className="text-[12px] text-muted-foreground">{t.sport}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

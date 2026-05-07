const items = [
  { area: "Pressione pre-gara", obj: "Lucidità e presenza mentale nel momento decisivo" },
  { area: "Concentrazione", obj: "Restare dentro la performance più a lungo" },
  { area: "Gestione dell'errore", obj: "Ripartire senza perdere la gara nella testa" },
  { area: "Fiducia nei propri mezzi", obj: "Stabilità mentale in competizione" },
  { area: "Motivazione", obj: "Mantenere l'impegno anche nei periodi di calo" },
  { area: "Visualizzazione", obj: "Preparare gesti, scenari e obiettivi con metodo" },
  { area: "Routine pre-performance", obj: "Ingresso in gara più controllato e consapevole" },
  { area: "Self-talk", obj: "Trasformare il dialogo interno in performance" },
  { area: "Recupero post-infortunio", obj: "Rientro alla competizione con fiducia" },
];

export function Benefici() {
  return (
    <section className="bg-ink-deep text-white py-24 md:py-32 px-6 md:px-12 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: "radial-gradient(50% 50% at 100% 0%, color-mix(in oklab, var(--brand-green) 18%, transparent), transparent 60%)",
        }}
      />
      <div className="relative max-w-[1180px] mx-auto">
        <div className="reveal max-w-2xl">
          <div className="eyebrow mb-4">Aree di allenamento mentale</div>
          <h2 className="h-display text-[clamp(34px,4.2vw,56px)]">Cosa alleni<br />con MeMindSport</h2>
        </div>
        <div className="reveal mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/8 border border-white/8">
          {items.map((it) => (
            <div
              key={it.area}
              className="bg-ink-deep p-7 transition-all duration-300 hover:bg-brand-green/8 hover:scale-[1.01] cursor-default group"
            >
              <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-brand-green mb-2 group-hover:tracking-[0.18em] transition-all">
                {it.area}
              </div>
              <div className="text-[15px] text-white/65 leading-relaxed">{it.obj}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

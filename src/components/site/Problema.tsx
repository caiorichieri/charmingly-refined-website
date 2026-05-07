const items = [
  { t: "Pressione che blocca", d: "Ti alleni bene, ma in gara rendi meno. Il corpo è pronto — la testa comincia a dubitare." },
  { t: "Errori che pesano", d: "Sbagli nel momento decisivo e non riesci a scrollartelo di dosso. La gara continua, ma tu sei ancora lì." },
  { t: "Aspettative che soffocano", d: "Senti il peso di quello che gli altri si aspettano — e di quello che ti aspetti da te stesso." },
  { t: "Motivazione che cala", d: "Periodi in cui non senti più la spinta. Ti chiedi perché continui o se ha ancora senso." },
  { t: "Rientro dall'infortunio", d: "Il corpo è guarito, ma la fiducia no. Tornare a competere con la testa libera è un lavoro a parte." },
];

export function Problema() {
  return (
    <section className="relative bg-ink-deep text-white overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-50" />
      <div className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[640px]">
        <div className="relative overflow-hidden hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1530143584546-02191bc84eb5?w=1100&q=85"
            alt="atleta sotto pressione agonistica"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-55"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 50%, var(--ink-deep))" }} />
          <div className="absolute bottom-10 left-10 max-w-xs reveal">
            <div className="font-display italic text-2xl text-white/85 leading-tight">
              "Non si vede mai il pensiero che decide la gara."
            </div>
          </div>
        </div>

        <div className="px-6 md:px-12 lg:px-16 py-20 lg:py-24 flex flex-col justify-center">
          <div className="eyebrow mb-4 reveal">Il punto di partenza</div>
          <h2 className="h-display text-[clamp(34px,4.2vw,56px)] mb-5 reveal">
            Vuoi vincere.<br />Vuoi migliorare.<br />Vuoi farcela.<br />
            <em className="not-italic" style={{ background: "var(--gradient-green)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontStyle: "italic" }}>
              Ma la testa<br />deve seguirti.
            </em>
          </h2>
          <p className="text-[17px] leading-[1.75] text-white/68 mb-8 reveal">
            Ti alleni per essere più forte, più veloce, più resistente, più preciso. Ma quando arriva il momento decisivo, non basta il corpo. Serve una mente capace di reggere <strong className="text-white font-semibold">pressione, errore, aspettative</strong> e momenti di calo.
          </p>
          <ul className="reveal flex flex-col">
            {items.map((it) => (
              <li key={it.t} className="flex items-start gap-4 py-4 border-b border-white/8 last:border-0">
                <span className="mt-2 h-2 w-2 rounded-full bg-brand-green flex-shrink-0" />
                <div>
                  <div className="text-white font-semibold text-[15px] mb-0.5">{it.t}</div>
                  <div className="text-[14px] text-white/62 leading-snug">{it.d}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="reveal mt-9 px-6 py-5 border-l-[3px] border-brand-green bg-brand-green/10 font-display italic font-bold text-[22px] leading-tight">
            La voglia di vincere è il motore. La mente è ciò che ti permette di usarlo quando conta.
          </div>
        </div>
      </div>
    </section>
  );
}

const list = [
  "Simulare stati emotivi legati alla competizione per allenarsi a gestirli",
  "Lavorare sull'ansia anticipatoria in scenari progressivi e controllati",
  "Allenare visualizzazione e concentrazione in ambienti tridimensionali",
  "Praticare respirazione e regolazione emotiva in contesti sfidanti",
  "Rieducare corpo e mente a nuove risposte sotto pressione",
  "Preparare gesti, routine pre-gara e stati di flow",
];

const chips = ["Visualizzazione", "Ansia anticipatoria", "Flow state", "Routine pre-gara", "Regolazione emotiva", "Concentrazione"];

export function VRSection() {
  return (
    <section id="immersivo" className="relative bg-ink-deep text-white overflow-hidden">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: "radial-gradient(60% 60% at 80% 50%, color-mix(in oklab, var(--brand-blue) 22%, transparent), transparent 70%)",
        }}
      />
      <div className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
        <div className="px-6 md:px-12 lg:px-16 py-20 lg:py-24 flex flex-col justify-center order-2 lg:order-1">
          <div className="eyebrow mb-4 reveal" style={{ color: "var(--brand-blue)" }}>
            Ambienti immersivi
          </div>
          <h2 className="h-display text-[clamp(34px,4.2vw,56px)] mb-5 reveal">
            Non solo colloquio.<br />
            <em
              className="not-italic"
              style={{
                background: "linear-gradient(135deg, var(--brand-blue), color-mix(in oklab, var(--brand-blue) 60%, white))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontStyle: "italic",
              }}
            >
              Un'esperienza<br />che allena.
            </em>
          </h2>
          <p className="text-[17px] leading-[1.75] text-white/70 mb-7 reveal">
            Negli ambienti immersivi l'atleta non si limita a parlare della pressione: può sperimentarla, riconoscerla e allenare nuove risposte in uno spazio guidato e controllato. La mente impara meglio quando vive un'esperienza.
          </p>
          <ul className="reveal flex flex-col gap-3 mb-7">
            {list.map((l) => (
              <li key={l} className="flex items-start gap-3 text-[15px] text-white/75 leading-snug">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-blue flex-shrink-0" />
                {l}
              </li>
            ))}
          </ul>
          <div className="reveal px-5 py-4 border-l-[3px] border-brand-blue bg-brand-blue/10 italic text-[15px] leading-relaxed text-white/70">
            MeMindSport integra scenari immersivi pensati per visualizzazione, respirazione, concentrazione, gestione dell'errore. Il professionista è sempre presente in videochiamata.
          </div>
          <div className="reveal mt-6 flex flex-wrap gap-2">
            {chips.map((c) => (
              <span
                key={c}
                className="text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded bg-brand-blue/15 text-brand-blue border border-brand-blue/30"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden order-1 lg:order-2 min-h-[320px]">
          <img
            src="https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=1100&q=85"
            alt="atleta con visore VR per preparazione mentale sportiva"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-75"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to left, transparent 40%, var(--ink-deep))" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(50% 50% at 50% 50%, color-mix(in oklab, var(--brand-blue) 30%, transparent), transparent 70%)",
              mixBlendMode: "screen",
            }}
          />
        </div>
      </div>
    </section>
  );
}

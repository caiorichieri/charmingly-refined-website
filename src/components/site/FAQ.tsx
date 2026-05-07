import { useState } from "react";

const faqs = [
  {
    q: "A cosa serve l'allenamento mentale nello sport?",
    a: "L'allenamento mentale sportivo aiuta a sviluppare abilità psicologiche utili alla performance: concentrazione, gestione della pressione, recupero dopo l'errore, motivazione e routine pre-gara. Non sostituisce la preparazione fisica, ma può rendere più efficace l'utilizzo delle risorse che già hai.",
  },
  {
    q: "Che differenza c'è tra psicologo sportivo e mental coach?",
    a: "Lo psicologo sportivo è un professionista sanitario iscritto all'Albo, può fare diagnosi e lavorare su aspetti clinici. Il mental coach è uno specialista della performance mentale, certificato ma non figura sanitaria, orientato a obiettivi pratici. Il questionario di orientamento ti aiuta a capire quale figura sia più adatta.",
  },
  {
    q: "Gli ambienti immersivi possono aiutare nella preparazione mentale?",
    a: "Gli ambienti immersivi permettono di lavorare su visualizzazione, regolazione emotiva, ansia anticipatoria e concentrazione in contesti simulati e guidati. Sono integrati nel percorso quando il professionista li ritiene utili, sempre con la sua presenza durante la sessione.",
  },
  {
    q: "MeMindSport è adatto anche agli atleti amatoriali?",
    a: "Sì. È pensato per atleti di tutti i livelli: agonisti, amatoriali evoluti, giovani sportivi e squadre. Che tu voglia migliorare la concentrazione, gestire meglio la pressione o prepararti a una competizione, il percorso viene costruito intorno al tuo sport e ai tuoi obiettivi.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-white py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-[1000px] mx-auto">
        <div className="reveal text-center mb-12">
          <div className="eyebrow mb-4 justify-center inline-flex">Domande frequenti</div>
          <h2 className="h-display text-[clamp(34px,4.2vw,56px)]">
            Hai dubbi?{" "}
            <em
              className="not-italic"
              style={{
                background: "var(--gradient-green)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontStyle: "italic",
              }}
            >
              Eccoci.
            </em>
          </h2>
        </div>
        <div className="reveal flex flex-col gap-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className={`border rounded-lg overflow-hidden transition-all duration-300 ${
                  isOpen ? "bg-off border-brand-green/40 shadow-soft" : "bg-white border-line hover:border-brand-green/30"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <h3 className="font-display text-[18px] font-extrabold leading-tight pr-4">{f.q}</h3>
                  <span
                    className={`grid place-items-center h-9 w-9 rounded-full transition-all flex-shrink-0 ${
                      isOpen ? "bg-brand-green text-white rotate-45" : "bg-brand-green/10 text-brand-green"
                    }`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </button>
                <div
                  className="grid transition-all duration-400 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-[14.5px] leading-relaxed text-muted-foreground">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

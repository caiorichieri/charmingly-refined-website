const list = [
  "Strumenti concreti per affrontare la gara",
  "Protocolli per gestire la pressione agonistica",
  "Tecniche per restare concentrato nei momenti decisivi",
  "Metodo per recuperare dopo l'errore e ripartire",
  "Routine per trasformare motivazione in continuità",
  "Esperienze immersive per visualizzazione e regolazione emotiva",
];

export function Posizionamento() {
  return (
    <section className="bg-white py-24 md:py-32 px-6 md:px-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-40 pointer-events-none" />
      <div className="relative max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="reveal">
          <div className="eyebrow mb-4">Non è solo stare meglio</div>
          <h2 className="h-display text-[clamp(34px,4.2vw,56px)] mb-5">
            È trasformare<br />il potenziale<br />
            <em
              className="not-italic"
              style={{
                background: "var(--gradient-green)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontStyle: "italic",
              }}
            >
              in prestazione.
            </em>
          </h2>
          <p className="text-[17px] leading-[1.75] text-foreground/75 mb-7">
            MeMindSport nasce per aiutare gli sportivi ad allenare la componente mentale della performance. Perché chi fa sport non cerca solo tranquillità: cerca lucidità, continuità, fiducia, capacità di reagire e strumenti concreti per rendere meglio quando conta.
          </p>
          <ul className="flex flex-col gap-3">
            {list.map((l) => (
              <li key={l} className="flex items-center gap-3 text-[15px] text-foreground">
                <span className="grid place-items-center h-7 w-7 rounded-full bg-brand-green/10 border border-brand-green/30 text-brand-green flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                {l}
              </li>
            ))}
          </ul>
          <div className="mt-7 px-5 py-4 bg-off rounded text-[14px] text-muted-foreground italic">
            Non promettiamo vittorie automatiche. Ti aiutiamo ad allenare ciò che può fare la differenza quando il talento e la tecnica non bastano più.
          </div>
        </div>

        <div className="reveal flex flex-col gap-9">
          <p className="font-display font-extrabold italic text-foreground leading-[1.08] text-[clamp(30px,3.6vw,52px)]">
            Non sei meno atleta<br />
            perché senti la pressione.<br />
            <em
              className="not-italic"
              style={{
                background: "var(--gradient-green)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontStyle: "italic",
              }}
            >
              Diventi più atleta<br />
              quando impari<br />
              a gestirla.
            </em>
          </p>
          <p className="font-display font-extrabold italic text-foreground leading-[1.08] text-[clamp(22px,2.6vw,38px)]">
            Trasforma la voglia<br />di vincere in{" "}
            <em
              className="not-italic text-brand-green"
              style={{ fontStyle: "italic" }}
            >
              metodo.
            </em>
          </p>
        </div>
      </div>
    </section>
  );
}

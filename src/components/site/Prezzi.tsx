type Card = {
  label: string;
  amount: string;
  amountAccent?: string;
  detail: string;
  desc: string;
  detr?: boolean;
  featured?: boolean;
};

const row1: Card[] = [
  { label: "Assessment iniziale", amount: "€", amountAccent: "29", detail: "Questionario + orientamento percorso", desc: "Per capire da dove partire e individuare il percorso più adatto al tuo profilo mentale." },
  { label: "Sessione singola", amount: "€65", detail: "50 minuti · psicologo sportivo", desc: "Prestazione sanitaria. Fattura per detrazione fiscale inclusa.", detr: true, featured: true },
  { label: "Pacchetto 5 sessioni", amount: "€299", detail: "€59,80 a sessione · 3 mesi", desc: "Per avviare un percorso strutturato di allenamento mentale con continuità.", detr: true },
  { label: "Sessione immersiva", amount: "€85", detail: "50 min · ambiente VR guidato", desc: "Professionista presente in videochiamata durante l'intera sessione." },
];

const row2: Card[] = [
  { label: "App Base", amount: "€4,99", detail: "al mese", desc: "Esercizi guidati, diario mentale, routine, contenuti di mental training." },
  { label: "App Premium", amount: "€9,99", detail: "al mese · con strumenti AI", desc: "Tutto Base + AI per continuità del lavoro, tracking avanzato e routine personalizzate." },
  { label: "Pacchetto 10 sessioni", amount: "€549", detail: "€54,90 a sessione · 6 mesi", desc: "Per percorsi di allenamento mentale strutturati e di lungo periodo.", detr: true },
  { label: "Squadre e federazioni", amount: "Su misura", detail: "da €500/mese", desc: "Dashboard team, report aggregati anonimi, programmi stagionali." },
];

function Tile({ c }: { c: Card }) {
  return (
    <div
      className={`reveal relative rounded-lg p-6 border-[1.5px] transition-all duration-300 hover:-translate-y-1 ${
        c.featured
          ? "bg-ink-deep border-ink-deep text-white shadow-glow"
          : "bg-off border-line hover:border-brand-green/40 hover:bg-white"
      }`}
    >
      {c.featured && (
        <span className="absolute -top-3 left-6 text-[10px] font-bold tracking-[0.16em] uppercase bg-brand-green text-white px-3 py-1 rounded">
          Più scelto
        </span>
      )}
      <div className={`text-[11px] font-bold tracking-[0.12em] uppercase mb-3 ${c.featured ? "text-white/45" : "text-muted-foreground"}`}>
        {c.label}
      </div>
      <div className={`font-display font-extrabold leading-none mb-1 ${c.amount === "Su misura" ? "text-2xl" : "text-[40px]"} ${c.featured ? "text-white" : "text-ink"}`}>
        {c.amount}
        {c.amountAccent && <span className="text-brand-green">{c.amountAccent}</span>}
      </div>
      <div className={`text-[12px] mb-3 ${c.featured ? "text-white/50" : "text-muted-foreground"}`}>{c.detail}</div>
      <div className={`text-[13px] leading-snug ${c.featured ? "text-white/70" : "text-foreground/70"}`}>{c.desc}</div>
      {c.detr && (
        <span className="inline-block mt-3 text-[11px] font-bold text-brand-green bg-brand-green/12 px-2.5 py-1 rounded">
          Detraibile 19%
        </span>
      )}
    </div>
  );
}

export function Prezzi() {
  return (
    <section id="prezzi" className="bg-white py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-[1180px] mx-auto">
        <div className="reveal">
          <div className="eyebrow mb-4">Prezzi chiari</div>
          <h2 className="h-display text-[clamp(34px,4.2vw,56px)]">
            Nessuna{" "}
            <em
              className="not-italic"
              style={{
                background: "var(--gradient-green)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontStyle: "italic",
              }}
            >
              sorpresa.
            </em>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {row1.map((c) => <Tile key={c.label} c={c} />)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {row2.map((c) => <Tile key={c.label} c={c} />)}
        </div>
        <p className="text-center mt-8 text-[14px] text-muted-foreground">
          Le sessioni con psicologo sportivo sono prestazioni sanitarie.{" "}
          <a href="#" className="text-brand-green font-semibold hover:underline">
            Informazioni →
          </a>
        </p>
      </div>
    </section>
  );
}

import { openQuiz } from "@/components/quiz/openQuiz";

type Figure = {
  title: string;
  badge: string;
  sub: string;
  body: string;
  list: string[];
  quote: string;
  note: string;
  cta: string;
  img: string;
  variant: "psi" | "coach";
};

const figures: Figure[] = [
  {
    title: "Psicologo\nsportivo",
    badge: "Figura sanitaria · Iscritto all'Ordine degli Psicologi",
    sub: "Quando vuoi performare meglio, ma qualcosa ti blocca.",
    body: "Professionista sanitario con laurea magistrale in psicologia e abilitazione professionale. Lavora sugli aspetti emotivi, cognitivi e relazionali che influenzano benessere e performance sportiva.",
    list: [
      "La pressione agonistica incide sulla tua resa in gara",
      "Ti alleni bene, ma in competizione non esprimi il potenziale",
      "Hai difficoltà a recuperare concentrazione dopo un errore",
      "Il peso delle aspettative condiziona la tua prestazione",
      "Stai tornando a competere dopo un infortunio",
    ],
    quote: "Non sei meno atleta perché senti la pressione. Diventi più atleta quando impari a gestirla.",
    note: "Prestazione sanitaria — detraibile al 19%",
    cta: "Scopri gli psicologi sportivi",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=85",
    variant: "psi",
  },
  {
    title: "Mental\ncoach",
    badge: "Certificato CONI / ICF / ECA",
    sub: "Per chi vuole trasformare la mente in vantaggio competitivo.",
    body: "Specialista della performance mentale con certificazioni riconosciute. Costruisce percorsi pratici orientati all'obiettivo, con strumenti da usare già dalla sessione successiva.",
    list: [
      "Vuoi migliorare la concentrazione e il focus in gara",
      "Vuoi costruire routine pre-gara efficaci e ripetibili",
      "Vuoi prepararti a una competizione importante",
      "Vuoi essere più costante e reagire meglio sotto pressione",
      "Vuoi trasformare ambizione e voglia di vincere in metodo",
    ],
    quote: "Il talento ti porta in gara. La mente decide come ci resti.",
    note: "Servizio non sanitario · Percorso orientato a obiettivi e routine",
    cta: "Scopri i mental coach",
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=85",
    variant: "coach",
  },
];

export function DueFigure() {
  return (
    <section id="professionisti" className="bg-white py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-[1180px] mx-auto">
        <div className="reveal max-w-3xl">
          <div className="eyebrow mb-4">Due figure, un percorso</div>
          <h2 className="h-display text-[clamp(34px,4.2vw,56px)] mb-4">
            Psicologo sportivo<br />o mental coach:<br />
            <em
              className="not-italic"
              style={{
                background: "var(--gradient-green)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontStyle: "italic",
              }}
            >
              non è la stessa cosa.
            </em>
          </h2>
          <p className="text-[17px] text-foreground/70 leading-[1.75] mb-12 max-w-[640px]">
            Su MeMindSport lavorano due tipi di professionisti con formazioni e obiettivi distinti. Il questionario di orientamento ti indica verso quello più adatto.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          {figures.map((f) => {
            const accent = f.variant === "psi" ? "var(--brand-blue)" : "var(--brand-green)";
            return (
              <article
                key={f.title}
                className="reveal group bg-white border-2 border-line rounded-lg overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-card hover:border-transparent"
                style={{ "--accent": accent } as React.CSSProperties}
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={f.img} alt={f.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, oklch(0.12 0.005 270 / 0.85), transparent 55%)" }}
                  />
                  <div className="absolute bottom-5 left-5 font-display font-extrabold text-white text-[26px] leading-tight whitespace-pre-line">
                    {f.title}
                  </div>
                </div>
                <div className="px-6 py-5 border-b border-line">
                  <span
                    className="inline-block text-[11px] font-bold tracking-[0.12em] uppercase px-3 py-1 rounded mb-2"
                    style={{ background: `color-mix(in oklab, ${accent} 14%, transparent)`, color: accent }}
                  >
                    {f.badge}
                  </span>
                  <p className="text-[14px] italic text-muted-foreground leading-snug">{f.sub}</p>
                </div>
                <div className="px-6 py-6">
                  <p className="text-[14px] leading-relaxed text-foreground/75 mb-5">{f.body}</p>
                  <div className="text-[11px] tracking-wider uppercase font-bold text-muted-foreground mb-3">
                    Può supportare il tuo percorso se:
                  </div>
                  <ul className="flex flex-col gap-2 mb-5">
                    {f.list.map((l) => (
                      <li
                        key={l}
                        className="text-[13.5px] text-foreground pl-5 relative leading-snug"
                      >
                        <span className="absolute left-0 top-0 font-bold" style={{ color: accent }}>→</span>
                        {l}
                      </li>
                    ))}
                  </ul>
                  <div
                    className="px-4 py-3.5 rounded mb-5 font-display italic font-bold text-[15.5px] leading-snug border-l-[3px]"
                    style={{
                      background: `color-mix(in oklab, ${accent} 7%, transparent)`,
                      color: accent,
                      borderColor: accent,
                    }}
                  >
                    {f.quote}
                  </div>
                  <p className="text-[12px] text-muted-foreground mb-4">{f.note}</p>
                  <button
                    type="button"
                    onClick={openQuiz}
                    className="flex items-center justify-center gap-2 font-display font-bold text-[15px] tracking-wide text-white rounded-full py-3.5 transition-all hover:brightness-110 w-full"
                    style={{ background: accent }}
                  >
                    {f.cta} →
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="reveal mt-8 px-6 py-5 bg-off rounded text-center text-[14px] text-muted-foreground">
          Non sai quale scegliere?{" "}
          <button type="button" onClick={openQuiz} className="text-brand-green font-semibold hover:underline">
            Il questionario di orientamento ti guida →
          </button>
        </div>
      </div>
    </section>
  );
}

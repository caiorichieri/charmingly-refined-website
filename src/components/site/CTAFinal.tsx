import { QuizCTA } from "@/components/quiz/QuizCTA";

export function CTAFinal() {
  return (
    <section id="cta" className="relative min-h-[520px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=1600&q=85')",
          backgroundPosition: "center 40%",
        }}
      />
      <div className="absolute inset-0 bg-ink-deep/82" />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(60% 60% at 50% 50%, color-mix(in oklab, var(--brand-green) 22%, transparent), transparent 70%)",
        }}
      />
      <div className="relative reveal text-center px-6 py-24 max-w-[760px]">
        <div className="eyebrow mb-5 justify-center inline-flex">Inizia oggi</div>
        <h2 className="font-display font-extrabold italic text-white leading-[1.02] text-[clamp(36px,5.4vw,68px)] mb-5">
          La prossima prestazione<br />non si prepara<br />
          <em
            className="not-italic"
            style={{
              background: "var(--gradient-green)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontStyle: "italic",
            }}
          >
            solo con il corpo.
          </em>
        </h2>
        <p className="text-[16px] text-white/65 mb-8 leading-[1.75] max-w-[560px] mx-auto">
          Si prepara nella testa, nei pensieri che scegli, nella reazione all'errore. Se vuoi migliorare, competere, vincere o tornare a credere davvero nelle tue capacità, inizia da qui.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <QuizCTA className="animate-pulse-glow" />
          <a href="#prezzi" className="btn-outline-light">
            Vedi i prezzi
          </a>
        </div>
        <div className="mt-5 text-[13px] text-white/35">
          Questionario di orientamento · Percorso personalizzato · Ambienti immersivi
        </div>
      </div>
    </section>
  );
}

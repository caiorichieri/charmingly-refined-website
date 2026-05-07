import heroImg from "@/assets/hero-athlete.jpg";

export function Hero() {
  return (
    <section className="relative min-h-screen pt-[68px] overflow-hidden bg-ink-deep text-white">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Atleta in concentrazione mentale pre-gara"
          className="h-full w-full object-cover object-[60%_30%]"
          width={1280}
          height={1600}
        />
        {/* Cinematic gradients */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.12 0.005 270 / 0.95) 0%, oklch(0.12 0.005 270 / 0.78) 35%, oklch(0.12 0.005 270 / 0.4) 60%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 60% at 80% 30%, color-mix(in oklab, var(--brand-green) 22%, transparent), transparent 70%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-deep" />
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-[58%_42%] min-h-screen">
        {/* Left content */}
        <div className="flex flex-col justify-center px-6 md:px-12 lg:px-16 py-20 lg:py-0">
          <div className="reveal in mb-6 inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-green">
            <span className="block h-[2px] w-7 bg-brand-green" />
            Allenamento mentale per sportivi
          </div>

          <h1 className="h-display text-[clamp(48px,6vw,86px)] mb-6 reveal in">
            Allena la parte
            <br />
            di te che gareggia
            <br />
            <em
              className="not-italic font-display"
              style={{
                background: "var(--gradient-green)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontStyle: "italic",
              }}
            >
              prima del corpo.
            </em>
          </h1>

          <p className="reveal in max-w-[540px] text-[17px] leading-[1.75] text-white/72 mb-9">
            Prima di entrare in campo, la mente è già in gara. Decide come reagisci alla pressione, come recuperi dopo un errore, come resti lucido quando tutto accelera.
            <br />
            <br />
            MeMindSport ti aiuta ad allenarla con percorsi personalizzati di psicologia dello sport, mental coaching e ambienti immersivi.
          </p>

          <div className="reveal in flex flex-wrap items-center gap-4">
            <a href="#cta" className="btn-primary animate-pulse-glow">
              Scopri il tuo profilo mentale →
            </a>
            <a href="#come-funziona" className="btn-outline-light">
              Come funziona
            </a>
          </div>

          <div className="reveal in mt-8 flex flex-wrap gap-2.5">
            {[
              "Centro sanitario autorizzato",
              "Psicologi iscritti all'Ordine",
              "Detraibile al 19%",
            ].map((b) => (
              <span
                key={b}
                className="glass-dark inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-white/85 px-3.5 py-2 rounded"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Right floating accent cards */}
        <div className="relative hidden lg:block">
          {/* stat card top */}
          <div className="absolute top-[18%] right-10 glass rounded-md px-5 py-4 shadow-card animate-float">
            <div className="font-display text-4xl font-extrabold leading-none text-ink">
              <span className="text-brand-green">35%</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground leading-snug max-w-[150px]">
              degli atleti d'élite affronta
              <br />
              ansia da prestazione
            </div>
          </div>

          {/* tag pills */}
          <span className="absolute top-[12%] left-6 font-display text-[11px] font-bold tracking-[0.12em] uppercase bg-brand-red text-white px-3 py-1.5 rounded rotate-[2deg] shadow-card">
            Agonisti
          </span>
          <span className="absolute top-[44%] left-1 font-display text-[11px] font-bold tracking-[0.12em] uppercase bg-brand-yellow text-ink px-3 py-1.5 rounded rotate-[-3deg] shadow-card">
            Amatoriali
          </span>
          <span className="absolute bottom-[26%] right-12 font-display text-[11px] font-bold tracking-[0.12em] uppercase bg-brand-blue text-white px-3 py-1.5 rounded rotate-[-1.5deg] shadow-card">
            Paralimpici
          </span>

          {/* stat card bottom */}
          <div className="absolute bottom-[14%] right-6 glass rounded-md px-5 py-4 shadow-card animate-float" style={{ animationDelay: "1.2s" }}>
            <div className="font-display text-4xl font-extrabold leading-none text-ink">
              <span className="text-brand-green">2</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground leading-snug max-w-[170px]">
              figure specializzate:
              <br />
              psicologo e mental coach
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

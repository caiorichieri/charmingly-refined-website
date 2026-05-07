const items = [
  { num: "2", lbl: "figure specializzate", accent: true },
  { num: "VR", lbl: "ambienti immersivi", accent: true },
  { num: "19%", lbl: "detrazione fiscale", accent: false },
  { num: "App", lbl: "con AI tra le sessioni", accent: true },
  { num: "360°", lbl: "performance mentale", accent: true },
];

export function ProofBar() {
  return (
    <div className="bg-ink-deep border-y border-white/5 py-5 px-6">
      <div className="overflow-hidden">
        <div className="flex gap-12 md:gap-16 items-center justify-center flex-wrap md:flex-nowrap">
          {items.map((it, i) => (
            <div key={it.lbl} className="flex items-center gap-12 md:gap-16">
              <div className="flex flex-col items-center gap-1">
                <div className="font-display text-3xl font-extrabold leading-none text-white">
                  <span className={it.accent ? "text-brand-green" : ""}>
                    {it.num}
                  </span>
                </div>
                <div className="text-[11px] tracking-wider text-white/45 text-center uppercase">
                  {it.lbl}
                </div>
              </div>
              {i < items.length - 1 && (
                <div className="hidden md:block h-9 w-px bg-white/10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

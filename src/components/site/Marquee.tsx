const sports = [
  "Calcio", "Tennis", "Basket", "Pallavolo", "Nuoto", "Atletica", "Ciclismo",
  "Sci alpino", "Golf", "Rugby", "Arti marziali", "Ginnastica", "Equitazione",
  "Triathlon", "Boxe", "Scherma", "Vela", "Pattinaggio", "Paralimpico",
];

export function Marquee() {
  const loop = [...sports, ...sports];
  return (
    <div className="bg-ink text-white py-6 overflow-hidden border-y border-white/5">
      <div className="flex animate-marquee whitespace-nowrap">
        {loop.map((s, i) => (
          <span key={i} className="flex items-center gap-10 mx-5">
            <span className="font-display text-2xl md:text-3xl font-extrabold italic text-white/30 hover:text-brand-green transition-colors">
              {s}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-brand-green/60" />
          </span>
        ))}
      </div>
    </div>
  );
}

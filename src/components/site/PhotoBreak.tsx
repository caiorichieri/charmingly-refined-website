export function PhotoBreak() {
  return (
    <div className="relative h-[440px] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1600&q=85"
        alt="atleta in stato di flow pre-gara"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
      />
      <div className="absolute inset-0 bg-ink-deep/65" />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(50% 60% at 50% 50%, color-mix(in oklab, var(--brand-green) 25%, transparent), transparent 70%)",
        }}
      />
      <div className="relative h-full flex items-center justify-center px-6">
        <div className="reveal text-center max-w-4xl">
          <div className="font-display font-extrabold italic text-white leading-[1.05] text-[clamp(34px,5.5vw,72px)]">
            Il talento ti porta in gara.
            <br />
            <em
              className="not-italic"
              style={{
                background: "var(--gradient-green)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontStyle: "italic",
              }}
            >
              La mente decide come ci resti.
            </em>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-[oklch(0.1_0.005_270)] text-white px-6 md:px-12 pt-16 pb-8">
      <div className="max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-[1.2fr_2fr_1fr] gap-12 items-start">
        <div>
          <Logo variant="dark" className="h-32 w-auto -ml-3 mb-2" />
          <p className="text-[13px] text-white/35 leading-relaxed max-w-[260px]">
            MetaCare SRL — Centro sanitario autorizzato
            <br />
            Sede: Codroipo (UD) · P.IVA [inserire]
            <br />
            Finanziato da PR FESR 2021-2027 Regione FVG
          </p>
          <form className="mt-6 flex gap-2 max-w-[300px]">
            <input
              type="email"
              placeholder="La tua email"
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-[13px] text-white placeholder:text-white/35 focus:outline-none focus:border-brand-green transition-colors"
            />
            <button
              type="button"
              className="font-display font-bold text-[13px] tracking-wide bg-brand-green text-white px-5 rounded-full hover:brightness-110 transition-all"
            >
              Iscriviti
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          {[
            { h: "Servizi", links: ["Psicologo sportivo", "Mental coach", "Sessioni VR", "App MeMindSport", "Per le squadre"] },
            { h: "Azienda", links: ["Chi siamo", "Come funziona", "Blog", "Lavora con noi", "FAQ"] },
            { h: "Legale", links: ["Privacy Policy", "Cookie Policy", "Termini", "Contatti"] },
          ].map((col) => (
            <div key={col.h}>
              <h4 className="text-[11px] font-bold tracking-[0.14em] uppercase text-white/30 mb-4">{col.h}</h4>
              {col.links.map((l) => (
                <a key={l} href="#" className="block text-[13px] text-white/45 hover:text-white mb-2 transition-colors">
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div>
          <h4 className="text-[11px] font-bold tracking-[0.14em] uppercase text-white/30 mb-4">Seguici</h4>
          {["Instagram", "TikTok", "LinkedIn", "YouTube"].map((s) => (
            <a key={s} href="#" className="block text-[13px] text-white/45 hover:text-white mb-2 transition-colors">
              {s}
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto mt-12 pt-6 border-t border-white/6 flex flex-col md:flex-row justify-between gap-2 text-[12px] text-white/25">
        <span>© 2026 MetaCare SRL — MeMindSport. Tutti i diritti riservati.</span>
        <span>psicologia sportiva · mental coaching · allenamento mentale</span>
      </div>
    </footer>
  );
}

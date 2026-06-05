import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { openQuiz } from "@/components/quiz/openQuiz";
import { ManageCookiesLink } from "./ManageCookiesLink";

type FooterLink = { label: string; to?: string; href?: string; onClick?: () => void };

const columns: { h: string; links: FooterLink[] }[] = [
  {
    h: "Servizi",
    links: [
      { label: "Psicologo sportivo", to: "/", href: "/#professionisti" },
      { label: "Mental coach", to: "/", href: "/#professionisti" },
      { label: "Sessioni VR", to: "/", href: "/#immersivo" },
      { label: "App MeMindSport", onClick: openQuiz },
      { label: "Per le squadre", to: "/contatti" },
    ],
  },
  {
    h: "Azienda",
    links: [
      { label: "Chi siamo", to: "/", href: "/#professionisti" },
      { label: "Come funziona", to: "/", href: "/#come-funziona" },
      { label: "Formazione", to: "/eventi" },
      { label: "Blog", to: "/blog" },
      { label: "FAQ", to: "/", href: "/#faq" },
    ],
  },
  {
    h: "Legale",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Cookie Policy", to: "/cookie" },
      { label: "Termini", to: "/termini" },
      { label: "Contatti", to: "/contatti" },
    ],
  },
];

function FooterItem({ link }: { link: FooterLink }) {
  const cls = "block text-[13px] text-white/45 hover:text-white mb-2 transition-colors text-left";
  if (link.onClick) {
    return (
      <button type="button" onClick={link.onClick} className={cls}>
        {link.label}
      </button>
    );
  }
  if (link.href) {
    return (
      <a href={link.href} className={cls}>
        {link.label}
      </a>
    );
  }
  if (link.to) {
    return (
      <Link to={link.to} className={cls}>
        {link.label}
      </Link>
    );
  }
  return null;
}

export function Footer() {
  return (
    <footer className="bg-[oklch(0.1_0.005_270)] text-white px-6 md:px-12 pt-16 pb-8">
      <div className="max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-[1.2fr_2fr_1fr] gap-12 items-start">
        <div>
          <Logo variant="dark" className="h-32 w-auto -ml-3 mb-2" />
          <div className="font-display text-[22px] font-extrabold tracking-tight text-white mb-3">
            Me<span className="text-brand-green">Mind</span>Sport
          </div>
          <p className="text-[13px] text-white/35 leading-relaxed max-w-[280px]">
            <strong className="text-white/55">MetaCare SRL</strong>
            <br />
            Via Pola 7 — 33033 Codroipo (UD)
            <br />
            C.F. / P.IVA <span className="text-white/55">03102350307</span>
            <br />
            Autorizzazione Sanitaria Regione FVG
            <br />
            n. <span className="text-white/55">4710</span> del 13/01/2026
            <br />
            Finanziato da PR FESR 2021-2027 Regione FVG
          </p>
          <a
            href="mailto:info@memindsport.it"
            className="inline-block mt-4 text-[13px] text-white/60 hover:text-white transition-colors"
          >
            info@memindsport.it
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          {columns.map((col) => (
            <div key={col.h}>
              <h4 className="text-[11px] font-bold tracking-[0.14em] uppercase text-white/30 mb-4">{col.h}</h4>
              {col.links.map((l) => (
                <FooterItem key={l.label} link={l} />
              ))}
              {col.h === "Legale" && <ManageCookiesLink />}
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

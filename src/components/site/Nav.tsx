import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const links = [
  { href: "#come-funziona", label: "Come funziona" },
  { href: "#professionisti", label: "I professionisti" },
  { href: "#immersivo", label: "Ambienti immersivi" },
  { href: "#prezzi", label: "Prezzi" },
  { href: "#blog", label: "Blog" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 flex h-[68px] items-center justify-between px-6 md:px-12 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-line shadow-[0_4px_24px_-12px_rgba(0,0,0,0.12)]"
          : "bg-white/60 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <a href="#" className="flex items-center">
        <Logo variant="light" className="h-11 w-auto" />
      </a>
      <ul className="hidden lg:flex gap-7 list-none">
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-4">
        <a href="#" className="hidden md:inline text-sm font-medium text-muted-foreground hover:text-foreground">
          Accedi
        </a>
        <a
          href="#cta"
          className="font-display text-[15px] font-bold tracking-wider text-white bg-brand-green hover:brightness-110 px-5 py-2.5 rounded transition-all"
        >
          Scopri il tuo profilo →
        </a>
      </div>
    </nav>
  );
}

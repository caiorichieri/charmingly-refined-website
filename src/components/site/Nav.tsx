import { useEffect, useRef, useState } from "react";
import { QuizCTA } from "@/components/quiz/QuizCTA";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Logo } from "./Logo";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, LogOut, Menu, Stethoscope, User, X } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { href: "/#come-funziona", label: "Come funziona" },
  { href: "/#professionisti", label: "I professionisti" },
  { href: "/#immersivo", label: "Ambienti immersivi" },
  { href: "/#prezzi", label: "Prezzi" },
  { href: "/eventi", label: "Eventi" },
  { href: "/blog", label: "Blog" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const { isAuthenticated, isAdmin, isTherapist, user } = useAuth();

  useEffect(() => {
    if (mobileMenuOpen && firstLinkRef.current) {
      const timer = setTimeout(() => firstLinkRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setMenuOpen(false);
    setMobileMenuOpen(false);
    toast.success("Disconnesso");
  }

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 flex h-[68px] md:h-[96px] items-center justify-between px-4 md:px-12 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-line shadow-[0_4px_24px_-12px_rgba(0,0,0,0.12)]"
          : "bg-white/60 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <a href="/" aria-label="MeMindSport — Home" className="flex items-center gap-2 min-w-0">
        <Logo variant="light" className="h-20 md:h-36 w-auto -my-2 md:-my-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.12)] shrink-0" />
        <span className="font-display text-[16px] md:text-[22px] font-extrabold tracking-tight text-ink leading-none truncate">
          Me<span className="text-brand-green">Mind</span>Sport
        </span>
      </a>

      {/* Desktop links */}
      <ul className="hidden lg:flex gap-7 list-none">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        {/* Desktop auth */}
        {!isAuthenticated ? (
          <Link to="/auth" className="hidden md:inline text-sm font-medium text-muted-foreground hover:text-foreground">
            Accedi
          </Link>
        ) : (
          <div className="relative hidden md:block">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-brand-green"
            >
              <span className="grid place-items-center h-9 w-9 rounded-full bg-brand-green/10 text-brand-green">
                <User size={16} />
              </span>
              <span className="hidden md:inline max-w-[140px] truncate">{user?.email}</span>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-card border border-line py-2 z-50">
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-off">
                      <LayoutDashboard size={14} /> Dashboard admin
                    </Link>
                  )}
                  {isTherapist && (
                    <Link to="/area-terapeuta" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-off">
                      <Stethoscope size={14} /> Area terapeuta
                    </Link>
                  )}
                  <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-off text-red-600">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        <QuizCTA className="font-display text-[12px] md:text-[15px] font-bold tracking-wider text-white bg-brand-green hover:brightness-110 px-3 md:px-5 py-2 md:py-2.5 rounded-full transition-all whitespace-nowrap">
          <span className="md:hidden">Quiz →</span>
          <span className="hidden md:inline">Che tipo di atleta sei? →</span>
        </QuizCTA>

        {/* Mobile hamburger */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <button
              className="lg:hidden grid place-items-center h-10 w-10 rounded-full border border-line text-foreground hover:bg-off transition-colors"
              aria-label={mobileMenuOpen ? "Chiudi menu di navigazione" : "Apri menu di navigazione"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-panel"
              aria-haspopup="dialog"
            >
              {mobileMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </SheetTrigger>
          <SheetContent id="mobile-nav-panel" side="right" className="w-[280px] sm:w-80 bg-white p-0 flex flex-col" role="dialog" aria-modal="true">
            <SheetTitle className="sr-only">Menu di navigazione</SheetTitle>
            <SheetDescription className="sr-only">
              Menu principale del sito MeMindSport con collegamenti alle sezioni, area personale e logout.
            </SheetDescription>
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <span className="font-display text-lg font-extrabold tracking-tight text-ink">
                Me<span className="text-brand-green">Mind</span>Sport
              </span>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <ul className="flex flex-col gap-1 px-3">
                {links.map((l, i) => (
                  <li key={l.href}>
                    <a
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={l.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-off rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-6 px-6 border-t border-line pt-6 flex flex-col gap-3">
                {!isAuthenticated ? (
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-line text-sm font-medium text-foreground hover:bg-off transition-colors"
                  >
                    Accedi
                  </Link>
                ) : (
                  <>
                    <div className="flex items-center gap-3 px-1">
                      <span className="grid place-items-center h-9 w-9 rounded-full bg-brand-green/10 text-brand-green shrink-0">
                        <User size={16} />
                      </span>
                      <span className="text-sm font-medium text-foreground truncate">{user?.email}</span>
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-off rounded-lg transition-colors"
                      >
                        <LayoutDashboard size={16} /> Dashboard admin
                      </Link>
                    )}
                    {isTherapist && (
                      <Link
                        to="/area-terapeuta"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-off rounded-lg transition-colors"
                      >
                        <Stethoscope size={16} /> Area terapeuta
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

import { useEffect, useState } from "react";
import { QuizCTA } from "@/components/quiz/QuizCTA";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Logo } from "./Logo";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, LogOut, Stethoscope, User } from "lucide-react";

const links = [
  { href: "/#come-funziona", label: "Come funziona" },
  { href: "/#professionisti", label: "I professionisti" },
  { href: "/#immersivo", label: "Ambienti immersivi" },
  { href: "/#prezzi", label: "Prezzi" },
  { href: "/blog", label: "Blog" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, isTherapist, user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setMenuOpen(false);
    toast.success("Disconnesso");
  }

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 flex h-[96px] items-center justify-between px-6 md:px-12 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-line shadow-[0_4px_24px_-12px_rgba(0,0,0,0.12)]"
          : "bg-white/60 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <a href="/" className="flex items-center">
        <Logo variant="light" className="h-36 w-auto -my-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.12)]" />
      </a>
      <ul className="hidden lg:flex gap-7 list-none">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-4">
        {!isAuthenticated ? (
          <Link to="/auth" className="hidden md:inline text-sm font-medium text-muted-foreground hover:text-foreground">
            Accedi
          </Link>
        ) : (
          <div className="relative">
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
        <QuizCTA className="font-display text-[15px] font-bold tracking-wider text-white bg-brand-green hover:brightness-110 px-5 py-2.5 rounded-full transition-all">
          Che tipo di atleta sei? →
        </QuizCTA>
      </div>
    </nav>
  );
}

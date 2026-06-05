import { useEffect } from "react";
import { createFileRoute, Outlet, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";
import {
  LayoutDashboard,
  Newspaper,
  Tag,
  Route as RouteIcon,
  Quote,
  HelpCircle,
  Image as ImageIcon,
  Users,
  LogOut,
  Globe,
  ClipboardList,
  CalendarDays,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/blog", label: "Articoli blog", icon: Newspaper },
  { to: "/admin/events", label: "Formazione", icon: CalendarDays },
  { to: "/admin/plans", label: "Piani & prezzi", icon: Tag },
  { to: "/admin/paths", label: "Percorsi mentali", icon: RouteIcon },
  { to: "/admin/testimonials", label: "Testimonianze", icon: Quote },
  { to: "/admin/faqs", label: "FAQ", icon: HelpCircle },
  { to: "/admin/quiz", label: "Quiz & lead", icon: ClipboardList },
  { to: "/admin/media", label: "Media", icon: ImageIcon },
  { to: "/admin/users", label: "Utenti & ruoli", icon: Users },
  { to: "/admin/assignments", label: "Assegnazioni", icon: UserCog },
];

function AdminLayout() {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAdmin) {
      void navigate({ to: "/", replace: true });
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off">
        <div className="text-sm text-muted-foreground">Verifica permessi…</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off">
        <div className="text-sm text-muted-foreground">Reindirizzamento…</div>
      </div>
    );
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    toast.success("Disconnesso");
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen flex bg-off">
      <aside className="w-64 bg-ink-deep text-white flex flex-col p-4 sticky top-0 h-screen">
        <Link to="/admin" className="flex items-center justify-center mb-6 py-2">
          <Logo variant="dark" className="h-20 w-auto" />
        </Link>
        <nav className="flex-1 flex flex-col gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-white/10 text-white font-semibold"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={16} /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 pt-3 mt-3 flex flex-col gap-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white"
          >
            <Globe size={16} /> Vai al sito
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

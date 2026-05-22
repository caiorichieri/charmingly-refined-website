import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reimposta password — MeMindSport" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password aggiornata. Ora puoi accedere.");
    void navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-off flex flex-col">
      <header className="px-6 md:px-12 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo variant="light" className="h-20 w-auto -my-4" />
        </Link>
        <Link to="/auth" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          ← Torna all'accesso
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-line shadow-card p-8">
          <h1 className="font-display text-3xl font-extrabold text-ink mb-2">
            Reimposta password
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Inserisci la tua nuova password.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-foreground/80">Nuova password</span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                placeholder="••••••••"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="font-display font-bold tracking-wider text-white bg-brand-green hover:brightness-110 px-5 py-3 rounded-full transition-all disabled:opacity-60"
            >
              {busy ? "Attendi…" : "Aggiorna password"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Accedi — MM Sport" },
      { name: "description", content: "Accedi alla tua area MM Sport." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isTherapist, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || loading) return;
    void navigate({
      to: isAdmin ? "/admin" : isTherapist ? "/area-terapeuta" : "/",
      replace: true,
    });
  }, [isAuthenticated, isAdmin, isTherapist, loading, navigate]);

  if (isAuthenticated && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off">
        <div className="text-sm text-muted-foreground">Accesso in corso…</div>
      </div>
    );
  }

  async function handleEmail(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name || email.split("@")[0] },
            emailRedirectTo: window.location.origin + "/auth",
          },
        });
        if (error) throw error;
        toast.success("Account creato. Controlla la tua email per confermare l'accesso.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bentornato!");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore durante l'accesso");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/auth",
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore con Google");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-off flex flex-col">
      <header className="px-6 md:px-12 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo variant="light" className="h-20 w-auto -my-4" />
        </Link>
        <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          ← Torna al sito
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-line shadow-card p-8">
          <h1 className="font-display text-3xl font-extrabold text-ink mb-2">
            {mode === "login" ? "Accedi" : "Crea il tuo account"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === "login"
              ? "Entra nella tua area MM Sport."
              : "Registrati per accedere alla piattaforma."}
          </p>

          <button
            onClick={handleGoogle}
            disabled={busy}
            className="w-full flex items-center justify-center gap-3 border border-line rounded-full py-3 px-4 font-medium text-sm hover:bg-off transition-colors disabled:opacity-50"
          >
            <GoogleIcon /> Continua con Google
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-line" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">oppure</span>
            <div className="flex-1 h-px bg-line" />
          </div>

          <form onSubmit={handleEmail} className="flex flex-col gap-4">
            {mode === "signup" && (
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-foreground/80">Nome</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                  placeholder="Mario Rossi"
                />
              </label>
            )}
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-foreground/80">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                placeholder="tu@email.it"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-foreground/80">Password</span>
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
              {busy ? "Attendi…" : mode === "login" ? "Accedi" : "Registrati"}
            </button>
          </form>

          {mode === "login" && (
            <p className="text-center text-sm mt-4">
              <button
                type="button"
                onClick={async () => {
                  if (!email) {
                    toast.error("Inserisci la tua email per ricevere il link di recupero");
                    return;
                  }
                  setBusy(true);
                  const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin + "/reset-password",
                  });
                  setBusy(false);
                  if (error) toast.error(error.message);
                  else toast.success("Ti abbiamo inviato un link per reimpostare la password.");
                }}
                className="text-muted-foreground hover:text-foreground underline"
              >
                Password dimenticata?
              </button>
            </p>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === "login" ? "Non hai un account?" : "Hai già un account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-brand-green font-semibold hover:underline"
            >
              {mode === "login" ? "Registrati" : "Accedi"}
            </button>
          </p>

        </div>
      </main>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path
        fill="#4285F4"
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

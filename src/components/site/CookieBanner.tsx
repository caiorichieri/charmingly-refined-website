import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie, Settings, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "memind:cookie-consent:v1";
const ANON_ID_KEY = "memind:anon-id";

type Choice = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
};

function getOrCreateAnonId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(ANON_ID_KEY);
  if (!id) {
    id = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`)
      .replace(/-/g, "")
      .slice(0, 32);
    localStorage.setItem(ANON_ID_KEY, id);
  }
  return id;
}

export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  async function persist(choice: Omit<Choice, "decidedAt">) {
    const full: Choice = { ...choice, decidedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
    const { data: userData } = await supabase.auth.getUser();
    const anon = getOrCreateAnonId();
    await supabase.from("cookie_consents").insert({
      user_id: userData.user?.id ?? null,
      anonymous_id: userData.user?.id ? null : anon,
      necessary: true,
      analytics: choice.analytics,
      marketing: choice.marketing,
      user_agent: navigator.userAgent.slice(0, 500),
    });
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-5 pointer-events-none">
      <div className="pointer-events-auto max-w-3xl mx-auto bg-white border border-line shadow-2xl rounded-2xl p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid place-items-center h-10 w-10 rounded-full bg-brand-green/10 text-brand-green shrink-0">
            <Cookie size={18} />
          </span>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-base font-extrabold text-ink">
              Rispettiamo la tua privacy
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              Usiamo cookie tecnici necessari al funzionamento del sito e, previo tuo consenso,
              cookie di analisi e marketing. Puoi accettare tutto, rifiutare o personalizzare.{" "}
              <Link to="/cookie" className="underline text-brand-green hover:brightness-90">
                Maggiori informazioni
              </Link>
              .
            </p>

            {showPrefs && (
              <div className="mt-4 space-y-2 bg-off rounded-xl p-4">
                <ToggleRow
                  label="Necessari"
                  description="Sempre attivi: indispensabili per il funzionamento del sito."
                  checked
                  disabled
                />
                <ToggleRow
                  label="Analytics"
                  description="Statistiche anonime di utilizzo per migliorare il servizio."
                  checked={analytics}
                  onChange={setAnalytics}
                />
                <ToggleRow
                  label="Marketing"
                  description="Personalizzazione di contenuti e annunci."
                  checked={marketing}
                  onChange={setMarketing}
                />
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => persist({ necessary: true, analytics: false, marketing: false })}
                className="px-4 py-2 text-sm font-semibold rounded-full border border-line text-foreground hover:bg-off transition"
              >
                Rifiuta non essenziali
              </button>
              {!showPrefs ? (
                <button
                  onClick={() => setShowPrefs(true)}
                  className="px-4 py-2 text-sm font-semibold rounded-full border border-line text-foreground hover:bg-off transition inline-flex items-center gap-1.5"
                >
                  <Settings size={14} /> Personalizza
                </button>
              ) : (
                <button
                  onClick={() => persist({ necessary: true, analytics, marketing })}
                  className="px-4 py-2 text-sm font-semibold rounded-full border border-brand-green text-brand-green hover:bg-brand-green/10 transition"
                >
                  Salva preferenze
                </button>
              )}
              <button
                onClick={() => persist({ necessary: true, analytics: true, marketing: true })}
                className="px-4 py-2 text-sm font-semibold rounded-full bg-brand-green text-white hover:brightness-110 transition"
              >
                Accetta tutto
              </button>
            </div>
          </div>
          <button
            aria-label="Chiudi"
            onClick={() => persist({ necessary: true, analytics: false, marketing: false })}
            className="p-1 text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 h-4 w-4 accent-brand-green"
      />
      <div className="flex-1">
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </label>
  );
}

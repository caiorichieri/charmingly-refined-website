import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/site/Logo";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/onboarding-terapeuta")({
  component: OnboardingTerapeuta,
});

const SPECIALIZZAZIONI = [
  "Psicologia dello Sport",
  "Mental Coaching",
  "Ansia da prestazione",
  "Recupero post-infortunio",
  "Sport di squadra",
  "Sport individuali",
  "Atleti adolescenti",
  "Atleti professionisti",
  "Mindfulness",
  "Visualizzazione",
];

function OnboardingTerapeuta() {
  const navigate = useNavigate();
  const { user, isTherapist, isAdmin, loading } = useAuth();

  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    codice_fiscale: "",
    citta: "",
    paese: "Italia",
    numero_albo: "",
    ordine_regionale: "",
    titolo_studio: "",
    formazione: "",
    anni_esperienza: "",
    bio: "",
  });
  const [specs, setSpecs] = useState<string[]>([]);

  const { data: existing, isLoading } = useQuery({
    queryKey: ["therapist_profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("therapist_profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (existing) {
      setForm({
        full_name: existing.full_name ?? "",
        phone: existing.phone ?? "",
        codice_fiscale: existing.codice_fiscale ?? "",
        citta: existing.citta ?? "",
        paese: existing.paese ?? "Italia",
        numero_albo: existing.numero_albo ?? "",
        ordine_regionale: existing.ordine_regionale ?? "",
        titolo_studio: existing.titolo_studio ?? "",
        formazione: existing.formazione ?? "",
        anni_esperienza: existing.anni_esperienza?.toString() ?? "",
        bio: existing.bio ?? "",
      });
      setSpecs(existing.specializzazioni ?? []);
    }
  }, [existing]);

  useEffect(() => {
    if (!loading && !isTherapist && !isAdmin) {
      void navigate({ to: "/area-atleta", replace: true });
    }
  }, [loading, isTherapist, isAdmin, navigate]);

  function toggleSpec(s: string) {
    setSpecs((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!form.full_name.trim() || !form.numero_albo.trim() || !form.formazione.trim()) {
      toast.error("Compila i campi obbligatori (nome, numero albo, formazione).");
      return;
    }
    setBusy(true);
    try {
      const payload = {
        user_id: user.id,
        full_name: form.full_name.trim(),
        phone: form.phone.trim() || null,
        codice_fiscale: form.codice_fiscale.trim() || null,
        citta: form.citta.trim() || null,
        paese: form.paese.trim() || null,
        numero_albo: form.numero_albo.trim(),
        ordine_regionale: form.ordine_regionale.trim() || null,
        titolo_studio: form.titolo_studio.trim() || null,
        formazione: form.formazione.trim(),
        specializzazioni: specs,
        anni_esperienza: form.anni_esperienza ? parseInt(form.anni_esperienza, 10) : null,
        bio: form.bio.trim() || null,
        completed_at: new Date().toISOString(),
      };
      const { error: upsertErr } = await supabase
        .from("therapist_profiles")
        .upsert(payload, { onConflict: "user_id" })
        .select()
        .maybeSingle();
      if (upsertErr) {
        console.error("[onboarding-terapeuta] upsert error", upsertErr);
        throw upsertErr;
      }
      const { error: profileErr } = await supabase
        .from("profiles")
        .update({ display_name: form.full_name.trim() })
        .eq("id", user.id);
      if (profileErr) console.error("[onboarding-terapeuta] profile update error", profileErr);
      toast.success("Profilo professionale salvato.");
      void navigate({ to: "/area-terapeuta", replace: true });
    } catch (err) {
      console.error("[onboarding-terapeuta] save failed", err);
      toast.error(err instanceof Error ? err.message : "Errore nel salvataggio");
    } finally {
      setBusy(false);
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off">
        <div className="text-sm text-muted-foreground">Caricamento…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off">
      <header className="px-6 md:px-12 py-4 flex items-center justify-between bg-white border-b border-line">
        <Link to="/" className="flex items-center">
          <Logo variant="light" className="h-14 w-auto -my-2" />
        </Link>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
        >
          <LogOut size={14} /> Logout
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-sm text-brand-green font-semibold">Area Terapeuta</p>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-ink mt-1">
            {existing?.completed_at ? "Aggiorna il tuo profilo" : "Completa il tuo profilo professionale"}
          </h1>
          <p className="text-muted-foreground mt-2">
            Inserisci i dati richiesti per essere abilitato/a al lavoro con gli atleti sulla
            piattaforma. I campi contrassegnati con <span className="text-red-600">*</span> sono
            obbligatori.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-line rounded-2xl p-6 md:p-8 space-y-6"
        >
          <section>
            <h2 className="font-display text-lg font-extrabold text-ink mb-4">Dati anagrafici</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="Nome e cognome"
                required
                value={form.full_name}
                onChange={(v) => update("full_name", v)}
              />
              <Field
                label="Telefono"
                value={form.phone}
                onChange={(v) => update("phone", v)}
                placeholder="+39 ..."
              />
              <Field
                label="Codice fiscale"
                value={form.codice_fiscale}
                onChange={(v) => update("codice_fiscale", v)}
              />
              <Field label="Città" value={form.citta} onChange={(v) => update("citta", v)} />
              <Field label="Paese" value={form.paese} onChange={(v) => update("paese", v)} />
            </div>
          </section>

          <section className="pt-2 border-t border-line">
            <h2 className="font-display text-lg font-extrabold text-ink mb-4 mt-4">
              Iscrizione all'albo
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="Numero iscrizione albo"
                required
                value={form.numero_albo}
                onChange={(v) => update("numero_albo", v)}
              />
              <Field
                label="Ordine regionale"
                value={form.ordine_regionale}
                onChange={(v) => update("ordine_regionale", v)}
                placeholder="es. Lombardia"
              />
            </div>
          </section>

          <section className="pt-2 border-t border-line">
            <h2 className="font-display text-lg font-extrabold text-ink mb-4 mt-4">
              Formazione e specializzazione
            </h2>
            <div className="grid gap-4">
              <Field
                label="Titolo di studio"
                value={form.titolo_studio}
                onChange={(v) => update("titolo_studio", v)}
                placeholder="es. Laurea magistrale in Psicologia"
              />
              <TextArea
                label="Formazione (master, corsi, certificazioni)"
                required
                value={form.formazione}
                onChange={(v) => update("formazione", v)}
                placeholder="Elenca i tuoi percorsi formativi più rilevanti…"
                rows={4}
              />
              <Field
                label="Anni di esperienza"
                value={form.anni_esperienza}
                onChange={(v) => update("anni_esperienza", v.replace(/\D/g, ""))}
                placeholder="es. 8"
              />
              <div>
                <span className="text-xs font-semibold text-foreground/80 block mb-2">
                  Aree di specializzazione
                </span>
                <div className="flex flex-wrap gap-2">
                  {SPECIALIZZAZIONI.map((s) => {
                    const active = specs.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSpec(s)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          active
                            ? "bg-brand-green/10 border-brand-green text-brand-green font-semibold"
                            : "border-line text-foreground/70 hover:bg-off"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
              <TextArea
                label="Bio professionale"
                value={form.bio}
                onChange={(v) => update("bio", v)}
                placeholder="Breve presentazione visibile agli atleti…"
                rows={4}
              />
            </div>
          </section>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={busy}
              className="font-display font-bold tracking-wider text-white bg-brand-green hover:brightness-110 px-6 py-3 rounded-full transition-all disabled:opacity-60"
            >
              {busy ? "Salvataggio…" : "Salva e continua"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

function Field({
  label,
  required,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-foreground/80">
        {label} {required && <span className="text-red-600">*</span>}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="border border-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
      />
    </label>
  );
}

function TextArea({
  label,
  required,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-foreground/80">
        {label} {required && <span className="text-red-600">*</span>}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="border border-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
      />
    </label>
  );
}

import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download, Trash2, ShieldCheck, ArrowLeft, FileJson } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/_authenticated/i-miei-dati")({
  component: MyDataPage,
});

function MyDataPage() {
  const { user, isAthlete, isTherapist, isAdmin } = useAuth();
  const qc = useQueryClient();
  const [exporting, setExporting] = useState(false);
  const [reason, setReason] = useState("");
  const [requesting, setRequesting] = useState(false);

  const backTo = isAdmin ? "/admin" : isTherapist ? "/area-terapeuta" : "/area-atleta";

  const { data: deletion } = useQuery({
    queryKey: ["my-deletion", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("account_deletion_requests")
        .select("*")
        .eq("user_id", user!.id)
        .order("requested_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: consents } = useQuery({
    queryKey: ["my-consents", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_consents")
        .select("document, version, granted, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });

  async function handleExport() {
    if (!user?.id) return;
    setExporting(true);
    try {
      const [profile, leads, msgs, materials, assignments, consentsAll, cookieAll, deletions] =
        await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
          supabase.from("quiz_leads").select("*").eq("email", user.email ?? ""),
          supabase
            .from("messages")
            .select("*")
            .or(`athlete_id.eq.${user.id},therapist_id.eq.${user.id}`),
          supabase
            .from("shared_materials")
            .select("*")
            .or(`athlete_id.eq.${user.id},therapist_id.eq.${user.id}`),
          supabase
            .from("athlete_assignments")
            .select("*")
            .or(`athlete_id.eq.${user.id},therapist_id.eq.${user.id}`),
          supabase.from("user_consents").select("*").eq("user_id", user.id),
          supabase.from("cookie_consents").select("*").eq("user_id", user.id),
          supabase.from("account_deletion_requests").select("*").eq("user_id", user.id),
        ]);

      const payload = {
        exported_at: new Date().toISOString(),
        user: { id: user.id, email: user.email },
        profile: profile.data,
        quiz_leads: leads.data,
        messages: msgs.data,
        shared_materials: materials.data,
        athlete_assignments: assignments.data,
        user_consents: consentsAll.data,
        cookie_consents: cookieAll.data,
        account_deletion_requests: deletions.data,
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `memind-miei-dati-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Esportazione completata");
    } catch (err) {
      toast.error((err as Error).message || "Errore esportazione");
    } finally {
      setExporting(false);
    }
  }

  async function handleRequestDeletion() {
    if (!user?.id) return;
    if (
      !confirm(
        "Confermi di voler richiedere la cancellazione del tuo account? La richiesta sarà presa in carico dal nostro team."
      )
    )
      return;
    setRequesting(true);
    const { error } = await supabase.from("account_deletion_requests").insert({
      user_id: user.id,
      reason: reason.trim() || null,
      status: "pending",
    });
    setRequesting(false);
    if (error) {
      toast.error("Errore invio richiesta");
      return;
    }
    toast.success("Richiesta inviata. Ti contatteremo a breve.");
    setReason("");
    qc.invalidateQueries({ queryKey: ["my-deletion", user.id] });
  }

  return (
    <div className="min-h-screen bg-off">
      <header className="px-6 md:px-12 py-4 flex items-center justify-between bg-white border-b border-line">
        <Link to="/" className="flex items-center">
          <Logo variant="light" className="h-14 w-auto -my-2" />
        </Link>
        <Link
          to={backTo}
          className="text-sm font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
        >
          <ArrowLeft size={14} /> Torna all'area
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-5">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck size={14} /> GDPR · Diritti dell'interessato
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-ink mt-1">
            I miei dati
          </h1>
          <p className="text-muted-foreground mt-2">
            In conformità con il Regolamento UE 2016/679 (GDPR) puoi esportare i tuoi dati o
            richiederne la cancellazione in qualsiasi momento.
          </p>
        </div>

        <section className="bg-white border border-line rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="grid place-items-center h-9 w-9 rounded-full bg-brand-green/10 text-brand-green">
              <FileJson size={16} />
            </span>
            <h2 className="font-display text-lg font-extrabold text-ink">
              Esporta i miei dati (Art. 20)
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Scarica un file JSON contenente tutti i dati personali associati al tuo account:
            profilo, risultati quiz, messaggi, materiali, assegnazioni e consensi.
          </p>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-brand-green text-white rounded-full hover:brightness-110 disabled:opacity-50 transition"
          >
            <Download size={14} /> {exporting ? "Esportazione…" : "Scarica i miei dati (.json)"}
          </button>
        </section>

        <section className="bg-white border border-line rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="grid place-items-center h-9 w-9 rounded-full bg-brand-green/10 text-brand-green">
              <ShieldCheck size={16} />
            </span>
            <h2 className="font-display text-lg font-extrabold text-ink">
              Consensi prestati
            </h2>
          </div>
          {!consents || consents.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              Nessun consenso registrato.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {consents.map((c, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between text-sm bg-off rounded-lg px-3 py-2"
                >
                  <span className="font-medium text-foreground capitalize">{c.document}</span>
                  <span className="text-xs text-muted-foreground">
                    v{c.version} · {new Date(c.created_at).toLocaleDateString("it-IT")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white border border-line rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="grid place-items-center h-9 w-9 rounded-full bg-red-50 text-red-600">
              <Trash2 size={16} />
            </span>
            <h2 className="font-display text-lg font-extrabold text-ink">
              Cancellazione account (Art. 17)
            </h2>
          </div>

          {deletion?.status === "pending" || deletion?.status === "processing" ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
              Hai una richiesta di cancellazione <strong>{deletion.status}</strong> dal{" "}
              {new Date(deletion.requested_at).toLocaleDateString("it-IT")}. Il nostro team la
              prenderà in carico al più presto.
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-3">
                Richiedi la cancellazione definitiva del tuo account e di tutti i dati associati.
                L'operazione è irreversibile.
              </p>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Motivo (opzionale)"
                maxLength={2000}
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-lg border border-line bg-white mb-3"
              />
              <button
                onClick={handleRequestDeletion}
                disabled={requesting}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-full hover:brightness-110 disabled:opacity-50 transition"
              >
                <Trash2 size={14} />{" "}
                {requesting ? "Invio…" : "Richiedi cancellazione account"}
              </button>
            </>
          )}
        </section>

        <p className="text-xs text-muted-foreground">
          Per esercitare altri diritti (rettifica, limitazione, opposizione) scrivi a{" "}
          <a href="mailto:privacy@memindsport.it" className="underline">
            privacy@memindsport.it
          </a>
          .
        </p>
        {/* anti-unused warning */}
        <span className="hidden">{String(isAthlete)}</span>
      </main>
    </div>
  );
}

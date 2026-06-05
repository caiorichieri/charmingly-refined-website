import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/site/Logo";
import { LogOut, Users, ClipboardList, MessageSquare, FileText } from "lucide-react";
import { ChatThread } from "@/components/portal/ChatThread";
import { MaterialsList } from "@/components/portal/MaterialsList";

export const Route = createFileRoute("/_authenticated/area-terapeuta")({
  component: TherapistArea,
});

type AthleteRow = {
  athlete_id: string;
  assigned_at: string;
  profile: { display_name: string | null; email: string | null; avatar_url: string | null } | null;
};

function TherapistArea() {
  const { user } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);

  async function handleLogout() {
    await supabase.auth.signOut();
    toast.success("Disconnesso");
    window.location.href = "/";
  }

  const { data: athletes = [], isLoading } = useQuery({
    queryKey: ["therapist", "athletes", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("athlete_assignments")
        .select("athlete_id, assigned_at")
        .eq("therapist_id", user!.id)
        .eq("active", true)
        .order("assigned_at", { ascending: false });
      if (error) throw error;
      if (!data?.length) return [] as AthleteRow[];
      const ids = data.map((r) => r.athlete_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, email, avatar_url")
        .in("id", ids);
      return data.map((r) => ({
        ...r,
        profile: profiles?.find((p) => p.id === r.athlete_id) ?? null,
      })) as AthleteRow[];
    },
  });

  const current = athletes.find((a) => a.athlete_id === selected) ?? null;

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

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-sm text-muted-foreground">Area Terapeuta</p>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-ink mt-1">
            I tuoi atleti
          </h1>
          <p className="text-muted-foreground mt-2">
            Visualizza i risultati del quiz, comunica e condividi materiali con gli atleti a te
            assegnati.
          </p>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Athletes list */}
          <aside className="bg-white border border-line rounded-2xl p-4 h-fit">
            <div className="flex items-center gap-2 mb-3">
              <Users size={16} className="text-brand-green" />
              <h2 className="font-display font-extrabold text-ink">
                Atleti ({athletes.length})
              </h2>
            </div>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Caricamento…</p>
            ) : athletes.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                Non hai ancora atleti assegnati. Contatta l'amministratore.
              </p>
            ) : (
              <ul className="space-y-1">
                {athletes.map((a) => {
                  const name = a.profile?.display_name || a.profile?.email || "—";
                  const active = selected === a.athlete_id;
                  return (
                    <li key={a.athlete_id}>
                      <button
                        onClick={() => setSelected(a.athlete_id)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2.5 transition ${
                          active
                            ? "bg-brand-green/10 text-brand-green"
                            : "hover:bg-off text-foreground"
                        }`}
                      >
                        <span className="grid place-items-center h-8 w-8 rounded-full bg-brand-green/10 text-brand-green text-xs font-bold shrink-0">
                          {name.slice(0, 2).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{name}</p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {a.profile?.email}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>

          {/* Detail */}
          <section>
            {!current ? (
              <div className="bg-white border border-line rounded-2xl p-12 text-center">
                <Users size={32} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  Seleziona un atleta dalla lista per vedere i suoi dati.
                </p>
              </div>
            ) : (
              <AthleteDetail
                athleteId={current.athlete_id}
                athleteEmail={current.profile?.email ?? null}
                athleteName={current.profile?.display_name || current.profile?.email || "Atleta"}
                therapistId={user!.id}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function AthleteDetail({
  athleteId,
  athleteEmail,
  athleteName,
  therapistId,
}: {
  athleteId: string;
  athleteEmail: string | null;
  athleteName: string;
  therapistId: string;
}) {
  const { data: quiz } = useQuery({
    queryKey: ["therapist", "quiz", athleteEmail],
    enabled: !!athleteEmail,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_leads")
        .select("id, name, email, result_summary, created_at")
        .eq("email", athleteEmail!)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-5">
      <div className="bg-white border border-line rounded-2xl p-6">
        <h2 className="font-display text-2xl font-extrabold text-ink">{athleteName}</h2>
        {athleteEmail && (
          <p className="text-sm text-muted-foreground mt-1">{athleteEmail}</p>
        )}
      </div>

      <div className="bg-white border border-line rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList size={16} className="text-brand-green" />
          <h3 className="font-display text-lg font-extrabold text-ink">Risultati quiz</h3>
        </div>
        {!quiz || quiz.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            Questo atleta non ha ancora completato il quiz.
          </p>
        ) : (
          <ul className="space-y-3">
            {quiz.map((q) => (
              <li key={q.id} className="bg-off rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-2">
                  {new Date(q.created_at).toLocaleString("it-IT")}
                </p>
                {q.result_summary && (
                  <p className="text-sm text-foreground/80 whitespace-pre-wrap">
                    {q.result_summary}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white border border-line rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={16} className="text-brand-green" />
          <h3 className="font-display text-lg font-extrabold text-ink">Messaggi</h3>
        </div>
        <ChatThread
          athleteId={athleteId}
          therapistId={therapistId}
          currentUserId={therapistId}
        />
      </div>

      <div className="bg-white border border-line rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={16} className="text-brand-green" />
          <h3 className="font-display text-lg font-extrabold text-ink">Materiali condivisi</h3>
        </div>
        <MaterialsList
          athleteId={athleteId}
          therapistId={therapistId}
          canUpload={true}
        />
      </div>
    </div>
  );
}

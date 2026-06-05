import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/site/Logo";
import { QuizCTA } from "@/components/quiz/QuizCTA";
import { LogOut, User as UserIcon, Stethoscope, ClipboardList, MessageSquare, FileText, Calendar } from "lucide-react";

export const Route = createFileRoute("/_authenticated/area-atleta")({
  component: AthleteArea,
});

function AthleteArea() {
  const { user } = useAuth();

  async function handleLogout() {
    await supabase.auth.signOut();
    toast.success("Disconnesso");
    window.location.href = "/";
  }

  const { data: profile } = useQuery({
    queryKey: ["athlete", "profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, email, avatar_url, bio")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: assignment } = useQuery({
    queryKey: ["athlete", "assignment", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("athlete_assignments")
        .select("therapist_id, assigned_at")
        .eq("athlete_id", user!.id)
        .eq("active", true)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const { data: tp } = await supabase
        .from("profiles")
        .select("display_name, email, avatar_url")
        .eq("id", data.therapist_id)
        .maybeSingle();
      return { ...data, therapist: tp };
    },
  });

  const { data: lastQuiz } = useQuery({
    queryKey: ["athlete", "lastQuiz", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_leads")
        .select("id, name, email, result_summary, created_at")
        .eq("email", user!.email!)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "atleta";
  const initials = useMemo(() => displayName.slice(0, 2).toUpperCase(), [displayName]);

  return (
    <div className="min-h-screen bg-off">
      <header className="px-6 md:px-12 py-4 flex items-center justify-between bg-white border-b border-line">
        <Link to="/" className="flex items-center">
          <Logo variant="light" className="h-14 w-auto -my-2" />
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <span className="grid place-items-center h-8 w-8 rounded-full bg-brand-green/10 text-brand-green text-xs font-bold">
              {initials}
            </span>
            {displayName}
          </span>
          <button onClick={handleLogout} className="text-sm font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-sm text-muted-foreground">Benvenuto</p>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-ink mt-1">
            Ciao {displayName.split(" ")[0]} 👋
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Questa è la tua area personale. Qui troverai il tuo profilo mentale, il tuo terapeuta di
            riferimento, i materiali condivisi e le sessioni in programma.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Profilo + Quiz */}
          <Card>
            <CardHead icon={ClipboardList} title="Il tuo profilo mentale" />
            {lastQuiz ? (
              <>
                <p className="text-sm text-muted-foreground mb-3">
                  Ultimo quiz completato il{" "}
                  <strong className="text-foreground">
                    {new Date(lastQuiz.created_at).toLocaleDateString("it-IT")}
                  </strong>
                </p>
                {lastQuiz.result_summary && (
                  <div className="bg-off rounded-xl p-4 text-sm text-foreground/80 whitespace-pre-line">
                    {lastQuiz.result_summary.slice(0, 280)}
                    {lastQuiz.result_summary.length > 280 && "…"}
                  </div>
                )}
                <QuizCTA className="mt-4 inline-flex text-sm font-bold tracking-wider text-brand-green border border-brand-green rounded-full px-4 py-2 hover:bg-brand-green hover:text-white transition-all">
                  Ripeti il quiz →
                </QuizCTA>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-3">
                  Non hai ancora completato il quiz "Che tipo di atleta sei?". Inizia ora per
                  scoprire il tuo profilo mentale.
                </p>
                <QuizCTA className="font-display text-sm font-bold tracking-wider text-white bg-brand-green hover:brightness-110 px-4 py-2 rounded-full transition-all">
                  Inizia il quiz →
                </QuizCTA>
              </>
            )}
          </Card>

          {/* Terapeuta */}
          <Card>
            <CardHead icon={Stethoscope} title="Il tuo terapeuta" />
            {assignment?.therapist ? (
              <div className="flex items-center gap-4">
                <span className="grid place-items-center h-14 w-14 rounded-full bg-brand-green/10 text-brand-green font-bold text-lg">
                  {(assignment.therapist.display_name || "?").slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <p className="font-semibold text-ink">{assignment.therapist.display_name}</p>
                  <p className="text-sm text-muted-foreground">{assignment.therapist.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Assegnato dal{" "}
                    {new Date(assignment.assigned_at).toLocaleDateString("it-IT")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-off rounded-xl p-4 text-sm text-muted-foreground">
                Non hai ancora un terapeuta assegnato. Il nostro team ti contatterà a breve per
                abbinarti al professionista più adatto al tuo percorso.
              </div>
            )}
          </Card>

          {/* Materiali (placeholder Step 2) */}
          <Card>
            <CardHead icon={FileText} title="Materiali condivisi" />
            <p className="text-sm text-muted-foreground">
              Qui troverai i documenti, video ed esercizi che il tuo terapeuta condividerà con te.
            </p>
            <p className="text-xs text-muted-foreground mt-3 italic">
              Funzione in arrivo nel prossimo aggiornamento.
            </p>
          </Card>

          {/* Messaggi (placeholder Step 2) */}
          <Card>
            <CardHead icon={MessageSquare} title="Messaggi" />
            <p className="text-sm text-muted-foreground">
              Comunica in modo sicuro con il tuo terapeuta tramite il sistema di messaggistica
              integrato.
            </p>
            <p className="text-xs text-muted-foreground mt-3 italic">
              Funzione in arrivo nel prossimo aggiornamento.
            </p>
          </Card>

          {/* Sessioni (placeholder) */}
          <Card>
            <CardHead icon={Calendar} title="Prossime sessioni" />
            <p className="text-sm text-muted-foreground">
              Visualizza il calendario, prenota e gestisci le tue sessioni con il terapeuta.
            </p>
            <p className="text-xs text-muted-foreground mt-3 italic">
              Funzione in arrivo nel prossimo aggiornamento.
            </p>
          </Card>

          {/* Dati GDPR (placeholder Step 3) */}
          <Card>
            <CardHead icon={UserIcon} title="I miei dati (GDPR)" />
            <p className="text-sm text-muted-foreground">
              Esporta tutti i tuoi dati personali o richiedi la cancellazione del tuo account in
              qualsiasi momento.
            </p>
            <p className="text-xs text-muted-foreground mt-3 italic">
              Funzione in arrivo nel prossimo aggiornamento.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white border border-line rounded-2xl p-6">{children}</div>;
}

function CardHead({ icon: Icon, title }: { icon: typeof Stethoscope; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="grid place-items-center h-9 w-9 rounded-full bg-brand-green/10 text-brand-green">
        <Icon size={16} />
      </span>
      <h2 className="font-display text-lg font-extrabold text-ink">{title}</h2>
    </div>
  );
}

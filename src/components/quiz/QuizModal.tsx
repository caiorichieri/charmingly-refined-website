import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { QUIZ_OPEN_EVENT } from "./openQuiz";
import { toast } from "sonner";

type Question = {
  id: string;
  text: string;
  display_order: number;
  quiz_options: { id: string; text: string; profile_tag: string; display_order: number }[];
};

type Step = "contact" | "questions" | "done";

const PROFILE_LABELS: Record<string, { name: string; tagline: string }> = {
  fragile: { name: "Atleta Sensibile", tagline: "Hai grande potenziale ma la pressione ti pesa: il percorso giusto può fare la differenza." },
  guerriero: { name: "Atleta Guerriero", tagline: "Vivi di sfida e adrenalina: lavoriamo per canalizzare la tua energia al meglio." },
  metodico: { name: "Atleta Metodico", tagline: "Sei analitico e costante: il mental training ti dà gli strumenti per il salto di qualità." },
  libero: { name: "Atleta Libero", tagline: "Vivi lo sport con leggerezza: troviamo l'equilibrio tra divertimento e prestazione." },
};

export function QuizModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("contact");
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { optionId: string; tag: string }>>({});
  const [submitting, setSubmitting] = useState(false);
  const [resultProfile, setResultProfile] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => {
      setOpen(true);
      setStep("contact");
      setCurrent(0);
      setAnswers({});
      setResultProfile(null);
    };
    window.addEventListener(QUIZ_OPEN_EVENT, handler);
    return () => window.removeEventListener(QUIZ_OPEN_EVENT, handler);
  }, []);

  const { data: questions, isLoading } = useQuery({
    queryKey: ["quiz-questions"],
    queryFn: async (): Promise<Question[]> => {
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("id, text, display_order, quiz_options(id, text, profile_tag, display_order)")
        .eq("published", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((q: any) => ({
        ...q,
        quiz_options: (q.quiz_options ?? []).sort(
          (a: any, b: any) => a.display_order - b.display_order,
        ),
      }));
    },
    enabled: open,
  });

  const total = questions?.length ?? 0;
  const progress = step === "contact" ? 0 : step === "done" ? 100 : Math.round(((current + 1) / Math.max(total, 1)) * 100);

  function validateContact() {
    if (!contact.name.trim()) return "Inserisci il tuo nome";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) return "Email non valida";
    if (!/^[\d+\s()-]{6,}$/.test(contact.phone)) return "Telefono non valido";
    return null;
  }

  async function startQuiz() {
    const err = validateContact();
    if (err) {
      toast.error(err);
      return;
    }
    setStep("questions");
  }

  async function pickOption(optionId: string, tag: string) {
    if (!questions) return;
    const q = questions[current];
    const newAnswers = { ...answers, [q.id]: { optionId, tag } };
    setAnswers(newAnswers);

    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
      return;
    }
    // finalize
    setSubmitting(true);
    try {
      // compute dominant profile
      const counts: Record<string, number> = {};
      Object.values(newAnswers).forEach((a) => {
        counts[a.tag] = (counts[a.tag] ?? 0) + 1;
      });
      const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "equilibrato";
      const profile = PROFILE_LABELS[dominant];
      const summary = profile ? `${profile.name} — ${profile.tagline}` : dominant;

      const { data: lead, error: leadErr } = await supabase
        .from("quiz_leads")
        .insert({
          name: contact.name.trim(),
          email: contact.email.trim().toLowerCase(),
          phone: contact.phone.trim(),
          result_summary: summary,
        })
        .select("id")
        .single();
      if (leadErr) throw leadErr;

      const rows = Object.entries(newAnswers).map(([questionId, a]) => ({
        lead_id: lead.id,
        question_id: questionId,
        option_id: a.optionId,
      }));
      const { error: respErr } = await supabase.from("quiz_responses").insert(rows);
      if (respErr) throw respErr;

      // best-effort email (server function may not exist yet)
      try {
        await fetch("/lovable/email/transactional/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateName: "quiz-result",
            recipientEmail: contact.email.trim().toLowerCase(),
            idempotencyKey: `quiz-${lead.id}`,
            templateData: { name: contact.name.trim(), profile: profile?.name, tagline: profile?.tagline },
          }),
        });
      } catch {
        // ignored — email infra may not be configured yet
      }

      setResultProfile(dominant);
      setStep("done");
    } catch (e: any) {
      console.error(e);
      toast.error("Si è verificato un errore. Riprova tra poco.");
    } finally {
      setSubmitting(false);
    }
  }

  function close() {
    setOpen(false);
  }

  function scrollToPlans() {
    setOpen(false);
    setTimeout(() => {
      const el = document.getElementById("prezzi");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.location.href = "/#prezzi";
    }, 200);
  }

  const q = questions?.[current];
  const selectedId = q ? answers[q.id]?.optionId : undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl border-border bg-card p-0 sm:rounded-2xl overflow-hidden">
        {/* progress bar */}
        <div className="h-1 w-full bg-muted">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-6 sm:p-8">
          {step === "contact" && (
            <div className="space-y-5">
              <div>
                <DialogTitle className="font-display text-2xl sm:text-3xl text-foreground">
                  Che tipo di atleta sei?
                </DialogTitle>
                <DialogDescription className="mt-2 text-sm text-muted-foreground">
                  Rispondi a 10 brevi domande e scopri il tuo profilo mentale. Inizia con i tuoi dati di contatto.
                </DialogDescription>
              </div>
              <div className="space-y-3">
                <input
                  className="input w-full"
                  placeholder="Nome e cognome *"
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                />
                <input
                  className="input w-full"
                  type="email"
                  placeholder="Email *"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                />
                <input
                  className="input w-full"
                  type="tel"
                  placeholder="Telefono *"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Riceverai il risultato della tua analisi via email all'indirizzo indicato.
              </p>
              <button onClick={startQuiz} className="btn-primary w-full justify-center">
                Inizia il questionario →
              </button>
            </div>
          )}

          {step === "questions" && (
            <div className="space-y-5">
              <DialogTitle className="sr-only">Questionario</DialogTitle>
              {isLoading || !q ? (
                <p className="text-sm text-muted-foreground">Caricamento domande…</p>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Domanda {current + 1} di {total}</span>
                    <span>{contact.name.split(" ")[0]}</span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl text-foreground leading-snug">
                    {q.text}
                  </h3>
                  <div className="space-y-2">
                    {q.quiz_options.map((opt) => {
                      const active = selectedId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          disabled={submitting}
                          onClick={() => pickOption(opt.id, opt.profile_tag)}
                          className={`w-full text-left rounded-xl border px-4 py-3 transition-all hover:border-primary hover:bg-primary/5 disabled:opacity-60 ${
                            active ? "border-primary bg-primary/10" : "border-border bg-background"
                          }`}
                        >
                          <span className="text-sm text-foreground">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                  {current > 0 && (
                    <button
                      type="button"
                      onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      ← Domanda precedente
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {step === "done" && (
            <div className="space-y-5 text-center py-4">
              <DialogTitle className="font-display text-2xl sm:text-3xl text-foreground">
                Ottieni il tuo risultato
              </DialogTitle>
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="h-8 w-8 text-primary animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Grazie <span className="text-foreground font-medium">{contact.name.split(" ")[0]}</span>! 
                Stiamo elaborando la tua analisi personalizzata.<br />
                Il risultato completo sarà inviato a <span className="text-foreground font-medium">{contact.email}</span> entro pochi minuti.
              </p>
              {resultProfile && PROFILE_LABELS[resultProfile] && (
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-left">
                  <div className="text-xs uppercase tracking-wider text-primary mb-1">Anteprima profilo</div>
                  <div className="font-display text-lg text-foreground">{PROFILE_LABELS[resultProfile].name}</div>
                  <p className="text-xs text-muted-foreground mt-1">{PROFILE_LABELS[resultProfile].tagline}</p>
                </div>
              )}
              <button onClick={scrollToPlans} className="btn-primary w-full justify-center">
                Scegli il tuo piano →
              </button>
              <button onClick={close} className="text-xs text-muted-foreground hover:text-foreground">
                Chiudi
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

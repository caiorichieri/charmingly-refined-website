import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { QUIZ_OPEN_EVENT } from "./openQuiz";
import { toast } from "sonner";

type Option = { id: string; text: string; profile_tag: string; display_order: number };
type Question = {
  id: string;
  text: string;
  display_order: number;
  quiz_options: Option[];
};

type Step = "contact" | "questions" | "done";

const PROFILE_LABELS: Record<string, { name: string; tagline: string; description: string }> = {
  perfezionatore: {
    name: "Il Perfezionatore",
    tagline: "Standard altissimi, analisi continua, poca tregua interna.",
    description:
      "Funzioni grazie al controllo e alla precisione: l'errore ti resta dentro a lungo e nulla è mai abbastanza. Il percorso giusto ti aiuta ad alleggerire l'autocritica senza perdere il tuo rigore.",
  },
  anticipatore: {
    name: "L'Anticipatore",
    tagline: "Mente che corre avanti, scenari, ansia anticipatoria.",
    description:
      "Vivi la gara prima della gara: scenari, previsioni, piani B. La tua forza è la lettura del contesto; il limite è non riuscire a spegnere. Impariamo a riportarti nel presente.",
  },
  intenso: {
    name: "L'Intenso",
    tagline: "Adrenalina, picchi emotivi, reattività esplosiva.",
    description:
      "L'emozione è il tuo carburante: ti accende ma a volte ti travolge. Lavoriamo per trasformare l'intensità in energia funzionale, senza spegnere il fuoco che ti rende unico/a.",
  },
  confermatore: {
    name: "Il Confermatore",
    tagline: "Autostima legata al giudizio e al confronto.",
    description:
      "Hai bisogno di sentire che vali e cerchi conferme dagli altri. Costruiamo una base di fiducia interna che non dipenda dal risultato di ogni singola gara.",
  },
  percettivo: {
    name: "Il Percettivo",
    tagline: "Il corpo parla prima della testa: ipersensibilità ai segnali.",
    description:
      "Senti tutto, e lo senti per primo/a nel corpo. È una risorsa enorme ma ti espone al sovraccarico. Ti diamo strumenti per leggere i segnali senza esserne sopraffatto/a.",
  },
  recuperante: {
    name: "Il Recuperante",
    tagline: "Distacco, motivazione bassa, rischio burnout.",
    description:
      "Qualcosa si è spento: dentro c'è più stanchezza che desiderio. Non è debolezza, è un segnale. Il percorso parte dall'ascolto e dalla decompressione, non dalla performance.",
  },
};

const QUIZ_DEBUG_PREFIX = "[Quiz diagnostica]";

function maskEmail(email: string) {
  const [name, domain] = email.trim().toLowerCase().split("@");
  if (!name || !domain) return "email-non-valida";
  return `${name.slice(0, 2)}***@${domain}`;
}

function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length > 4 ? `***${digits.slice(-4)}` : "telefono-breve";
}

function makeQuizId() {
  return crypto?.randomUUID?.() ?? `quiz-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function quizLog(message: string, data?: Record<string, unknown>) {
  console.debug(QUIZ_DEBUG_PREFIX, message, data ?? {});
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type ProfileResult = {
  primary: string;
  secondary: string | null;
  counts: Record<string, number>;
  total: number;
};

function computeProfile(answers: Record<string, { optionId: string; tag: string }>): ProfileResult {
  const counts: Record<string, number> = {};
  Object.values(answers).forEach((a) => {
    counts[a.tag] = (counts[a.tag] ?? 0) + 1;
  });
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const primary = ranked[0]?.[0] ?? "perfezionatore";
  const primaryScore = ranked[0]?.[1] ?? 0;
  const secondary = ranked[1] && primaryScore - ranked[1][1] <= 2 ? ranked[1][0] : null;
  return { primary, secondary, counts, total: Object.keys(answers).length };
}

function formatSummary(result: ProfileResult): string {
  const labelOf = (k: string) => PROFILE_LABELS[k]?.name ?? k;
  const dist = Object.entries(result.counts)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${labelOf(k)} ${v}/${result.total}`)
    .join(" · ");
  const primary = `Prevalente: ${labelOf(result.primary)} ${result.counts[result.primary]}/${result.total}`;
  const secondary = result.secondary
    ? ` · Secondario: ${labelOf(result.secondary)} ${result.counts[result.secondary]}/${result.total}`
    : "";
  return `${primary}${secondary} · Distribuzione: ${dist}`;
}

export function QuizModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("contact");
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { optionId: string; tag: string }>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ProfileResult | null>(null);
  // Bumped on every open so options re-shuffle each time the quiz is opened
  const [shuffleSeed, setShuffleSeed] = useState(0);

  useEffect(() => {
    const handler = () => {
      setOpen(true);
      setStep("contact");
      setCurrent(0);
      setAnswers({});
      setResult(null);
      setShuffleSeed((s) => s + 1);
    };
    window.addEventListener(QUIZ_OPEN_EVENT, handler);
    return () => window.removeEventListener(QUIZ_OPEN_EVENT, handler);
  }, []);

  const { data: rawQuestions, isLoading } = useQuery({
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

  // Shuffle options independently per question, re-shuffled each time the modal opens.
  const questions = useMemo<Question[] | undefined>(() => {
    if (!rawQuestions) return rawQuestions;
    return rawQuestions.map((q) => ({ ...q, quiz_options: shuffle(q.quiz_options) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawQuestions, shuffleSeed]);

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

    quizLog("Risposta selezionata", {
      questionIndex: current + 1,
      totalQuestions: questions.length,
      questionId: q.id,
      optionId,
      profileTag: tag,
    });

    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
      return;
    }
    // finalize
    setSubmitting(true);
    try {
      const computed = computeProfile(newAnswers);
      const summary = formatSummary(computed);
      quizLog("Profilo calcolato", { ...computed, summary });

      const leadId = makeQuizId();
      const leadPayload = {
        id: leadId,
        name: contact.name.trim(),
        email: contact.email.trim().toLowerCase(),
        phone: contact.phone.trim(),
        result_summary: summary,
      };

      const { error: leadErr } = await supabase.from("quiz_leads").insert(leadPayload);
      if (leadErr) {
        console.error(QUIZ_DEBUG_PREFIX, "Errore salvataggio lead", leadErr);
        throw leadErr;
      }

      const rows = Object.entries(newAnswers).map(([questionId, a]) => ({
        lead_id: leadId,
        question_id: questionId,
        option_id: a.optionId,
      }));
      const { error: respErr } = await supabase.from("quiz_responses").insert(rows);
      if (respErr) {
        console.error(QUIZ_DEBUG_PREFIX, "Errore salvataggio risposte", respErr);
        throw respErr;
      }

      // best-effort email (server function may not exist yet)
      try {
        const primaryProfile = PROFILE_LABELS[computed.primary];
        const secondaryProfile = computed.secondary ? PROFILE_LABELS[computed.secondary] : null;
        await fetch("/lovable/email/transactional/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateName: "quiz-result",
            recipientEmail: contact.email.trim().toLowerCase(),
            idempotencyKey: `quiz-${leadId}`,
            templateData: {
              name: contact.name.trim(),
              profile: primaryProfile?.name,
              tagline: primaryProfile?.tagline,
              description: primaryProfile?.description,
              secondaryProfile: secondaryProfile?.name ?? null,
              secondaryDescription: secondaryProfile?.description ?? null,
            },
          }),
        });
      } catch (emailError) {
        console.warn(QUIZ_DEBUG_PREFIX, "Email non inviata, il quiz resta valido", {
          leadId,
          email: maskEmail(contact.email),
          phone: maskPhone(contact.phone),
          emailError,
        });
      }

      setResult(computed);
      setStep("done");
    } catch (e: any) {
      console.error(QUIZ_DEBUG_PREFIX, "Finalizzazione quiz fallita", e);
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

  const primaryProfile = result ? PROFILE_LABELS[result.primary] : null;
  const secondaryProfile = result?.secondary ? PROFILE_LABELS[result.secondary] : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl border-border bg-card p-0 sm:rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* progress bar */}
        <div className="h-1 w-full bg-muted sticky top-0 z-10">
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
                  Rispondi a {total || "12"} brevi domande e scopri il tuo profilo mentale tra i 6 tipi del Profiler MeMindSport. Inizia con i tuoi dati di contatto.
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

          {step === "done" && result && primaryProfile && (
            <div className="space-y-5 py-2">
              <div className="text-center">
                <div className="text-xs uppercase tracking-wider text-primary mb-2">Il tuo profilo</div>
                <DialogTitle className="font-display text-3xl text-foreground">
                  {primaryProfile.name}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-2 italic">{primaryProfile.tagline}</p>
              </div>

              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <p className="text-sm text-foreground leading-relaxed">{primaryProfile.description}</p>
                <div className="mt-3 text-xs text-muted-foreground">
                  Punteggio: <span className="font-medium text-foreground">{result.counts[result.primary]}/{result.total}</span>
                </div>
              </div>

              {secondaryProfile && (
                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Profilo secondario</div>
                  <div className="font-display text-lg text-foreground">{secondaryProfile.name}</div>
                  <p className="text-xs text-muted-foreground mt-1">{secondaryProfile.description}</p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Punteggio: <span className="font-medium text-foreground">{result.counts[result.secondary!]}/{result.total}</span>
                  </div>
                </div>
              )}

              <p className="text-xs text-muted-foreground text-center">
                Una copia di questa analisi sarà inviata a <span className="text-foreground font-medium">{contact.email}</span>.
              </p>

              <div className="flex flex-col gap-2">
                <button onClick={scrollToPlans} className="btn-primary w-full justify-center">
                  Scopri il percorso giusto per te →
                </button>
                <button onClick={close} className="text-xs text-muted-foreground hover:text-foreground">
                  Chiudi
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { QUIZ_OPEN_EVENT } from "./openQuiz";
import { toast } from "sonner";
import {
  PROFILE_COLORS,
  PROFILE_LABELS,
  TYPE_COORDS,
  ZONES,
  FRASE_MAPPA,
  buildInsight,
  buildTags,
  computeProfile,
  formatSummary,
  type ProfileResult,
} from "@/lib/quiz-profile";
import { MappaDelCampo } from "./MappaDelCampo";
import { RagnatelaProfilo } from "./RagnatelaProfilo";
import quizGrazieImg from "@/assets/quiz-grazie.jpg";

type Option = { id: string; text: string; profile_tag: string; display_order: number };
type Question = {
  id: string;
  text: string;
  display_order: number;
  quiz_options: Option[];
};

type Step = "contact" | "questions" | "transition" | "mappa" | "ragnatela" | "tags" | "grazie";


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
function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "•";
}

export function QuizModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("contact");
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [consent, setConsent] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { optionId: string; tag: string }>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ProfileResult | null>(null);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  useEffect(() => {
    const handler = () => {
      setOpen(true);
      setStep("contact");
      setCurrent(0);
      setAnswers({});
      setResult(null);
      setConsent(false);
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

  const questions = useMemo<Question[] | undefined>(() => {
    if (!rawQuestions) return rawQuestions;
    return rawQuestions.map((q) => ({ ...q, quiz_options: shuffle(q.quiz_options) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawQuestions, shuffleSeed]);

  const total = questions?.length ?? 0;
  const progress =
    step === "contact" ? 0 :
    step === "questions" ? Math.round(((current + 1) / Math.max(total, 1)) * 90) :
    100;

  // Auto-advance transition → mappa
  useEffect(() => {
    if (step !== "transition") return;
    const t = setTimeout(() => setStep("mappa"), 2400);
    return () => clearTimeout(t);
  }, [step]);

  function validateContact() {
    if (!contact.name.trim()) return "Inserisci il tuo nome";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) return "Email non valida";
    if (!/^[\d+\s()-]{6,}$/.test(contact.phone)) return "Telefono non valido";
    if (!consent) return "Devi accettare l'informativa sulla privacy per continuare";
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
        const insight = buildInsight(computed);
        const tags = buildTags(computed);
        await fetch("/lovable/email/transactional/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateName: "quiz-result",
            recipientEmail: contact.email.trim().toLowerCase(),
            idempotencyKey: `quiz-${leadId}`,
            templateData: {
              name: contact.name.trim(),
              profile: PROFILE_LABELS[computed.primary].name,
              fraseMappa: FRASE_MAPPA[computed.primary],
              insight,
              tagForza: tags.forza,
              tagLavoro: tags.lavoro,
              secondaryProfile: computed.secondary ? PROFILE_LABELS[computed.secondary].name : null,
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
      setStep("transition");
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

  const primaryLabel = result ? PROFILE_LABELS[result.primary] : null;
  const secondaryLabel = result?.secondary ? PROFILE_LABELS[result.secondary] : null;
  const primaryColor = result ? PROFILE_COLORS[result.primary] : "#000";
  const tags = result ? buildTags(result) : { forza: [], lavoro: [] };
  const insight = result ? buildInsight(result) : "";
  const fraseMappa = result ? FRASE_MAPPA[result.primary] : "";
  const zoneInfo = result ? ZONES[TYPE_COORDS[result.primary].zone] : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl border-border bg-card p-0 sm:rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
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
                  maxLength={120}
                />
                <input
                  className="input w-full"
                  type="email"
                  placeholder="Email *"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  maxLength={200}
                />
                <input
                  className="input w-full"
                  type="tel"
                  placeholder="Telefono *"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  maxLength={40}
                />
              </div>

              <label className="flex items-start gap-3 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  Acconsento al trattamento dei miei dati personali (nome, email, telefono e risposte al questionario) ai fini della elaborazione del mio profilo psicologico-sportivo e della ricezione del risultato via email, ai sensi del Reg. UE 2016/679 (GDPR). I dati non saranno ceduti a terzi e potrò richiederne in qualsiasi momento la cancellazione scrivendo a <span className="text-foreground font-medium">info@memindsport.it</span>. *
                </span>
              </label>

              <button onClick={startQuiz} className="btn-primary w-full justify-center" disabled={!consent}>
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

          {step === "transition" && (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <DialogTitle className="sr-only">Elaborazione profilo</DialogTitle>
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 rounded-full border-2 border-primary/30" />
                <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
              <p className="font-display text-xl text-foreground">Stiamo costruendo il tuo profilo.</p>
              <p className="text-sm text-muted-foreground italic">Ogni risposta ha detto qualcosa di te.</p>
            </div>
          )}

          {step === "mappa" && result && primaryLabel && zoneInfo && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="text-xs uppercase tracking-wider text-primary mb-1">Atto 1 — La mappa del campo</div>
                <DialogTitle className="font-display text-2xl text-foreground">
                  {zoneInfo.name}
                </DialogTitle>
              </div>

              <MappaDelCampo result={result} pinLabel="TU" />

              <div
                className="rounded-xl border p-4"
                style={{ borderColor: `${primaryColor}55`, background: `${primaryColor}11` }}
              >
                <p className="text-sm text-foreground leading-relaxed">{fraseMappa}</p>
              </div>

              <button
                onClick={() => setStep("ragnatela")}
                className="btn-primary w-full justify-center sticky bottom-0"
              >
                Scopri la tua forma · Atto 2 →
              </button>

            </div>
          )}

          {step === "ragnatela" && result && primaryLabel && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="text-xs uppercase tracking-wider text-primary mb-1">Atto 2 — La tua forma</div>
                <DialogTitle className="font-display text-2xl text-foreground">
                  {primaryLabel.name}
                  {secondaryLabel && (
                    <span className="text-base text-muted-foreground font-normal">
                      {" "}× {secondaryLabel.name}
                    </span>
                  )}
                </DialogTitle>
              </div>

              <RagnatelaProfilo result={result} />

              <div className="flex flex-wrap justify-center gap-2 text-xs">
                {(Object.keys(PROFILE_LABELS) as Array<keyof typeof PROFILE_LABELS>)
                  .sort((a, b) => (result.counts[b] ?? 0) - (result.counts[a] ?? 0))
                  .slice(0, 3)
                  .map((k) => (
                    <span
                      key={k}
                      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1"
                      style={{ borderColor: `${PROFILE_COLORS[k]}66`, color: PROFILE_COLORS[k] }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: PROFILE_COLORS[k] }} />
                      {PROFILE_LABELS[k].short} · {result.counts[k] ?? 0}/{result.total}
                    </span>
                  ))}
              </div>

              <div
                className="rounded-xl border p-4"
                style={{ borderColor: `${primaryColor}55`, background: `${primaryColor}11` }}
              >
                <p className="text-sm text-foreground leading-relaxed">{insight}</p>
              </div>

              <button
                onClick={() => setStep("tags")}
                className="btn-primary w-full justify-center"
              >
                Continua →
              </button>
            </div>
          )}

          {step === "tags" && result && primaryLabel && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="text-xs uppercase tracking-wider text-primary mb-1">Il tuo profilo in sintesi</div>
                <DialogTitle className="font-display text-2xl text-foreground">
                  Ecco cosa porti e cosa il percorso costruirà
                </DialogTitle>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Punti di forza — ciò che porti già
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.forza.map((t) => (
                      <span
                        key={t}
                        className="rounded-full px-3 py-1.5 text-xs font-medium"
                        style={{ background: `${primaryColor}1F`, color: primaryColor, border: `1px solid ${primaryColor}55` }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Aree di lavoro — ciò su cui il percorso costruirà
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.lavoro.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Una copia di questa analisi sarà inviata a <span className="text-foreground font-medium">{contact.email}</span> non appena il sistema email sarà attivo.
              </p>

              <div className="flex flex-col gap-2">
                <button onClick={() => setStep("grazie")} className="btn-primary w-full justify-center">
                  Continua →
                </button>
              </div>
            </div>
          )}

          {step === "grazie" && (
            <div className="space-y-6 text-center">
              <DialogTitle className="sr-only">Grazie</DialogTitle>
              <div className="relative -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 overflow-hidden">
                <img
                  src={quizGrazieImg}
                  alt="Atleta che taglia il traguardo all'alba"
                  width={1280}
                  height={768}
                  loading="lazy"
                  className="w-full h-48 sm:h-56 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
              </div>

              <div className="space-y-3">
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
                  Grazie per aver risposto<br />alle domande!
                </h2>
                <p className="text-base text-foreground/80">
                  Abbiamo inviato il tuo report a{" "}
                  <span className="text-foreground font-semibold">{contact.email}</span>.
                  Controlla la tua casella (anche lo spam).
                </p>
              </div>

              <p className="text-[11px] leading-relaxed text-muted-foreground px-2">
                Il risultato non costituisce una diagnosi clinica né una valutazione psicologica
                professionale. Si tratta di un'analisi orientativa basata sulle informazioni
                raccolte dalle tue risposte, utile a tracciare il tuo profilo sportivo e a
                suggerire aree di lavoro mentale.
              </p>

              <div className="flex flex-col gap-2">
                <button onClick={scrollToPlans} className="btn-primary w-full justify-center text-base py-3">
                  Scarica l'app adesso ↓
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

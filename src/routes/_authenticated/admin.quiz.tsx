import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, ChevronDown, ChevronUp, Save, Mail, Phone, User, Eye, Send, Pencil, X, Check } from "lucide-react";
import { computeProfile, PROFILE_LABELS } from "@/lib/quiz-profile";
import { buildReportHTML } from "@/lib/quiz-report-html";


export const Route = createFileRoute("/_authenticated/admin/quiz")({
  component: AdminQuiz,
});

const PROFILE_TAGS = [
  { value: "perfezionatore", label: "Il Perfezionatore" },
  { value: "anticipatore", label: "L'Anticipatore" },
  { value: "intenso", label: "L'Intenso" },
  { value: "confermatore", label: "Il Confermatore" },
  { value: "percettivo", label: "Il Percettivo" },
  { value: "recuperante", label: "Il Recuperante" },
];

type Option = {
  id: string;
  question_id: string;
  text: string;
  profile_tag: string;
  display_order: number;
};
type Question = {
  id: string;
  text: string;
  display_order: number;
  published: boolean;
  quiz_options: Option[];
};

function AdminQuiz() {
  const [tab, setTab] = useState<"questions" | "leads">("questions");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold">Quiz "Che tipo di atleta sei?"</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gestisci le domande del questionario e visualizza i lead raccolti.
        </p>
      </div>
      <div className="flex gap-2 border-b border-line">
        <button
          onClick={() => setTab("questions")}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            tab === "questions" ? "border-brand-green text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Domande & opzioni
        </button>
        <button
          onClick={() => setTab("leads")}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            tab === "leads" ? "border-brand-green text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Lead raccolti
        </button>
      </div>
      {tab === "questions" ? <QuestionsTab /> : <LeadsTab />}
    </div>
  );
}

function QuestionsTab() {
  const qc = useQueryClient();
  const { data: questions, isLoading } = useQuery({
    queryKey: ["admin-quiz-questions"],
    queryFn: async (): Promise<Question[]> => {
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("id, text, display_order, published, quiz_options(id, question_id, text, profile_tag, display_order)")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((q: any) => ({
        ...q,
        quiz_options: (q.quiz_options ?? []).sort((a: any, b: any) => a.display_order - b.display_order),
      }));
    },
  });

  const addQuestion = useMutation({
    mutationFn: async () => {
      const maxOrder = Math.max(0, ...(questions ?? []).map((q) => q.display_order));
      const { data: newQ, error } = await supabase
        .from("quiz_questions")
        .insert({ text: "Nuova domanda", display_order: maxOrder + 1 })
        .select("id")
        .single();
      if (error) throw error;
      // 6 opzioni di default, una per ogni Athlete Type
      const opts = [
        { question_id: newQ.id, text: "Opzione Perfezionatore", profile_tag: "perfezionatore", display_order: 1 },
        { question_id: newQ.id, text: "Opzione Anticipatore", profile_tag: "anticipatore", display_order: 2 },
        { question_id: newQ.id, text: "Opzione Intenso", profile_tag: "intenso", display_order: 3 },
        { question_id: newQ.id, text: "Opzione Confermatore", profile_tag: "confermatore", display_order: 4 },
        { question_id: newQ.id, text: "Opzione Percettivo", profile_tag: "percettivo", display_order: 5 },
        { question_id: newQ.id, text: "Opzione Recuperante", profile_tag: "recuperante", display_order: 6 },
      ];
      await supabase.from("quiz_options").insert(opts);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-quiz-questions"] });
      toast.success("Domanda creata");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {questions?.length ?? 0} domande totali · vengono mostrate tutte quelle pubblicate (consigliate 5-10)
        </div>
        <button onClick={() => addQuestion.mutate()} className="btn-primary text-sm py-2 px-4">
          <Plus size={14} /> Nuova domanda
        </button>
      </div>
      {isLoading && <div className="text-sm text-muted-foreground">Caricamento…</div>}
      <div className="space-y-3">
        {questions?.map((q, idx) => (
          <QuestionCard key={q.id} q={q} index={idx} />
        ))}
      </div>
    </div>
  );
}

function QuestionCard({ q, index }: { q: Question; index: number }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(q.text);
  const [published, setPublished] = useState(q.published);
  const [order, setOrder] = useState(q.display_order);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("quiz_questions")
        .update({ text, published, display_order: order })
        .eq("id", q.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-quiz-questions"] });
      toast.success("Salvato");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("quiz_questions").delete().eq("id", q.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-quiz-questions"] });
      toast.success("Domanda eliminata");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="bg-white border border-line rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <button onClick={() => setOpen(!open)} className="text-muted-foreground hover:text-foreground">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        <span className="text-xs text-muted-foreground font-mono w-8">#{index + 1}</span>
        <input className="input flex-1" value={text} onChange={(e) => setText(e.target.value)} />
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          Pubblicata
        </label>
        <input
          type="number"
          className="input w-20"
          value={order}
          onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
          title="Ordine"
        />
        <button onClick={() => save.mutate()} className="btn-primary text-xs py-2 px-3">
          <Save size={12} /> Salva
        </button>
        <button
          onClick={() => {
            if (confirm(`Eliminare la domanda "${text}"?`)) del.mutate();
          }}
          className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
        >
          <Trash2 size={14} />
        </button>
      </div>
      {open && (
        <div className="border-t border-line bg-off p-4">
          <OptionsList question={q} />
        </div>
      )}
    </div>
  );
}

function OptionsList({ question }: { question: Question }) {
  const qc = useQueryClient();

  const addOption = useMutation({
    mutationFn: async () => {
      const maxOrder = Math.max(0, ...question.quiz_options.map((o) => o.display_order));
      const { error } = await supabase.from("quiz_options").insert({
        question_id: question.id,
        text: "Nuova opzione",
        profile_tag: "equilibrato",
        display_order: maxOrder + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-quiz-questions"] }),
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Opzioni di risposta</div>
      {question.quiz_options.map((opt) => (
        <OptionRow key={opt.id} opt={opt} />
      ))}
      <button onClick={() => addOption.mutate()} className="text-xs text-brand-green hover:underline flex items-center gap-1">
        <Plus size={12} /> Aggiungi opzione
      </button>
    </div>
  );
}

function OptionRow({ opt }: { opt: Option }) {
  const qc = useQueryClient();
  const [text, setText] = useState(opt.text);
  const [tag, setTag] = useState(opt.profile_tag);
  const [order, setOrder] = useState(opt.display_order);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("quiz_options")
        .update({ text, profile_tag: tag, display_order: order })
        .eq("id", opt.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-quiz-questions"] });
      toast.success("Opzione salvata");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("quiz_options").delete().eq("id", opt.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-quiz-questions"] });
      toast.success("Eliminata");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="flex items-center gap-2 bg-white border border-line rounded-lg p-2">
      <input
        type="number"
        className="input w-14 text-xs"
        value={order}
        onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
      />
      <input className="input flex-1" value={text} onChange={(e) => setText(e.target.value)} />
      <select className="input w-36" value={tag} onChange={(e) => setTag(e.target.value)}>
        {PROFILE_TAGS.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
      <button onClick={() => save.mutate()} className="btn-primary text-xs py-1.5 px-2">
        <Save size={12} />
      </button>
      <button
        onClick={() => {
          if (confirm("Eliminare l'opzione?")) del.mutate();
        }}
        className="text-red-600 hover:bg-red-50 p-1.5 rounded"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}

function LeadsTab() {
  const { data: leads, isLoading } = useQuery({
    queryKey: ["admin-quiz-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_leads")
        .select("id, name, email, phone, result_summary, email_sent, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="text-sm text-muted-foreground">Caricamento…</div>;
  if (!leads?.length)
    return (
      <div className="bg-white border border-line rounded-xl p-12 text-center text-muted-foreground">
        Nessun lead ancora. Appariranno qui non appena qualcuno completa il questionario.
      </div>
    );

  return (
    <div className="bg-white border border-line rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-off text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="text-left p-3">Data</th>
            <th className="text-left p-3">Contatto</th>
            <th className="text-left p-3">Risultato</th>
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Report</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <LeadRow key={l.id} lead={l} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

type LeadRowData = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  result_summary: string | null;
  email_sent: boolean;
  created_at: string;
};

function LeadRow({ lead }: { lead: LeadRowData }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [emailDraft, setEmailDraft] = useState(lead.email);

  const saveEmail = useMutation({
    mutationFn: async () => {
      const next = emailDraft.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next)) {
        throw new Error("Email non valida");
      }
      const { error } = await supabase
        .from("quiz_leads")
        .update({ email: next, email_sent: false })
        .eq("id", lead.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-quiz-leads"] });
      toast.success("Email aggiornata");
      setEditing(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <tr className="border-t border-line align-top">
      <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
        {new Date(lead.created_at).toLocaleString("it-IT")}
      </td>
      <td className="p-3 min-w-[260px]">
        <div className="font-medium flex items-center gap-1.5">
          <User size={12} /> {lead.name}
        </div>
        {editing ? (
          <div className="flex items-center gap-1 mt-1">
            <Mail size={11} className="text-muted-foreground" />
            <input
              type="email"
              className="input text-xs flex-1 py-1"
              value={emailDraft}
              onChange={(e) => setEmailDraft(e.target.value)}
              autoFocus
            />
            <button
              onClick={() => saveEmail.mutate()}
              disabled={saveEmail.isPending}
              className="p-1 rounded text-green-700 hover:bg-green-50"
              title="Salva"
            >
              <Check size={14} />
            </button>
            <button
              onClick={() => {
                setEmailDraft(lead.email);
                setEditing(false);
              }}
              className="p-1 rounded text-muted-foreground hover:bg-off"
              title="Annulla"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
            <Mail size={11} /> {lead.email}
            <button
              onClick={() => setEditing(true)}
              className="p-0.5 rounded hover:bg-off text-muted-foreground hover:text-foreground"
              title="Modifica email"
            >
              <Pencil size={11} />
            </button>
          </div>
        )}
        <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
          <Phone size={11} /> {lead.phone}
        </div>
      </td>
      <td className="p-3 text-xs">{lead.result_summary ?? "—"}</td>
      <td className="p-3">
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            lead.email_sent ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
          }`}
        >
          {lead.email_sent ? "Inviata" : "Non inviata"}
        </span>
      </td>
      <td className="p-3">
        <div className="flex flex-col gap-1.5">
          <PreviewReportButton leadId={lead.id} name={lead.name} email={lead.email} phone={lead.phone} />
          <SendReportButton
            leadId={lead.id}
            name={lead.name}
            email={lead.email}
            phone={lead.phone}
            alreadySent={lead.email_sent}
          />
        </div>
      </td>
    </tr>
  );
}

async function buildReportForLead(leadId: string, name: string, email: string, phone: string | null) {
  const { data: responses, error } = await supabase
    .from("quiz_responses")
    .select("question_id, option_id, quiz_options(profile_tag)")
    .eq("lead_id", leadId);
  if (error) throw error;
  if (!responses?.length) throw new Error("Nessuna risposta salvata per questo lead");
  const answers: Record<string, { optionId: string; tag: string }> = {};
  for (const r of responses as any[]) {
    const tag = r.quiz_options?.profile_tag;
    if (!tag) continue;
    answers[r.question_id] = { optionId: r.option_id, tag };
  }
  const profile = computeProfile(answers);
  const html = buildReportHTML(profile, { name, email, phone });
  return { profile, html };
}

function PreviewReportButton({
  leadId, name, email, phone,
}: { leadId: string; name: string; email: string; phone: string | null }) {
  const [loading, setLoading] = useState(false);

  async function openPreview() {
    setLoading(true);
    try {
      const { html } = await buildReportForLead(leadId, name, email, phone);
      const win = window.open("", "_blank");
      if (!win) {
        toast.error("Blocco popup attivo. Permetti i popup per vedere l'anteprima.");
        return;
      }
      win.document.open();
      win.document.write(html);
      win.document.close();
    } catch (e: any) {
      console.error(e);
      toast.error(e.message ?? "Errore nel generare il report");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={openPreview}
      disabled={loading}
      className="text-xs px-2.5 py-1.5 rounded-lg border border-line bg-white hover:bg-off inline-flex items-center gap-1.5 disabled:opacity-50"
      title="Anteprima del report come arriverà via email"
    >
      <Eye size={12} /> {loading ? "…" : "Anteprima"}
    </button>
  );
}

function SendReportButton({
  leadId, name, email, phone, alreadySent,
}: { leadId: string; name: string; email: string; phone: string | null; alreadySent: boolean }) {
  const qc = useQueryClient();
  const [loading, setLoading] = useState(false);

  async function send() {
    const recipient = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
      toast.error("L'email del lead non è valida. Modificala prima di inviare.");
      return;
    }
    if (!confirm(`Inviare il report a ${recipient}?`)) return;
    setLoading(true);
    try {
      const { profile, html } = await buildReportForLead(leadId, name, recipient, phone);
      const subject = `Il tuo profilo MeMindSport: ${PROFILE_LABELS[profile.primary].name}`;
      const { data, error } = await supabase.functions.invoke("send-smtp-email", {
        body: { to: recipient, subject, html },
      });
      if (error) throw error;
      if (data && (data as any).error) throw new Error((data as any).error);
      await supabase.from("quiz_leads").update({ email_sent: true }).eq("id", leadId);
      qc.invalidateQueries({ queryKey: ["admin-quiz-leads"] });
      toast.success(`Report inviato a ${recipient}`);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message ?? "Invio fallito");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={send}
      disabled={loading}
      className="text-xs px-2.5 py-1.5 rounded-lg bg-brand-green text-white hover:opacity-90 inline-flex items-center gap-1.5 disabled:opacity-50"
      title={alreadySent ? "Reinvia il report" : "Invia il report via email"}
    >
      <Send size={12} /> {loading ? "Invio…" : alreadySent ? "Reinvia" : "Invia email"}
    </button>
  );
}

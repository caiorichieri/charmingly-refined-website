import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, ChevronDown, ChevronUp, Save, Mail, Phone, User } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/quiz")({
  component: AdminQuiz,
});

const PROFILE_TAGS = [
  { value: "fragile", label: "Sensibile" },
  { value: "guerriero", label: "Guerriero" },
  { value: "metodico", label: "Metodico" },
  { value: "libero", label: "Libero" },
  { value: "equilibrato", label: "Equilibrato" },
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
      // 4 opzioni di default
      const opts = [
        { question_id: newQ.id, text: "Opzione 1", profile_tag: "fragile", display_order: 1 },
        { question_id: newQ.id, text: "Opzione 2", profile_tag: "guerriero", display_order: 2 },
        { question_id: newQ.id, text: "Opzione 3", profile_tag: "metodico", display_order: 3 },
        { question_id: newQ.id, text: "Opzione 4", profile_tag: "libero", display_order: 4 },
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
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id} className="border-t border-line">
              <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                {new Date(l.created_at).toLocaleString("it-IT")}
              </td>
              <td className="p-3">
                <div className="font-medium flex items-center gap-1.5">
                  <User size={12} /> {l.name}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Mail size={11} /> {l.email}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Phone size={11} /> {l.phone}
                </div>
              </td>
              <td className="p-3 text-xs">{l.result_summary ?? "—"}</td>
              <td className="p-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    l.email_sent ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {l.email_sent ? "Inviata" : "In coda"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

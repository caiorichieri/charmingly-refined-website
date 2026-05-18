import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/faqs")({
  component: FaqAdmin,
});

type F = { id: string; question: string; answer: string; display_order: number; published: boolean };
const empty = (): Partial<F> => ({ question: "", answer: "", display_order: 0, published: true });

function FaqAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<F> | null>(null);

  const { data: rows = [] } = useQuery({
    queryKey: ["admin", "faqs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("faqs").select("*").order("display_order");
      if (error) throw error;
      return data as F[];
    },
  });

  const save = useMutation({
    mutationFn: async (p: Partial<F>) => {
      const { id, ...rest } = p;
      if (id) {
        const { error } = await supabase.from("faqs").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("faqs").insert(rest as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Salvato");
      qc.invalidateQueries({ queryKey: ["admin", "faqs"] });
      qc.invalidateQueries({ queryKey: ["public", "faqs"] });
      setEditing(null);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Errore"),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("faqs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "faqs"] });
      qc.invalidateQueries({ queryKey: ["public", "faqs"] });
      toast.success("Eliminato");
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink">FAQ</h1>
          <p className="text-muted-foreground mt-1">Domande frequenti mostrate nella sezione FAQ.</p>
        </div>
        <button onClick={() => setEditing(empty())} className="inline-flex items-center gap-2 bg-brand-green text-white font-bold rounded-full px-5 py-2.5 hover:brightness-110">
          <Plus size={16} /> Nuova FAQ
        </button>
      </div>

      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-off text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4 w-16">#</th>
              <th className="p-4">Domanda</th>
              <th className="p-4">Pubblicata</th>
              <th className="p-4 w-32"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((f) => (
              <tr key={f.id} className="border-t border-line">
                <td className="p-4 text-muted-foreground">{f.display_order}</td>
                <td className="p-4 font-medium">{f.question}</td>
                <td className="p-4">{f.published ? "Sì" : "No"}</td>
                <td className="p-4">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => setEditing(f)} className="p-2 hover:bg-off rounded"><Pencil size={14} /></button>
                    <button onClick={() => confirm("Eliminare?") && del.mutate(f.id)} className="p-2 hover:bg-off rounded text-red-600"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Nessuna FAQ.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && <FaqForm row={editing} onClose={() => setEditing(null)} onSave={(p) => save.mutate(p)} />}
    </div>
  );
}

function FaqForm({ row, onClose, onSave }: { row: Partial<F>; onClose: () => void; onSave: (p: Partial<F>) => void }) {
  const [f, setF] = useState(row);
  const set = <K extends keyof F>(k: K, v: F[K]) => setF((x) => ({ ...x, [k]: v }));
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-line">
          <h2 className="font-display text-xl font-bold">{row.id ? "Modifica FAQ" : "Nuova FAQ"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-off rounded"><X size={18} /></button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <L label="Domanda"><input className="input" value={f.question ?? ""} onChange={(e) => set("question", e.target.value)} /></L>
          <L label="Risposta"><textarea className="input" rows={6} value={f.answer ?? ""} onChange={(e) => set("answer", e.target.value)} /></L>
          <L label="Ordine"><input type="number" className="input" value={f.display_order ?? 0} onChange={(e) => set("display_order", Number(e.target.value))} /></L>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.published ?? true} onChange={(e) => set("published", e.target.checked)} /> Pubblicata</label>
        </div>
        <div className="p-6 border-t border-line flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium hover:bg-off rounded-lg">Annulla</button>
          <button onClick={() => onSave(f)} className="inline-flex items-center gap-2 bg-brand-green text-white font-bold rounded-full px-5 py-2.5 hover:brightness-110"><Save size={14} /> Salva</button>
        </div>
      </div>
    </div>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold text-foreground/80">{label}</span>{children}</label>;
}

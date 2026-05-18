import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Save, X, Star } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/plans")({
  component: PlansAdmin,
});

type Plan = {
  id: string;
  label: string;
  amount: string;
  amount_accent: string | null;
  detail: string;
  description: string;
  is_featured: boolean;
  is_deductible: boolean;
  display_order: number;
  published: boolean;
};

const empty = (): Partial<Plan> => ({ label: "", amount: "€", amount_accent: null, detail: "", description: "", is_featured: false, is_deductible: false, display_order: 0, published: true });

function PlansAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Plan> | null>(null);

  const { data: plans = [] } = useQuery({
    queryKey: ["admin", "plans"],
    queryFn: async () => {
      const { data, error } = await supabase.from("plans").select("*").order("display_order");
      if (error) throw error;
      return data as Plan[];
    },
  });

  const save = useMutation({
    mutationFn: async (p: Partial<Plan>) => {
      const { id, ...rest } = p;
      if (id) {
        const { error } = await supabase.from("plans").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("plans").insert(rest as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Salvato");
      qc.invalidateQueries({ queryKey: ["admin", "plans"] });
      qc.invalidateQueries({ queryKey: ["public", "plans"] });
      setEditing(null);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Errore"),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("plans").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "plans"] });
      qc.invalidateQueries({ queryKey: ["public", "plans"] });
      toast.success("Eliminato");
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink">Piani & prezzi</h1>
          <p className="text-muted-foreground mt-1">Gestisci tutti i piani mostrati sul sito.</p>
        </div>
        <button onClick={() => setEditing(empty())} className="inline-flex items-center gap-2 bg-brand-green text-white font-bold rounded-full px-5 py-2.5 hover:brightness-110">
          <Plus size={16} /> Nuovo piano
        </button>
      </div>

      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-off text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4">Nome</th>
              <th className="p-4">Prezzo</th>
              <th className="p-4">Badge</th>
              <th className="p-4 w-32"></th>
            </tr>
          </thead>
          <tbody>
            {plans.map((p) => (
              <tr key={p.id} className="border-t border-line">
                <td className="p-4 font-medium">{p.label}</td>
                <td className="p-4">{p.amount}{p.amount_accent}</td>
                <td className="p-4">
                  {p.is_featured && <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-green"><Star size={12} /> Più scelto</span>}
                </td>
                <td className="p-4">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => setEditing(p)} className="p-2 hover:bg-off rounded"><Pencil size={14} /></button>
                    <button onClick={() => confirm("Eliminare?") && del.mutate(p.id)} className="p-2 hover:bg-off rounded text-red-600"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {plans.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Nessun piano.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && <PlanForm plan={editing} onClose={() => setEditing(null)} onSave={(p) => save.mutate(p)} />}
    </div>
  );
}

function PlanForm({ plan, onClose, onSave }: { plan: Partial<Plan>; onClose: () => void; onSave: (p: Partial<Plan>) => void }) {
  const [f, setF] = useState(plan);
  const set = <K extends keyof Plan>(k: K, v: Plan[K]) => setF((x) => ({ ...x, [k]: v }));
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-line">
          <h2 className="font-display text-xl font-bold">{plan.id ? "Modifica piano" : "Nuovo piano"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-off rounded"><X size={18} /></button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <L label="Nome (etichetta)"><input className="input" value={f.label ?? ""} onChange={(e) => set("label", e.target.value)} /></L>
          <div className="grid grid-cols-2 gap-4">
            <L label="Prezzo"><input className="input" value={f.amount ?? ""} onChange={(e) => set("amount", e.target.value)} placeholder="€65 o Su misura" /></L>
            <L label="Accento (es. 29 dopo €)"><input className="input" value={f.amount_accent ?? ""} onChange={(e) => set("amount_accent", e.target.value || null)} /></L>
          </div>
          <L label="Dettaglio (sotto prezzo)"><input className="input" value={f.detail ?? ""} onChange={(e) => set("detail", e.target.value)} /></L>
          <L label="Descrizione"><textarea className="input" rows={3} value={f.description ?? ""} onChange={(e) => set("description", e.target.value)} /></L>
          <L label="Ordine"><input type="number" className="input" value={f.display_order ?? 0} onChange={(e) => set("display_order", Number(e.target.value))} /></L>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.is_featured ?? false} onChange={(e) => set("is_featured", e.target.checked)} /> Badge "Più scelto"</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.is_deductible ?? false} onChange={(e) => set("is_deductible", e.target.checked)} /> Detraibile 19%</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.published ?? true} onChange={(e) => set("published", e.target.checked)} /> Pubblicato</label>
          </div>
        </div>
        <div className="p-6 border-t border-line flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium hover:bg-off rounded-lg">Annulla</button>
          <button onClick={() => onSave(f)} className="inline-flex items-center gap-2 bg-brand-green text-white font-bold rounded-full px-5 py-2.5 hover:brightness-110">
            <Save size={14} /> Salva
          </button>
        </div>
      </div>
    </div>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold text-foreground/80">{label}</span>{children}</label>;
}

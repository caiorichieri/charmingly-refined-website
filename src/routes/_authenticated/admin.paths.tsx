import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/paths")({
  component: PathsAdmin,
});

type Path = {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  display_order: number;
  published: boolean;
};

const empty = (): Partial<Path> => ({ title: "", description: "", icon: "", display_order: 0, published: true });

function PathsAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Path> | null>(null);

  const { data: rows = [] } = useQuery({
    queryKey: ["admin", "paths"],
    queryFn: async () => {
      const { data, error } = await supabase.from("paths").select("*").order("display_order");
      if (error) throw error;
      return data as Path[];
    },
  });

  const save = useMutation({
    mutationFn: async (p: Partial<Path>) => {
      const { id, ...rest } = p;
      if (id) {
        const { error } = await supabase.from("paths").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("paths").insert(rest as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Salvato");
      qc.invalidateQueries({ queryKey: ["admin", "paths"] });
      qc.invalidateQueries({ queryKey: ["public", "paths"] });
      setEditing(null);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Errore"),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("paths").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "paths"] });
      qc.invalidateQueries({ queryKey: ["public", "paths"] });
      toast.success("Eliminato");
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink">Percorsi mentali</h1>
          <p className="text-muted-foreground mt-1">I pilastri/percorsi mostrati nella sezione "Ecosistema".</p>
        </div>
        <button onClick={() => setEditing(empty())} className="inline-flex items-center gap-2 bg-brand-green text-white font-bold rounded-full px-5 py-2.5 hover:brightness-110">
          <Plus size={16} /> Nuovo percorso
        </button>
      </div>

      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-off text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4 w-16">#</th>
              <th className="p-4">Titolo</th>
              <th className="p-4">Pubblicato</th>
              <th className="p-4 w-32"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t border-line">
                <td className="p-4 text-muted-foreground">{p.display_order}</td>
                <td className="p-4 font-medium">{p.title}</td>
                <td className="p-4">{p.published ? "Sì" : "No"}</td>
                <td className="p-4">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => setEditing(p)} className="p-2 hover:bg-off rounded"><Pencil size={14} /></button>
                    <button onClick={() => confirm("Eliminare?") && del.mutate(p.id)} className="p-2 hover:bg-off rounded text-red-600"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Nessun percorso.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && <PathForm row={editing} onClose={() => setEditing(null)} onSave={(p) => save.mutate(p)} />}
    </div>
  );
}

function PathForm({ row, onClose, onSave }: { row: Partial<Path>; onClose: () => void; onSave: (p: Partial<Path>) => void }) {
  const [f, setF] = useState(row);
  const set = <K extends keyof Path>(k: K, v: Path[K]) => setF((x) => ({ ...x, [k]: v }));
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-line">
          <h2 className="font-display text-xl font-bold">{row.id ? "Modifica percorso" : "Nuovo percorso"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-off rounded"><X size={18} /></button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <L label="Titolo"><input className="input" value={f.title ?? ""} onChange={(e) => set("title", e.target.value)} /></L>
          <L label="Descrizione"><textarea className="input" rows={4} value={f.description ?? ""} onChange={(e) => set("description", e.target.value)} /></L>
          <L label="Icona (URL immagine opzionale)"><input className="input" value={f.icon ?? ""} onChange={(e) => set("icon", e.target.value)} /></L>
          <L label="Ordine"><input type="number" className="input" value={f.display_order ?? 0} onChange={(e) => set("display_order", Number(e.target.value))} /></L>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.published ?? true} onChange={(e) => set("published", e.target.checked)} /> Pubblicato</label>
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

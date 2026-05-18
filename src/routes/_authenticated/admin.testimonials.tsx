import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Save, X, Check } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/testimonials")({
  component: TestimonialsAdmin,
});

type T = {
  id: string;
  author_name: string;
  author_role: string;
  content: string;
  rating: number;
  photo_url: string | null;
  approved: boolean;
  display_order: number;
};

const empty = (): Partial<T> => ({ author_name: "", author_role: "", content: "", rating: 5, photo_url: "", approved: false, display_order: 0 });

function TestimonialsAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<T> | null>(null);

  const { data: rows = [] } = useQuery({
    queryKey: ["admin", "testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").order("display_order");
      if (error) throw error;
      return data as T[];
    },
  });

  const save = useMutation({
    mutationFn: async (p: Partial<T>) => {
      const { id, ...rest } = p;
      if (id) {
        const { error } = await supabase.from("testimonials").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("testimonials").insert(rest as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Salvato");
      qc.invalidateQueries({ queryKey: ["admin", "testimonials"] });
      qc.invalidateQueries({ queryKey: ["public", "testimonials"] });
      setEditing(null);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Errore"),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "testimonials"] });
      qc.invalidateQueries({ queryKey: ["public", "testimonials"] });
      toast.success("Eliminato");
    },
  });

  const toggleApprove = useMutation({
    mutationFn: async (t: T) => {
      const { error } = await supabase.from("testimonials").update({ approved: !t.approved }).eq("id", t.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "testimonials"] });
      qc.invalidateQueries({ queryKey: ["public", "testimonials"] });
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink">Testimonianze</h1>
          <p className="text-muted-foreground mt-1">Solo quelle approvate sono visibili sul sito.</p>
        </div>
        <button onClick={() => setEditing(empty())} className="inline-flex items-center gap-2 bg-brand-green text-white font-bold rounded-full px-5 py-2.5 hover:brightness-110">
          <Plus size={16} /> Nuova testimonianza
        </button>
      </div>

      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-off text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4">Autore</th>
              <th className="p-4">Ruolo</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Stato</th>
              <th className="p-4 w-40"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className="border-t border-line">
                <td className="p-4 font-medium">{t.author_name}</td>
                <td className="p-4 text-muted-foreground">{t.author_role}</td>
                <td className="p-4">{"★".repeat(t.rating)}</td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${t.approved ? "bg-brand-green/15 text-brand-green" : "bg-off text-muted-foreground"}`}>
                    {t.approved ? "Approvata" : "In attesa"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => toggleApprove.mutate(t)} className="p-2 hover:bg-off rounded text-brand-green" title={t.approved ? "Disapprova" : "Approva"}><Check size={14} /></button>
                    <button onClick={() => setEditing(t)} className="p-2 hover:bg-off rounded"><Pencil size={14} /></button>
                    <button onClick={() => confirm("Eliminare?") && del.mutate(t.id)} className="p-2 hover:bg-off rounded text-red-600"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Nessuna testimonianza.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && <TForm row={editing} onClose={() => setEditing(null)} onSave={(p) => save.mutate(p)} />}
    </div>
  );
}

function TForm({ row, onClose, onSave }: { row: Partial<T>; onClose: () => void; onSave: (p: Partial<T>) => void }) {
  const [f, setF] = useState(row);
  const set = <K extends keyof T>(k: K, v: T[K]) => setF((x) => ({ ...x, [k]: v }));
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-line">
          <h2 className="font-display text-xl font-bold">{row.id ? "Modifica testimonianza" : "Nuova testimonianza"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-off rounded"><X size={18} /></button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <L label="Nome autore"><input className="input" value={f.author_name ?? ""} onChange={(e) => set("author_name", e.target.value)} /></L>
            <L label="Ruolo/Sport"><input className="input" value={f.author_role ?? ""} onChange={(e) => set("author_role", e.target.value)} /></L>
          </div>
          <L label="Testo"><textarea className="input" rows={5} value={f.content ?? ""} onChange={(e) => set("content", e.target.value)} /></L>
          <div className="grid grid-cols-2 gap-4">
            <L label="Rating (1-5)"><input type="number" min={1} max={5} className="input" value={f.rating ?? 5} onChange={(e) => set("rating", Number(e.target.value))} /></L>
            <L label="Ordine"><input type="number" className="input" value={f.display_order ?? 0} onChange={(e) => set("display_order", Number(e.target.value))} /></L>
          </div>
          <L label="Foto (URL)"><input className="input" value={f.photo_url ?? ""} onChange={(e) => set("photo_url", e.target.value)} /></L>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.approved ?? false} onChange={(e) => set("approved", e.target.checked)} /> Approvata (visibile sul sito)</label>
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

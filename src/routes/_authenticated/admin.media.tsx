import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Save, X, Upload, Copy } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/media")({
  component: MediaAdmin,
});

type M = { id: string; key: string; url: string; alt: string };

function MediaAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<M> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");

  const { data: rows = [] } = useQuery({
    queryKey: ["admin", "media"],
    queryFn: async () => {
      const { data, error } = await supabase.from("media_assets").select("*").order("key");
      if (error) throw error;
      return data as M[];
    },
  });

  const save = useMutation({
    mutationFn: async (p: Partial<M>) => {
      const { id, ...rest } = p;
      if (id) {
        const { error } = await supabase.from("media_assets").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("media_assets").insert(rest as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Salvato");
      qc.invalidateQueries({ queryKey: ["admin", "media"] });
      qc.invalidateQueries({ queryKey: ["public", "media"] });
      setEditing(null);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Errore"),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("media_assets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "media"] });
      qc.invalidateQueries({ queryKey: ["public", "media"] });
      toast.success("Eliminato");
    },
  });

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      setUploadedUrl(data.publicUrl);
      toast.success("File caricato. Copia l'URL e usalo nei contenuti.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Errore upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink">Media</h1>
          <p className="text-muted-foreground mt-1">Carica immagini e gestisci le chiavi per sostituirle sul sito.</p>
        </div>
        <button onClick={() => setEditing({ key: "", url: "", alt: "" })} className="inline-flex items-center gap-2 bg-brand-green text-white font-bold rounded-full px-5 py-2.5 hover:brightness-110">
          <Plus size={16} /> Nuova chiave
        </button>
      </div>

      <div className="bg-white border border-line rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Upload size={18} className="text-brand-green" />
          <h2 className="font-display font-bold text-lg">Carica immagine</h2>
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} className="text-sm" />
        {uploading && <p className="text-sm text-muted-foreground mt-2">Caricamento…</p>}
        {uploadedUrl && (
          <div className="mt-3 flex items-center gap-2 bg-off rounded-lg px-3 py-2">
            <code className="text-xs flex-1 truncate">{uploadedUrl}</code>
            <button onClick={() => { navigator.clipboard.writeText(uploadedUrl); toast.success("Copiato"); }} className="p-1.5 hover:bg-white rounded"><Copy size={14} /></button>
          </div>
        )}
      </div>

      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-off text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4">Anteprima</th>
              <th className="p-4">Chiave</th>
              <th className="p-4">URL</th>
              <th className="p-4 w-32"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id} className="border-t border-line">
                <td className="p-4"><img src={m.url} alt={m.alt} className="h-12 w-20 object-cover rounded" /></td>
                <td className="p-4 font-mono text-xs">{m.key}</td>
                <td className="p-4 truncate max-w-xs"><a href={m.url} target="_blank" rel="noreferrer" className="text-brand-green hover:underline text-xs">{m.url}</a></td>
                <td className="p-4">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => setEditing(m)} className="p-2 hover:bg-off rounded text-xs font-semibold">Modifica</button>
                    <button onClick={() => confirm("Eliminare?") && del.mutate(m.id)} className="p-2 hover:bg-off rounded text-red-600"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Nessuna media.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && <MForm row={editing} onClose={() => setEditing(null)} onSave={(p) => save.mutate(p)} />}
    </div>
  );
}

function MForm({ row, onClose, onSave }: { row: Partial<M>; onClose: () => void; onSave: (p: Partial<M>) => void }) {
  const [f, setF] = useState(row);
  const set = <K extends keyof M>(k: K, v: M[K]) => setF((x) => ({ ...x, [k]: v }));
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-line">
          <h2 className="font-display text-xl font-bold">{row.id ? "Modifica media" : "Nuova media"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-off rounded"><X size={18} /></button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <L label="Chiave (es. hero, photo-break)"><input className="input" value={f.key ?? ""} onChange={(e) => set("key", e.target.value)} /></L>
          <L label="URL immagine"><input className="input" value={f.url ?? ""} onChange={(e) => set("url", e.target.value)} /></L>
          <L label="Alt text"><input className="input" value={f.alt ?? ""} onChange={(e) => set("alt", e.target.value)} /></L>
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

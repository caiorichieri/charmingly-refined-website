import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Upload, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Material = {
  id: string;
  athlete_id: string;
  therapist_id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
};

type Props = {
  athleteId: string;
  therapistId: string;
  canUpload: boolean;
};

export function MaterialsList({ athleteId, therapistId, canUpload }: Props) {
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const queryKey = ["materials", athleteId];

  const { data: items = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shared_materials")
        .select("*")
        .eq("athlete_id", athleteId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Material[];
    },
  });

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file || !title.trim() || uploading) return;
    setUploading(true);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${athleteId}/${Date.now()}-${safeName}`;
      const { error: upErr } = await supabase.storage
        .from("shared-materials")
        .upload(path, file, { contentType: file.type });
      if (upErr) throw upErr;
      const { error: insErr } = await supabase.from("shared_materials").insert({
        athlete_id: athleteId,
        therapist_id: therapistId,
        title: title.trim(),
        description: description.trim() || null,
        file_path: path,
        file_type: file.type || null,
        file_size: file.size,
      });
      if (insErr) throw insErr;
      toast.success("Materiale caricato");
      setTitle("");
      setDescription("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      qc.invalidateQueries({ queryKey });
    } catch (err) {
      toast.error((err as Error).message || "Errore caricamento");
    } finally {
      setUploading(false);
    }
  }

  async function handleDownload(path: string) {
    const { data, error } = await supabase.storage
      .from("shared-materials")
      .createSignedUrl(path, 60);
    if (error || !data) {
      toast.error("Impossibile generare il link");
      return;
    }
    window.open(data.signedUrl, "_blank");
  }

  async function handleDelete(item: Material) {
    if (!confirm(`Eliminare "${item.title}"?`)) return;
    await supabase.storage.from("shared-materials").remove([item.file_path]);
    const { error } = await supabase.from("shared_materials").delete().eq("id", item.id);
    if (error) {
      toast.error("Errore eliminazione");
      return;
    }
    toast.success("Materiale eliminato");
    qc.invalidateQueries({ queryKey });
  }

  return (
    <div className="space-y-4">
      {canUpload && (
        <form onSubmit={handleUpload} className="bg-off rounded-xl p-4 space-y-2 border border-line">
          <div className="grid sm:grid-cols-2 gap-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titolo *"
              maxLength={200}
              required
              className="px-3 py-2 text-sm rounded-lg border border-line bg-white"
            />
            <input
              ref={fileInputRef}
              type="file"
              required
              className="px-3 py-2 text-sm rounded-lg border border-line bg-white"
            />
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrizione (opzionale)"
            maxLength={2000}
            rows={2}
            className="w-full px-3 py-2 text-sm rounded-lg border border-line bg-white"
          />
          <button
            type="submit"
            disabled={uploading}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-brand-green text-white rounded-lg hover:brightness-110 disabled:opacity-50 transition"
          >
            <Upload size={14} /> {uploading ? "Caricamento…" : "Carica materiale"}
          </button>
        </form>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Caricamento…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">
          {canUpload
            ? "Nessun materiale caricato per questo atleta."
            : "Nessun materiale condiviso dal tuo terapeuta."}
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((m) => (
            <li
              key={m.id}
              className="flex items-start gap-3 bg-white border border-line rounded-xl p-3"
            >
              <span className="grid place-items-center h-9 w-9 rounded-lg bg-brand-green/10 text-brand-green shrink-0">
                <FileText size={16} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink text-sm truncate">{m.title}</p>
                {m.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{m.description}</p>
                )}
                <p className="text-[11px] text-muted-foreground mt-1">
                  {new Date(m.created_at).toLocaleDateString("it-IT")}
                  {m.file_size ? ` · ${(m.file_size / 1024).toFixed(0)} KB` : ""}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleDownload(m.file_path)}
                  className="p-2 rounded-lg hover:bg-off text-muted-foreground hover:text-brand-green"
                  title="Scarica"
                >
                  <Download size={14} />
                </button>
                {canUpload && (
                  <button
                    onClick={() => handleDelete(m)}
                    className="p-2 rounded-lg hover:bg-off text-muted-foreground hover:text-red-600"
                    title="Elimina"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

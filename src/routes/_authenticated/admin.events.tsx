import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/events")({
  component: EventsAdmin,
});

type E = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  location: string;
  event_date: string;
  cover_url: string;
  price: string;
  price_detail: string;
  info: string;
  sold_out: boolean;
  published: boolean;
  display_order: number;
};

const empty = (): Partial<E> => ({
  title: "",
  subtitle: "",
  description: "",
  location: "",
  event_date: new Date().toISOString().slice(0, 16),
  cover_url: "",
  price: "",
  price_detail: "",
  info: "",
  sold_out: false,
  published: true,
  display_order: 0,
});

function toLocalInput(iso: string | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function EventsAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<E> | null>(null);

  const { data: rows = [] } = useQuery({
    queryKey: ["admin", "events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });
      if (error) throw error;
      return data as E[];
    },
  });

  const save = useMutation({
    mutationFn: async (p: Partial<E>) => {
      const { id, ...rest } = p;
      const payload = {
        ...rest,
        event_date: rest.event_date
          ? new Date(rest.event_date).toISOString()
          : new Date().toISOString(),
      };
      if (id) {
        const { error } = await supabase.from("events").update(payload).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("events").insert(payload as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Salvato");
      qc.invalidateQueries({ queryKey: ["admin", "events"] });
      qc.invalidateQueries({ queryKey: ["public", "events"] });
      setEditing(null);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Errore"),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "events"] });
      qc.invalidateQueries({ queryKey: ["public", "events"] });
      toast.success("Eliminato");
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink">Formazione</h1>
          <p className="text-muted-foreground mt-1">
            Gestisci eventi, workshop e convegni. Solo quelli pubblicati appaiono sul sito.
          </p>
        </div>
        <button
          onClick={() => setEditing(empty())}
          className="inline-flex items-center gap-2 bg-brand-green text-white font-bold rounded-full px-5 py-2.5 hover:brightness-110"
        >
          <Plus size={16} /> Nuovo evento
        </button>
      </div>

      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-off text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4">Copertina</th>
              <th className="p-4">Titolo</th>
              <th className="p-4">Data</th>
              <th className="p-4">Luogo</th>
              <th className="p-4">Prezzo</th>
              <th className="p-4">Stato</th>
              <th className="p-4 w-32"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id} className="border-t border-line">
                <td className="p-4">
                  {e.cover_url ? (
                    <img src={e.cover_url} alt="" className="h-12 w-20 object-cover rounded" />
                  ) : (
                    <div className="h-12 w-20 rounded bg-off" />
                  )}
                </td>
                <td className="p-4 font-medium max-w-xs">{e.title}</td>
                <td className="p-4 text-muted-foreground whitespace-nowrap">
                  {new Date(e.event_date).toLocaleDateString("it-IT")}
                </td>
                <td className="p-4 text-muted-foreground">{e.location}</td>
                <td className="p-4">{e.price}</td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded w-fit ${
                        e.published
                          ? "bg-brand-green/15 text-brand-green"
                          : "bg-off text-muted-foreground"
                      }`}
                    >
                      {e.published ? "Pubblicato" : "Bozza"}
                    </span>
                    {e.sold_out && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 w-fit">
                        Sold out
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-1 justify-end">
                    <button
                      onClick={() => setEditing(e)}
                      className="p-2 hover:bg-off rounded"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => confirm("Eliminare?") && del.mutate(e.id)}
                      className="p-2 hover:bg-off rounded text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  Nessun evento.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <EForm
          row={editing}
          onClose={() => setEditing(null)}
          onSave={(p) => save.mutate(p)}
        />
      )}
    </div>
  );
}

function EForm({
  row,
  onClose,
  onSave,
}: {
  row: Partial<E>;
  onClose: () => void;
  onSave: (p: Partial<E>) => void;
}) {
  const [f, setF] = useState<Partial<E>>({
    ...row,
    event_date: toLocalInput(row.event_date),
  });
  const set = <K extends keyof E>(k: K, v: E[K]) => setF((x) => ({ ...x, [k]: v }));

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-line sticky top-0 bg-white z-10">
          <h2 className="font-display text-xl font-bold">
            {row.id ? "Modifica evento" : "Nuovo evento"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-off rounded">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <L label="Titolo">
            <input
              className="input"
              value={f.title ?? ""}
              onChange={(e) => set("title", e.target.value)}
            />
          </L>
          <L label="Sottotitolo">
            <input
              className="input"
              value={f.subtitle ?? ""}
              onChange={(e) => set("subtitle", e.target.value)}
            />
          </L>
          <L label="Descrizione">
            <textarea
              className="input"
              rows={5}
              value={f.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
            />
          </L>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <L label="Data e ora">
              <input
                type="datetime-local"
                className="input"
                value={(f.event_date as string) ?? ""}
                onChange={(e) => set("event_date", e.target.value as never)}
              />
            </L>
            <L label="Luogo">
              <input
                className="input"
                value={f.location ?? ""}
                onChange={(e) => set("location", e.target.value)}
              />
            </L>
          </div>

          <L label="Copertina (URL immagine)">
            <input
              className="input"
              value={f.cover_url ?? ""}
              onChange={(e) => set("cover_url", e.target.value)}
              placeholder="https://…"
            />
          </L>
          {f.cover_url && (
            <img
              src={f.cover_url}
              alt=""
              className="w-full h-40 object-cover rounded-lg border border-line"
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <L label="Prezzo (es. € 180)">
              <input
                className="input"
                value={f.price ?? ""}
                onChange={(e) => set("price", e.target.value)}
              />
            </L>
            <L label="Dettagli prezzo">
              <input
                className="input"
                value={f.price_detail ?? ""}
                onChange={(e) => set("price_detail", e.target.value)}
                placeholder="Early bird, IVA inclusa…"
              />
            </L>
          </div>

          <L label="Informazioni / iscrizione">
            <textarea
              className="input"
              rows={3}
              value={f.info ?? ""}
              onChange={(e) => set("info", e.target.value)}
              placeholder="Email iscrizione, posti disponibili…"
            />
          </L>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <L label="Ordine">
              <input
                type="number"
                className="input"
                value={f.display_order ?? 0}
                onChange={(e) => set("display_order", Number(e.target.value))}
              />
            </L>
            <label className="flex items-center gap-2 text-sm pt-6">
              <input
                type="checkbox"
                checked={f.sold_out ?? false}
                onChange={(e) => set("sold_out", e.target.checked)}
              />
              Sold out (fascia bianca su copertina)
            </label>
            <label className="flex items-center gap-2 text-sm pt-6">
              <input
                type="checkbox"
                checked={f.published ?? true}
                onChange={(e) => set("published", e.target.checked)}
              />
              Pubblicato (visibile sul sito)
            </label>
          </div>
        </div>

        <div className="p-6 border-t border-line flex justify-end gap-2 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium hover:bg-off rounded-lg"
          >
            Annulla
          </button>
          <button
            onClick={() => onSave(f)}
            className="inline-flex items-center gap-2 bg-brand-green text-white font-bold rounded-full px-5 py-2.5 hover:brightness-110"
          >
            <Save size={14} /> Salva
          </button>
        </div>
      </div>
    </div>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-foreground/80">{label}</span>
      {children}
    </label>
  );
}

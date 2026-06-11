import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Save, X, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/ambassadors")({
  component: AmbassadorsAdmin,
});

type Role = { label: string; organization: string };
type Stat = { value: string; label: string };
type Org = { name: string; description?: string; logo_url?: string; url?: string };
type Honor = { title: string; issuer?: string; year?: string; image_url?: string; description?: string };
type Value = { title: string; body: string };

type A = {
  id: string;
  slug: string;
  full_name: string;
  tagline: string | null;
  location: string | null;
  bio: string | null;
  photo_url: string | null;
  cover_url: string | null;
  website_url: string | null;
  social_links: Record<string, string>;
  roles: Role[];
  stats: Stat[];
  organizations: Org[];
  honors: Honor[];
  values: Value[];
  quote_text: string | null;
  published: boolean;
  display_order: number;
};

const empty = (): Partial<A> => ({
  slug: "",
  full_name: "",
  tagline: "",
  location: "",
  bio: "",
  photo_url: "",
  website_url: "",
  social_links: {},
  roles: [],
  stats: [],
  organizations: [],
  honors: [],
  values: [],
  quote_text: "",
  published: false,
  display_order: 0,
});

function AmbassadorsAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<A> | null>(null);

  const { data: rows = [] } = useQuery({
    queryKey: ["admin", "ambassadors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ambassadors" as never)
        .select("*")
        .order("display_order");
      if (error) throw error;
      return (data ?? []) as unknown as A[];
    },
  });

  const save = useMutation({
    mutationFn: async (p: Partial<A>) => {
      const { id, ...rest } = p;
      if (id) {
        const { error } = await supabase
          .from("ambassadors" as never)
          .update(rest as never)
          .eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("ambassadors" as never).insert(rest as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Salvato");
      qc.invalidateQueries({ queryKey: ["admin", "ambassadors"] });
      qc.invalidateQueries({ queryKey: ["public", "ambassadors"] });
      setEditing(null);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Errore"),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ambassadors" as never).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "ambassadors"] });
      qc.invalidateQueries({ queryKey: ["public", "ambassadors"] });
      toast.success("Eliminato");
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink">Ambasciatori</h1>
          <p className="text-muted-foreground mt-1">
            Gestisci le persone che rappresentano MeMindSport.
          </p>
        </div>
        <button
          onClick={() => setEditing(empty())}
          className="inline-flex items-center gap-2 bg-brand-green text-white font-bold rounded-full px-5 py-2.5 hover:brightness-110"
        >
          <Plus size={16} /> Nuovo ambasciatore
        </button>
      </div>

      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-off text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4">Nome</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Località</th>
              <th className="p-4">Stato</th>
              <th className="p-4">Ordine</th>
              <th className="p-4 w-40"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} className="border-t border-line">
                <td className="p-4 font-medium flex items-center gap-3">
                  {a.photo_url && (
                    <img
                      src={a.photo_url}
                      alt=""
                      className="h-9 w-9 rounded-full object-cover bg-off"
                    />
                  )}
                  {a.full_name}
                </td>
                <td className="p-4 text-muted-foreground font-mono text-xs">{a.slug}</td>
                <td className="p-4 text-muted-foreground">{a.location ?? "—"}</td>
                <td className="p-4">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${a.published ? "bg-brand-green/15 text-brand-green" : "bg-off text-muted-foreground"}`}
                  >
                    {a.published ? "Pubblicato" : "Bozza"}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground">{a.display_order}</td>
                <td className="p-4">
                  <div className="flex gap-1 justify-end">
                    <Link
                      to="/ambasciatori/$slug"
                      params={{ slug: a.slug }}
                      target="_blank"
                      className="p-2 hover:bg-off rounded"
                      title="Anteprima"
                    >
                      <ExternalLink size={14} />
                    </Link>
                    <button onClick={() => setEditing(a)} className="p-2 hover:bg-off rounded">
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => confirm("Eliminare?") && del.mutate(a.id)}
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
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  Nessun ambasciatore. Aggiungi il primo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <AForm
          row={editing}
          onClose={() => setEditing(null)}
          onSave={(p) => save.mutate(p)}
          saving={save.isPending}
        />
      )}
    </div>
  );
}

function AForm({
  row,
  onClose,
  onSave,
  saving,
}: {
  row: Partial<A>;
  onClose: () => void;
  onSave: (p: Partial<A>) => void;
  saving: boolean;
}) {
  const [f, setF] = useState<Partial<A>>({
    ...row,
    roles: row.roles ?? [],
    stats: row.stats ?? [],
    organizations: row.organizations ?? [],
    honors: row.honors ?? [],
    values: row.values ?? [],
    social_links: row.social_links ?? {},
  });
  const set = <K extends keyof A>(k: K, v: A[K]) => setF((x) => ({ ...x, [k]: v }));

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-line sticky top-0 bg-white z-10">
          <h2 className="font-display text-xl font-bold">
            {row.id ? "Modifica ambasciatore" : "Nuovo ambasciatore"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-off rounded">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-6">
          <Section title="Dati base">
            <div className="grid grid-cols-2 gap-4">
              <L label="Nome completo">
                <input
                  className="input"
                  value={f.full_name ?? ""}
                  onChange={(e) => set("full_name", e.target.value)}
                />
              </L>
              <L label="Slug (URL)">
                <input
                  className="input font-mono text-xs"
                  value={f.slug ?? ""}
                  onChange={(e) =>
                    set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
                  }
                  placeholder="nome-cognome"
                />
              </L>
            </div>
            <L label="Località">
              <input
                className="input"
                value={f.location ?? ""}
                onChange={(e) => set("location", e.target.value)}
                placeholder="Es. Medio Friuli · FVG · Italia"
              />
            </L>
            <L label="Tagline (1-2 frasi)">
              <textarea
                className="input"
                rows={2}
                value={f.tagline ?? ""}
                onChange={(e) => set("tagline", e.target.value)}
              />
            </L>
            <L label="Biografia">
              <textarea
                className="input"
                rows={5}
                value={f.bio ?? ""}
                onChange={(e) => set("bio", e.target.value)}
              />
            </L>
            <div className="grid grid-cols-2 gap-4">
              <L label="Foto ritaglio (URL)">
                <input
                  className="input"
                  value={f.photo_url ?? ""}
                  onChange={(e) => set("photo_url", e.target.value)}
                />
              </L>
              <L label="Sito web personale">
                <input
                  className="input"
                  value={f.website_url ?? ""}
                  onChange={(e) => set("website_url", e.target.value)}
                  placeholder="https://..."
                />
              </L>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={f.published ?? false}
                  onChange={(e) => set("published", e.target.checked)}
                />
                Pubblicato (visibile sul sito)
              </label>
              <L label="Ordine di visualizzazione">
                <input
                  type="number"
                  className="input"
                  value={f.display_order ?? 0}
                  onChange={(e) => set("display_order", Number(e.target.value))}
                />
              </L>
            </div>
          </Section>

          <Section title="Quote MeMindSport">
            <L label="Citazione (perché è ambasciatore)">
              <textarea
                className="input"
                rows={3}
                value={f.quote_text ?? ""}
                onChange={(e) => set("quote_text", e.target.value)}
              />
            </L>
          </Section>

          <Repeater
            title="Ruoli"
            items={f.roles ?? []}
            onChange={(v) => set("roles", v)}
            create={() => ({ label: "", organization: "" })}
            fields={[
              { key: "label", label: "Ruolo", placeholder: "Presidente" },
              { key: "organization", label: "Organizzazione", placeholder: "ASD Atletica 2000" },
            ]}
          />

          <Repeater
            title="Statistiche"
            items={f.stats ?? []}
            onChange={(v) => set("stats", v)}
            create={() => ({ value: "", label: "" })}
            fields={[
              { key: "value", label: "Valore", placeholder: "456" },
              { key: "label", label: "Etichetta", placeholder: "Atleti tesserati" },
            ]}
          />

          <Repeater
            title="Organizzazioni rappresentate"
            items={f.organizations ?? []}
            onChange={(v) => set("organizations", v)}
            create={() => ({ name: "", description: "", logo_url: "", url: "" })}
            fields={[
              { key: "name", label: "Nome" },
              { key: "description", label: "Descrizione" },
              { key: "logo_url", label: "Logo URL" },
              { key: "url", label: "Sito" },
            ]}
          />

          <Repeater
            title="Onorificenze"
            items={f.honors ?? []}
            onChange={(v) => set("honors", v)}
            create={() => ({ title: "", issuer: "", year: "", image_url: "", description: "" })}
            fields={[
              { key: "title", label: "Titolo" },
              { key: "issuer", label: "Ente" },
              { key: "year", label: "Anno" },
              { key: "image_url", label: "Immagine URL" },
              { key: "description", label: "Descrizione", textarea: true },
            ]}
          />

          <Repeater
            title="Valori"
            items={f.values ?? []}
            onChange={(v) => set("values", v)}
            create={() => ({ title: "", body: "" })}
            fields={[
              { key: "title", label: "Titolo" },
              { key: "body", label: "Descrizione", textarea: true },
            ]}
          />
        </div>
        <div className="p-6 border-t border-line flex justify-end gap-2 sticky bottom-0 bg-white">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium hover:bg-off rounded-lg">
            Annulla
          </button>
          <button
            disabled={saving}
            onClick={() => onSave(f)}
            className="inline-flex items-center gap-2 bg-brand-green text-white font-bold rounded-full px-5 py-2.5 hover:brightness-110 disabled:opacity-50"
          >
            <Save size={14} /> {saving ? "Salvataggio…" : "Salva"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs uppercase tracking-wider font-bold text-brand-green">{title}</h3>
      <div className="flex flex-col gap-3">{children}</div>
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

type Field<T> = { key: keyof T & string; label: string; placeholder?: string; textarea?: boolean };

function Repeater<T extends Record<string, unknown>>({
  title,
  items,
  onChange,
  create,
  fields,
}: {
  title: string;
  items: T[];
  onChange: (v: T[]) => void;
  create: () => T;
  fields: Field<T>[];
}) {
  const update = (i: number, k: keyof T, v: string) => {
    const next = [...items];
    next[i] = { ...next[i], [k]: v };
    onChange(next);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-wider font-bold text-brand-green">{title}</h3>
        <button
          type="button"
          onClick={() => onChange([...items, create()])}
          className="text-xs font-semibold text-brand-green hover:underline inline-flex items-center gap-1"
        >
          <Plus size={12} /> Aggiungi
        </button>
      </div>
      {items.length === 0 && (
        <p className="text-xs text-muted-foreground italic">Nessun elemento.</p>
      )}
      {items.map((item, i) => (
        <div key={i} className="border border-line rounded-lg p-3 flex flex-col gap-2 bg-off">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-red-600 hover:bg-white rounded p-1"
            >
              <Trash2 size={12} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {fields.map((field) => (
              <L key={field.key} label={field.label}>
                {field.textarea ? (
                  <textarea
                    className="input text-sm"
                    rows={2}
                    value={(item[field.key] as string) ?? ""}
                    onChange={(e) => update(i, field.key, e.target.value)}
                    placeholder={field.placeholder}
                  />
                ) : (
                  <input
                    className="input text-sm"
                    value={(item[field.key] as string) ?? ""}
                    onChange={(e) => update(i, field.key, e.target.value)}
                    placeholder={field.placeholder}
                  />
                )}
              </L>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

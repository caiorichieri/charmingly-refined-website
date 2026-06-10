import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/blog")({
  component: BlogAdmin,
});

type Post = {
  id: string;
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  content: string;
  cover_url: string;
  reading_time: string;
  published: boolean;
  display_order: number;
};

function emptyPost(): Partial<Post> {
  return { slug: "", tag: "", title: "", excerpt: "", content: "", cover_url: "", reading_time: "5 min", published: true, display_order: 0 };
}

function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function BlogAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Post> | null>(null);

  const { data: posts = [] } = useQuery({
    queryKey: ["admin", "blog_posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").order("display_order");
      if (error) throw error;
      return data as Post[];
    },
  });

  const save = useMutation({
    mutationFn: async (p: Partial<Post>) => {
      const { id, ...rest } = p;
      // Auto-generate slug from title if empty, and normalize any user-entered slug
      const normalizedSlug = slugify(rest.slug && rest.slug.trim() ? rest.slug : (rest.title ?? ""));
      if (!normalizedSlug) throw new Error("Titolo o slug mancante");
      const payload = { ...rest, slug: normalizedSlug };
      if (id) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Salvato");
      qc.invalidateQueries({ queryKey: ["admin", "blog_posts"] });
      qc.invalidateQueries({ queryKey: ["public", "blog_posts_featured"] });
      qc.invalidateQueries({ queryKey: ["public", "blog_posts_all"] });
      qc.invalidateQueries({ queryKey: ["public", "blog_post"] });
      setEditing(null);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Errore"),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Eliminato");
      qc.invalidateQueries({ queryKey: ["admin", "blog_posts"] });
      qc.invalidateQueries({ queryKey: ["public", "blog_posts_featured"] });
      qc.invalidateQueries({ queryKey: ["public", "blog_posts_all"] });
      qc.invalidateQueries({ queryKey: ["public", "blog_post"] });
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink">Articoli blog</h1>
          <p className="text-muted-foreground mt-1">Gestisci news e approfondimenti del sito.</p>
        </div>
        <button onClick={() => setEditing(emptyPost())} className="inline-flex items-center gap-2 bg-brand-green text-white font-bold rounded-full px-5 py-2.5 hover:brightness-110">
          <Plus size={16} /> Nuovo articolo
        </button>
      </div>

      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-off text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4">Titolo</th>
              <th className="p-4">Tag</th>
              <th className="p-4">Stato</th>
              <th className="p-4 w-32"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-t border-line">
                <td className="p-4 font-medium">{p.title}</td>
                <td className="p-4 text-muted-foreground">{p.tag}</td>
                <td className="p-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${p.published ? "bg-brand-green/10 text-brand-green" : "bg-muted text-muted-foreground"}`}>
                    {p.published ? "Pubblicato" : "Bozza"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => setEditing(p)} className="p-2 hover:bg-off rounded"><Pencil size={14} /></button>
                    <button onClick={() => confirm("Eliminare?") && del.mutate(p.id)} className="p-2 hover:bg-off rounded text-red-600"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Nessun articolo.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && <PostForm post={editing} onClose={() => setEditing(null)} onSave={(p) => save.mutate(p)} />}
    </div>
  );
}

function PostForm({ post, onClose, onSave }: { post: Partial<Post>; onClose: () => void; onSave: (p: Partial<Post>) => void }) {
  const [form, setForm] = useState(post);
  const set = <K extends keyof Post>(k: K, v: Post[K]) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-line">
          <h2 className="font-display text-xl font-bold">{post.id ? "Modifica articolo" : "Nuovo articolo"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-off rounded"><X size={18} /></button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <Field label="Titolo"><input className="input" value={form.title ?? ""} onChange={(e) => {
            const title = e.target.value;
            setForm((f) => {
              const currentSlug = f.slug ?? "";
              const autoSlugFromPrev = slugify(f.title ?? "");
              const shouldSync = !currentSlug || currentSlug === autoSlugFromPrev;
              return { ...f, title, slug: shouldSync ? slugify(title) : currentSlug };
            });
          }} /></Field>
          <Field label="Slug (URL)"><input className="input" value={form.slug ?? ""} onChange={(e) => set("slug", slugify(e.target.value))} placeholder="ansia-da-prestazione" /></Field>
          <Field label="Tag"><input className="input" value={form.tag ?? ""} onChange={(e) => set("tag", e.target.value)} /></Field>
          <Field label="Estratto"><textarea className="input" rows={2} value={form.excerpt ?? ""} onChange={(e) => set("excerpt", e.target.value)} /></Field>
          <Field label="Contenuto"><textarea className="input" rows={6} value={form.content ?? ""} onChange={(e) => set("content", e.target.value)} /></Field>
          <Field label="URL immagine copertina"><input className="input" value={form.cover_url ?? ""} onChange={(e) => set("cover_url", e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tempo di lettura"><input className="input" value={form.reading_time ?? ""} onChange={(e) => set("reading_time", e.target.value)} /></Field>
            <Field label="Ordine"><input type="number" className="input" value={form.display_order ?? 0} onChange={(e) => set("display_order", Number(e.target.value))} /></Field>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published ?? true} onChange={(e) => set("published", e.target.checked)} />
            Pubblicato
          </label>
        </div>
        <div className="p-6 border-t border-line flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium hover:bg-off rounded-lg">Annulla</button>
          <button onClick={() => onSave(form)} className="inline-flex items-center gap-2 bg-brand-green text-white font-bold rounded-full px-5 py-2.5 hover:brightness-110">
            <Save size={14} /> Salva
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-foreground/80">{label}</span>
      {children}
    </label>
  );
}

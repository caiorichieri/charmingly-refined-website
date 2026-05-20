import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/contatti")({
  head: () => ({
    meta: [
      { title: "Contatti — MeMindSport" },
      { name: "description", content: "Contatta MeMindSport per informazioni su percorsi di psicologia dello sport, mental coaching e progetti per squadre." },
      { property: "og:title", content: "Contatti — MeMindSport" },
      { property: "og:description", content: "Scrivici per percorsi individuali o progetti per squadre." },
      { property: "og:url", content: "https://memindsport.it/contatti" },
    ],
    links: [{ rel: "canonical", href: "https://memindsport.it/contatti" }],
  }),
  component: ContattiPage,
});

const schema = z.object({
  nome: z.string().trim().min(2, "Inserisci il tuo nome").max(120),
  email: z.string().trim().email("Email non valida").max(254),
  oggetto: z.string().trim().min(2, "Inserisci un oggetto").max(160),
  messaggio: z.string().trim().min(10, "Scrivi almeno 10 caratteri").max(2000),
});

function ContattiPage() {
  const [form, setForm] = useState({ nome: "", email: "", oggetto: "", messaggio: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    const subject = encodeURIComponent(`[Contatto sito] ${parsed.data.oggetto}`);
    const body = encodeURIComponent(
      `Nome: ${parsed.data.nome}\nEmail: ${parsed.data.email}\n\n${parsed.data.messaggio}`,
    );
    window.location.href = `mailto:info@memindsport.it?subject=${subject}&body=${body}`;
    toast.success("Apertura del client email…");
  }

  return (
    <main className="bg-background">
      <Nav />
      <section className="bg-white py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-[800px] mx-auto">
          <div className="eyebrow mb-4">Contatti</div>
          <h1 className="h-display text-[clamp(32px,4vw,52px)] mb-4">Scrivici</h1>
          <p className="text-[16px] text-foreground/70 leading-[1.75] mb-10 max-w-[640px]">
            Per percorsi individuali, progetti per squadre, collaborazioni o domande generiche, compila il modulo o scrivi direttamente a{" "}
            <a href="mailto:info@memindsport.it" className="text-brand-green font-semibold hover:underline">
              info@memindsport.it
            </a>
            .
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            {([
              { key: "nome", label: "Nome e cognome", type: "text" },
              { key: "email", label: "Email", type: "email" },
              { key: "oggetto", label: "Oggetto", type: "text" },
            ] as const).map((f) => (
              <div key={f.key} className="flex flex-col gap-1.5">
                <label htmlFor={f.key} className="text-[13px] font-semibold text-foreground">
                  {f.label}
                </label>
                <input
                  id={f.key}
                  type={f.type}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="border border-line rounded px-4 py-3 text-[15px] bg-white focus:outline-none focus:border-brand-green transition-colors"
                />
                {errors[f.key] && <span className="text-[12px] text-red-600">{errors[f.key]}</span>}
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="messaggio" className="text-[13px] font-semibold text-foreground">
                Messaggio
              </label>
              <textarea
                id="messaggio"
                rows={6}
                value={form.messaggio}
                onChange={(e) => setForm({ ...form, messaggio: e.target.value })}
                className="border border-line rounded px-4 py-3 text-[15px] bg-white focus:outline-none focus:border-brand-green transition-colors resize-y"
              />
              {errors.messaggio && <span className="text-[12px] text-red-600">{errors.messaggio}</span>}
            </div>
            <button
              type="submit"
              className="self-start font-display font-bold text-[15px] tracking-wide text-white bg-brand-green rounded-full px-8 py-3.5 hover:brightness-110 transition-all"
            >
              Invia messaggio →
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}

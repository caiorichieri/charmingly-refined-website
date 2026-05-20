import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/cookie")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — MeMindSport" },
      { name: "description", content: "Informativa sull'utilizzo dei cookie sul sito MeMindSport." },
      { property: "og:title", content: "Cookie Policy — MeMindSport" },
      { property: "og:description", content: "Quali cookie utilizziamo e perché." },
      { property: "og:url", content: "https://memindsport.it/cookie" },
    ],
    links: [{ rel: "canonical", href: "https://memindsport.it/cookie" }],
  }),
  component: CookiePage,
});

function CookiePage() {
  return (
    <main className="bg-background">
      <Nav />
      <article className="bg-white py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-[800px] mx-auto">
          <div className="eyebrow mb-4">Legale</div>
          <h1 className="h-display text-[clamp(32px,4vw,52px)] mb-6">Cookie Policy</h1>
          <p className="text-[14px] text-muted-foreground mb-10">Ultimo aggiornamento: 20 maggio 2026</p>

          <Section title="Cosa sono i cookie">
            I cookie sono piccoli file di testo che i siti visitati inviano al browser dell'utente, dove vengono memorizzati per essere ritrasmessi al sito alla visita successiva.
          </Section>

          <Section title="Cookie tecnici">
            Utilizziamo cookie tecnici e di sessione, indispensabili per il corretto funzionamento del sito (autenticazione, preferenze, sicurezza). Per questi cookie non è richiesto il consenso.
          </Section>

          <Section title="Cookie di analisi">
            Utilizziamo strumenti di analisi statistica per comprendere come gli utenti interagiscono con il sito e migliorarne l'esperienza. I dati sono raccolti in forma aggregata e anonima.
          </Section>

          <Section title="Cookie di terze parti">
            Alcune funzionalità (video incorporati, mappe, social) possono impostare cookie di terze parti regolati dalle rispettive privacy policy.
          </Section>

          <Section title="Gestione dei cookie">
            Puoi gestire le tue preferenze cookie direttamente dalle impostazioni del tuo browser. La disabilitazione dei cookie tecnici può compromettere il corretto funzionamento del sito.
          </Section>

          <Section title="Contatti">
            Per qualsiasi domanda relativa all'utilizzo dei cookie scrivi a{" "}
            <a href="mailto:info@memindsport.it" className="text-brand-green hover:underline">info@memindsport.it</a>.
          </Section>
        </div>
      </article>
      <Footer />
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-display font-bold text-[20px] mb-3">{title}</h2>
      <p className="text-[15.5px] leading-[1.75] text-foreground/80">{children}</p>
    </section>
  );
}

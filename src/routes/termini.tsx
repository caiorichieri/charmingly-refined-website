import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/termini")({
  head: () => ({
    meta: [
      { title: "Termini e Condizioni — MeMindSport" },
      { name: "description", content: "Termini e condizioni d'uso dei servizi MeMindSport." },
      { property: "og:title", content: "Termini e Condizioni — MeMindSport" },
      { property: "og:description", content: "Regole d'uso del sito e dei servizi MeMindSport." },
      { property: "og:url", content: "https://memindsport.it/termini" },
    ],
    links: [{ rel: "canonical", href: "https://memindsport.it/termini" }],
  }),
  component: TerminiPage,
});

function TerminiPage() {
  return (
    <main className="bg-background">
      <Nav />
      <article className="bg-white py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-[800px] mx-auto">
          <div className="eyebrow mb-4">Legale</div>
          <h1 className="h-display text-[clamp(32px,4vw,52px)] mb-6">Termini e Condizioni</h1>
          <p className="text-[14px] text-muted-foreground mb-10">Ultimo aggiornamento: 20 maggio 2026</p>

          <Section title="1. Oggetto">
            I presenti termini regolano l'utilizzo del sito memindsport.it e dei servizi di psicologia dello sport, mental coaching e percorsi immersivi offerti da MetaCare SRL.
          </Section>

          <Section title="2. Natura dei servizi">
            I servizi di psicologia sportiva sono prestazioni sanitarie erogate da professionisti iscritti all'Ordine degli Psicologi. I servizi di mental coaching sono prestazioni non sanitarie erogate da coach certificati e non sostituiscono in alcun modo prestazioni mediche o psicoterapeutiche.
          </Section>

          <Section title="3. Prenotazione e pagamento">
            La prenotazione di una sessione si perfeziona con la conferma da parte di MeMindSport e l'avvenuto pagamento. Le cancellazioni con preavviso inferiore a 24 ore comportano l'addebito dell'intero importo.
          </Section>

          <Section title="4. Proprietà intellettuale">
            Tutti i contenuti del sito (testi, immagini, video, loghi, contenuti dell'app) sono di proprietà di MetaCare SRL o dei rispettivi titolari e tutelati dalla normativa sul diritto d'autore.
          </Section>

          <Section title="5. Limitazioni di responsabilità">
            MeMindSport non garantisce risultati specifici dai propri servizi, che dipendono dall'impegno e dalle condizioni individuali dell'utente. La responsabilità è limitata a quanto previsto dalla legge.
          </Section>

          <Section title="6. Legge applicabile">
            I presenti termini sono regolati dalla legge italiana. Foro competente esclusivo è il Tribunale di Udine, salvo diversa disposizione inderogabile a tutela del consumatore.
          </Section>

          <Section title="7. Contatti">
            Per qualsiasi domanda scrivi a{" "}
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

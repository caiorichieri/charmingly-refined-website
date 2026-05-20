import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — MeMindSport" },
      { name: "description", content: "Informativa sul trattamento dei dati personali di MeMindSport ai sensi del Regolamento UE 2016/679 (GDPR)." },
      { property: "og:title", content: "Privacy Policy — MeMindSport" },
      { property: "og:description", content: "Come trattiamo i tuoi dati personali." },
      { property: "og:url", content: "https://memindsport.it/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://memindsport.it/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="bg-background">
      <Nav />
      <article className="bg-white py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-[800px] mx-auto prose-content">
          <div className="eyebrow mb-4">Legale</div>
          <h1 className="h-display text-[clamp(32px,4vw,52px)] mb-6">Privacy Policy</h1>
          <p className="text-[14px] text-muted-foreground mb-10">Ultimo aggiornamento: 20 maggio 2026</p>

          <Section title="1. Titolare del trattamento">
            Titolare del trattamento è <strong>MetaCare SRL</strong>, con sede in Codroipo (UD), gestore del marchio MeMindSport. Per qualsiasi richiesta puoi scrivere a{" "}
            <a href="mailto:info@memindsport.it" className="text-brand-green hover:underline">info@memindsport.it</a>.
          </Section>

          <Section title="2. Dati trattati">
            Trattiamo i dati che ci fornisci volontariamente compilando i nostri moduli (questionario di orientamento, form di contatto, iscrizione newsletter): nome, email, telefono, risposte al questionario e contenuto delle comunicazioni. Trattiamo inoltre dati tecnici di navigazione (indirizzo IP, tipo di browser, pagine visitate) raccolti tramite cookie tecnici e di analisi.
          </Section>

          <Section title="3. Finalità e base giuridica">
            I dati sono trattati per: (a) fornirti i servizi richiesti e gestire il rapporto contrattuale; (b) rispondere alle tue richieste di contatto; (c) inviarti, previo consenso, comunicazioni commerciali e newsletter; (d) adempiere a obblighi di legge. La base giuridica è l'esecuzione del contratto, il consenso e l'obbligo legale a seconda della finalità.
          </Section>

          <Section title="4. Conservazione">
            I dati sono conservati per il tempo necessario alle finalità per cui sono raccolti e comunque non oltre 10 anni per i dati contrattuali, 24 mesi per i lead non convertiti, fino a revoca del consenso per la newsletter.
          </Section>

          <Section title="5. Destinatari">
            I dati possono essere comunicati a fornitori che operano come responsabili del trattamento (hosting, email, analytics, gestionale) selezionati per garantire adeguate misure di sicurezza. Non vendiamo dati a terzi.
          </Section>

          <Section title="6. Diritti dell'interessato">
            Hai diritto di accedere, rettificare, cancellare i tuoi dati, limitarne il trattamento, opporti al trattamento e richiederne la portabilità. Per esercitare i tuoi diritti scrivi a{" "}
            <a href="mailto:info@memindsport.it" className="text-brand-green hover:underline">info@memindsport.it</a>. Puoi inoltre proporre reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it).
          </Section>

          <Section title="7. Modifiche">
            Ci riserviamo di aggiornare questa informativa. La data di ultimo aggiornamento è indicata in cima alla pagina.
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

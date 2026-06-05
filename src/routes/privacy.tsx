import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — MeMindSport" },
      { name: "description", content: "Informativa sul trattamento dei dati personali di MeMindSport ai sensi del Regolamento UE 2016/679 (GDPR), con base giuridica specifica per i dati relativi alla salute (Art. 9)." },
      { property: "og:title", content: "Privacy Policy — MeMindSport" },
      { property: "og:description", content: "Come trattiamo i tuoi dati personali, inclusi i dati sanitari ex Art. 9 GDPR." },
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
          <p className="text-[14px] text-muted-foreground mb-10">Ultimo aggiornamento: 5 giugno 2026 · versione 2.0</p>

          <Section title="1. Titolare del trattamento">
            Titolare del trattamento è <strong>MetaCare SRL</strong>, con sede in Codroipo (UD), gestore del marchio MeMindSport. Per qualsiasi richiesta puoi scrivere a{" "}
            <a href="mailto:info@memindsport.it" className="text-brand-green hover:underline">info@memindsport.it</a>.
          </Section>

          <Section title="2. Responsabile della Protezione dei Dati (DPO)">
            Trattando in modo sistematico dati relativi alla salute su larga scala, ai sensi dell'Art. 37(1)(c) GDPR MetaCare SRL ha nominato un Responsabile della Protezione dei Dati. Puoi contattare il DPO all'indirizzo{" "}
            <a href="mailto:dpo@memindsport.it" className="text-brand-green hover:underline">dpo@memindsport.it</a>.
            <br /><br />
            <em className="text-[13px] text-muted-foreground">[Nominativo del DPO da pubblicare a cura di MetaCare SRL una volta formalizzato l'incarico.]</em>
          </Section>

          <Section title="3. Dati trattati">
            <strong>Dati comuni:</strong> nome, email, telefono, dati di contatto, dati di navigazione (indirizzo IP, browser, pagine visitate) raccolti tramite cookie tecnici e — previo consenso — di analisi.
            <br /><br />
            <strong>Dati relativi alla salute (categorie particolari, Art. 9 GDPR):</strong> risposte al questionario di orientamento psicologico, contenuto delle conversazioni con lo psicologo o mental coach attraverso l'area riservata, materiali clinici condivisi, eventuali note del professionista. Questi dati ricevono protezione rafforzata.
          </Section>

          <Section title="4. Categorie particolari di dati — Art. 9 GDPR">
            I dati raccolti tramite il quiz psicometrico, le chat con i professionisti dell'area riservata, i materiali condivisi e le eventuali note cliniche costituiscono <strong>dati relativi alla salute</strong> ai sensi dell'Art. 9(1) GDPR.
            <br /><br />
            <strong>Base giuridica autonoma:</strong> il trattamento è fondato sul <strong>consenso esplicito</strong> dell'interessato ai sensi dell'<strong>Art. 9(2)(a) GDPR</strong>, raccolto separatamente dal consenso generale al trattamento (checkbox dedicato in fase di registrazione e prima del primo invio del questionario).
            <br /><br />
            <strong>Misure di sicurezza rafforzate:</strong> cifratura in transito (TLS) e at-rest, Row-Level Security a livello di database con accesso limitato esclusivamente all'atleta interessato e al professionista assegnato, audit log degli accessi ai dati sensibili (<code>access_log</code>), storage privato per i materiali clinici, autenticazione obbligatoria con verifica password contro database di violazioni note (HIBP).
            <br /><br />
            <strong>Conservazione specifica:</strong> i dati sanitari sono conservati per il tempo necessario all'erogazione del servizio e comunque non oltre <strong>10 anni</strong> dalla cessazione del rapporto, in conformità con la normativa deontologica dell'Ordine degli Psicologi; in caso di revoca del consenso o richiesta di cancellazione i dati sono eliminati entro 30 giorni, fatti salvi gli obblighi legali di conservazione.
            <br /><br />
            <strong>Revoca:</strong> puoi revocare in qualsiasi momento il consenso al trattamento dei dati sanitari accedendo all'area <a href="/i-miei-dati" className="text-brand-green hover:underline">I miei dati</a> o scrivendo a <a href="mailto:dpo@memindsport.it" className="text-brand-green hover:underline">dpo@memindsport.it</a>. La revoca comporta l'interruzione del servizio clinico ma non pregiudica la liceità dei trattamenti effettuati prima della revoca.
          </Section>

          <Section title="5. Finalità e base giuridica dei dati comuni">
            I dati comuni sono trattati per: (a) fornirti i servizi richiesti e gestire il rapporto contrattuale (base: Art. 6(1)(b) — esecuzione contratto); (b) rispondere alle tue richieste di contatto (base: Art. 6(1)(b)); (c) inviarti, previo consenso, comunicazioni commerciali e newsletter (base: Art. 6(1)(a) — consenso); (d) adempiere a obblighi di legge fiscali e contabili (base: Art. 6(1)(c) — obbligo legale).
          </Section>

          <Section title="6. Conservazione (dati comuni)">
            I dati sono conservati per il tempo necessario alle finalità: 10 anni per i dati contrattuali e fiscali, 24 mesi per i lead non convertiti, fino a revoca per la newsletter. Per i dati sanitari vale quanto indicato al punto 4.
          </Section>

          <Section title="7. Destinatari e responsabili esterni">
            I dati possono essere comunicati a fornitori che operano come responsabili del trattamento (Art. 28 GDPR), selezionati per garantire adeguate misure di sicurezza:
            <br /><br />
            • <strong>Lovable Cloud / Supabase</strong> (hosting database, autenticazione, storage) — server UE — DPA sottoscritto.
            <br />
            • <strong>Cloudflare</strong> (CDN, infrastruttura edge) — privacy: <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener" className="text-brand-green hover:underline">cloudflare.com/privacypolicy</a>.
            <br /><br />
            Non vendiamo dati a terzi. Non effettuiamo trasferimenti extra-UE non protetti da clausole contrattuali standard.
          </Section>

          <Section title="8. Diritti dell'interessato">
            Hai diritto di: accedere ai tuoi dati (Art. 15), rettificarli (Art. 16), cancellarli (Art. 17), limitarne il trattamento (Art. 18), riceverli in formato portabile (Art. 20), opporti al trattamento (Art. 21), revocare il consenso in qualsiasi momento. Puoi esercitare i tuoi diritti direttamente dall'area <a href="/i-miei-dati" className="text-brand-green hover:underline">I miei dati</a> o scrivendo a <a href="mailto:privacy@memindsport.it" className="text-brand-green hover:underline">privacy@memindsport.it</a>. Puoi inoltre proporre reclamo al Garante per la protezione dei dati personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener" className="text-brand-green hover:underline">www.garanteprivacy.it</a>).
          </Section>

          <Section title="9. Modifiche">
            Ci riserviamo di aggiornare questa informativa. La data di ultimo aggiornamento e il numero di versione sono indicati in cima alla pagina. In caso di modifiche sostanziali sarai informato via email o tramite notifica nell'area riservata.
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
      <div className="text-[15.5px] leading-[1.75] text-foreground/80">{children}</div>
    </section>
  );
}

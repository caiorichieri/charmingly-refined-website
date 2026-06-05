import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { ManageCookiesLink } from "@/components/site/ManageCookiesLink";

export const Route = createFileRoute("/cookie")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — MeMindSport" },
      { name: "description", content: "Elenco completo dei cookie utilizzati su memindsport.it, con fornitori, finalità, durata e link alle privacy policy." },
      { property: "og:title", content: "Cookie Policy — MeMindSport" },
      { property: "og:description", content: "Quali cookie utilizziamo, da chi, per quanto tempo e perché." },
      { property: "og:url", content: "https://memindsport.it/cookie" },
    ],
    links: [{ rel: "canonical", href: "https://memindsport.it/cookie" }],
  }),
  component: CookiePage,
});

type Row = {
  provider: string;
  privacyUrl?: string;
  purpose: string;
  cookies: string;
  duration: string;
  category: "Necessario" | "Analytics" | "Marketing";
};

const rows: Row[] = [
  {
    provider: "MeMindSport (prima parte)",
    purpose: "Memorizzazione della scelta sui cookie",
    cookies: "memind:cookie-consent:v1",
    duration: "12 mesi",
    category: "Necessario",
  },
  {
    provider: "MeMindSport (prima parte)",
    purpose: "Identificativo anonimo per registrazione consenso",
    cookies: "memind:anon-id",
    duration: "12 mesi",
    category: "Necessario",
  },
  {
    provider: "Supabase (Lovable Cloud)",
    privacyUrl: "https://supabase.com/privacy",
    purpose: "Autenticazione e sessione utente nell'area riservata",
    cookies: "sb-access-token, sb-refresh-token",
    duration: "Sessione / 30 giorni",
    category: "Necessario",
  },
  {
    provider: "Cloudflare",
    privacyUrl: "https://www.cloudflare.com/privacypolicy/",
    purpose: "Sicurezza e protezione DDoS",
    cookies: "__cf_bm",
    duration: "30 minuti",
    category: "Necessario",
  },
];

function CookiePage() {
  return (
    <main className="bg-background">
      <Nav />
      <article className="bg-white py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-[900px] mx-auto">
          <div className="eyebrow mb-4">Legale</div>
          <h1 className="h-display text-[clamp(32px,4vw,52px)] mb-6">Cookie Policy</h1>
          <p className="text-[14px] text-muted-foreground mb-10">Ultimo aggiornamento: 5 giugno 2026</p>

          <Section title="Cosa sono i cookie">
            I cookie sono piccoli file di testo che i siti visitati inviano al browser dell'utente, dove vengono memorizzati per essere ritrasmessi al sito alla visita successiva. Su memindsport.it utilizziamo un sistema di consenso che <strong>blocca preventivamente</strong> tutti i cookie non strettamente necessari fino alla tua scelta esplicita.
          </Section>

          <Section title="Categorie di cookie">
            <strong>Necessari</strong> — indispensabili al funzionamento del sito (autenticazione, sicurezza, memorizzazione delle preferenze sui cookie). Non richiedono consenso ex Art. 122 Codice Privacy.
            <br /><br />
            <strong>Analytics</strong> — statistiche aggregate e anonime di utilizzo. Richiedono consenso preventivo.
            <br /><br />
            <strong>Marketing</strong> — personalizzazione di contenuti e annunci. Richiedono consenso preventivo.
          </Section>

          <Section title="Elenco dei cookie e fornitori">
            <p className="mb-4 text-[14px] text-muted-foreground">
              Allo stato attuale memindsport.it utilizza <strong>esclusivamente cookie tecnici necessari</strong>. Non sono attivi cookie di analisi o marketing di terze parti (Google Analytics, Meta Pixel, ecc.). Nel momento in cui dovessero essere introdotti, la presente tabella sarà aggiornata e l'attivazione sarà subordinata al tuo consenso esplicito.
            </p>
            <div className="overflow-x-auto rounded-xl border border-line">
              <table className="w-full text-[13px]">
                <thead className="bg-off">
                  <tr className="text-left">
                    <th className="px-3 py-2 font-semibold">Fornitore</th>
                    <th className="px-3 py-2 font-semibold">Finalità</th>
                    <th className="px-3 py-2 font-semibold">Cookie</th>
                    <th className="px-3 py-2 font-semibold">Durata</th>
                    <th className="px-3 py-2 font-semibold">Categoria</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-t border-line align-top">
                      <td className="px-3 py-2">
                        {r.privacyUrl ? (
                          <a href={r.privacyUrl} target="_blank" rel="noopener" className="text-brand-green hover:underline">
                            {r.provider}
                          </a>
                        ) : (
                          r.provider
                        )}
                      </td>
                      <td className="px-3 py-2">{r.purpose}</td>
                      <td className="px-3 py-2 font-mono text-[12px]">{r.cookies}</td>
                      <td className="px-3 py-2">{r.duration}</td>
                      <td className="px-3 py-2">{r.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Gestione del consenso">
            Puoi modificare in qualsiasi momento la tua scelta riaprendo il pannello dei cookie:{" "}
            <ManageCookiesLink className="inline text-brand-green hover:underline font-semibold" />
            . Puoi inoltre gestire i cookie direttamente dalle impostazioni del tuo browser; la disabilitazione dei cookie tecnici può compromettere il funzionamento dell'area riservata.
          </Section>

          <Section title="Contatti">
            Per qualsiasi domanda relativa all'utilizzo dei cookie scrivi a{" "}
            <a href="mailto:privacy@memindsport.it" className="text-brand-green hover:underline">privacy@memindsport.it</a> o al DPO all'indirizzo{" "}
            <a href="mailto:info@tavano.it" className="text-brand-green hover:underline">info@tavano.it</a>.
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

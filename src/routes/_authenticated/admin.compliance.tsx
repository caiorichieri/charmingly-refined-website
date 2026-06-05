import { createFileRoute } from "@tanstack/react-router";
import { Download, FileCheck2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/compliance")({
  head: () => ({
    meta: [
      { title: "Compliance — Onboarding fornitori | MeMindSport Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ComplianceChecklistPage,
});

type Section = { title: string; items: string[] };

const sections: Section[] = [
  {
    title: "0. Dati identificativi del fornitore",
    items: [
      "Ragione sociale, sede legale, Paese.",
      "Servizio fornito e categorie di dati trattati (comuni / sanitari Art. 9 / pagamento).",
      "Eventuale trasferimento extra-UE e referente privacy del fornitore.",
    ],
  },
  {
    title: "1. Due diligence preliminare",
    items: [
      "Verificate garanzie ex Art. 28(1) GDPR (ISO 27001, SOC 2, codici di condotta).",
      "Archiviata privacy policy del fornitore.",
      "Ubicazione server verificata (preferibilmente UE/SEE).",
      "Se extra-UE: Clausole Contrattuali Standard 2021/914 + Transfer Impact Assessment.",
      "Per fornitori USA: verificata adesione al Data Privacy Framework.",
    ],
  },
  {
    title: "2. Sottoscrizione DPA (Art. 28 GDPR)",
    items: [
      "Richiesto al fornitore il template DPA (o proposto template MetaCare).",
      "DPA contiene oggetto, durata, natura, finalità, tipi di dati, categorie interessati, obblighi del Responsabile.",
      "Sub-responsabili autorizzati (autorizzazione generale o specifica).",
      "Diritto di audit del Titolare e notifica data breach entro 24–72h.",
      "Clausola restituzione/cancellazione dati a fine rapporto.",
      "DPA firmato da entrambe le parti e archiviato in /Legale/DPA/<fornitore>/.",
    ],
  },
  {
    title: "3. Valutazione rischio & DPIA (Art. 35)",
    items: [
      "Valutato se serve DPIA (alto rischio, dati sanitari su larga scala, profilazione, monitoraggio sistematico).",
      "Se sì: DPIA completata e archiviata PRIMA dell'attivazione.",
      "Per dati sanitari: verificata base giuridica del trasferimento (consenso esplicito Art. 9(2)(a)).",
      "Parere del DPO documentato via email.",
    ],
  },
  {
    title: "4. Aggiornamento Privacy Policy",
    items: [
      "Fornitore aggiunto alla sezione 7 di src/routes/privacy.tsx (nome + servizio + ubicazione + link privacy).",
      "Aggiornato numero di versione e data in cima al documento.",
      "Se cookie/analytics: aggiornata anche src/routes/cookie.tsx.",
      "Se modifica sostanziale: notifica via email agli utenti registrati.",
    ],
  },
  {
    title: "5. Aggiornamento Registro del Trattamento (Art. 30)",
    items: [
      "Nuova riga al Registro (foglio 'Responsabili esterni').",
      "Compilati: fornitore, dati, finalità, base giuridica, durata, misure di sicurezza, trasferimenti, riferimento DPA.",
      "Aggiornata data di ultima revisione del Registro.",
    ],
  },
  {
    title: "6. CMP / Cookie Banner (se applicabile)",
    items: [
      "Nuova categoria/voce nel ConsentContext se il fornitore installa cookie/script.",
      "Script caricato condizionalmente via <ConditionalScript> (blocco prima del consenso).",
      "Test: il banner mostra il fornitore e lo script non parte prima dell'accettazione.",
    ],
  },
  {
    title: "7. Misure tecniche e organizzative",
    items: [
      "Credenziali in password manager aziendale (mai in chiaro nel codice).",
      "Accesso minimo necessario (least privilege), MFA attiva sull'account amministrativo.",
      "Alert su accessi anomali / export massivi.",
    ],
  },
  {
    title: "8. Attivazione e monitoraggio",
    items: [
      "GO/NO-GO firmato dal DPO (Dott. R.A. Tavano — info@tavano.it).",
      "Data di attivazione registrata e revisione annuale a calendario.",
      "Documentazione archiviata in /Legale/Fornitori/<nome>/.",
    ],
  },
];

function ComplianceChecklistPage() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink flex items-center gap-3">
            <FileCheck2 className="text-brand-green" size={28} />
            Onboarding fornitori — Checklist GDPR
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Da completare <strong>prima</strong> di attivare qualsiasi nuovo fornitore che tratti dati personali per conto di MetaCare SRL.
            Conforme agli artt. 28, 30 e 35 GDPR.
          </p>
        </div>
        <a
          href="/checklist-onboarding-fornitori-v1.pdf"
          download
          className="inline-flex items-center gap-2 bg-brand-green text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:brightness-110 transition"
        >
          <Download size={16} /> Scarica PDF stampabile
        </a>
      </div>

      <div className="bg-amber-50 border border-amber-200 text-amber-900 text-sm rounded-lg p-4 mb-6">
        <strong>Procedura obbligatoria.</strong> Nessun fornitore può trattare dati personali prima della firma del DPA,
        dell'aggiornamento di Privacy Policy + Registro del Trattamento e dell'approvazione del DPO.
      </div>

      <div className="space-y-4">
        {sections.map((s) => (
          <section key={s.title} className="bg-white border border-line rounded-xl p-5">
            <h2 className="font-display font-bold text-ink text-[17px] mb-3">{s.title}</h2>
            <ul className="space-y-2">
              {s.items.map((it) => (
                <li key={it} className="flex items-start gap-3 text-sm text-foreground/85">
                  <input type="checkbox" className="mt-1 h-4 w-4 accent-brand-green" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-8 text-xs text-muted-foreground border-t border-line pt-4">
        DPO: Dott. Rolando Alberto Tavano — <a className="text-brand-green hover:underline" href="mailto:info@tavano.it">info@tavano.it</a>
        <br />
        MetaCare SRL — Via Pola 7, 33033 Codroipo (UD) — C.F./P.IVA 03102350307 — Aut. Sanitaria n. 4710 del 13/01/2026
      </div>
    </div>
  );
}

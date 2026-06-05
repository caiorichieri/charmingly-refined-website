# Piano: Conformità GDPR — 4 interventi

Il feedback ricevuto è corretto e prioritario. Ecco la mia analisi punto per punto e il piano d'azione.

---

## 1. IMMEDIATO — CMP con blocco preventivo dei cookie

**Stato attuale:** il `CookieBanner.tsx` esistente raccoglie il consenso e lo salva in `cookie_consents`, ma **non blocca realmente nulla**: è un banner "cosmetico". Al momento però il sito **non carica script di terze parti** (no Google Analytics, no Meta Pixel, no Hotjar, no YouTube embed con cookie). Quindi tecnicamente **non siamo in violazione diretta oggi**, ma lo saremmo nel momento in cui aggiungiamo qualsiasi analytics.

**Due strade:**

- **A) Soluzione interna (consigliata ora)**: trasformare il banner esistente in un vero CMP gate. Centralizziamo il consenso in un `ConsentProvider` (React context + `localStorage`) che espone `hasConsent('analytics' | 'marketing')`. Tutti gli script di terze parti vengono caricati **solo** dopo il consenso, tramite un componente `<ConditionalScript category="analytics" src="..." />`. Aggiungiamo anche un link "Gestisci cookie" nel Footer per riaprire il banner. **Costo: 0 €, integrato nel design esistente.**

- **B) CMP esterno (Iubenda / Cookiebot / Usercentrics)**: integrazione di uno script di terze parti certificato IAB TCF. Vantaggio: certificazione ufficiale, aggiornamento automatico, scan periodico cookie. Svantaggio: abbonamento (Iubenda ~29 €/anno starter, Cookiebot da 12 €/mese), e ironicamente lo stesso CMP setta cookie.

**Scelta proposta:** **A** ora (siamo coerenti perché non abbiamo terze parti attive), con possibilità di passare a **B** quando attiveremo Google Analytics 4 o Meta Pixel.

---

## 2. URGENTE — Privacy Policy: dati sanitari ex Art. 9

Aggiornare `src/routes/privacy.tsx` aggiungendo una sezione dedicata **"Categorie particolari di dati (Art. 9 GDPR)"** che dichiari espressamente:

- I dati raccolti tramite quiz, chat con psicologo, materiali condivisi e note cliniche sono **dati relativi alla salute** ai sensi dell'Art. 9(1) GDPR.
- Base giuridica autonoma: **consenso esplicito** dell'interessato ex Art. 9(2)(a), separato dal consenso generale al trattamento.
- Misure di sicurezza rafforzate: cifratura at-rest, RLS, audit log (`access_log`), accesso limitato al terapeuta assegnato.
- Periodo di conservazione specifico per dati sanitari.
- Diritto di revoca del consenso in qualsiasi momento.

**Modifica funzionale richiesta:** nel form di registrazione atleta + nel primo accesso al quiz, aggiungere **checkbox separato** "Acconsento al trattamento dei miei dati relativi alla salute (Art. 9 GDPR)" — registrato in `user_consents` con `document = 'health_data_art9'` e versione.

---

## 3. IMPORTANTE — Cookie Policy: fornitori e link

Aggiornare `src/routes/cookie.tsx` sostituendo la sezione generica "Cookie di analisi" con una **tabella esplicita** dei cookie effettivamente impostati. Stato attuale del progetto:

| Fornitore | Finalità | Cookie | Durata | Privacy Policy |
|---|---|---|---|---|
| MeMindSport (prima parte) | Sessione autenticata | `sb-*` | sessione | — |
| MeMindSport (prima parte) | Consenso cookie | `memind:cookie-consent:v1` | 12 mesi | — |
| Supabase (Lovable Cloud) | Backend auth | `sb-access-token`, `sb-refresh-token` | sessione | https://supabase.com/privacy |

**Quando aggiungeremo analytics**, la tabella crescerà (Google Analytics, Meta, ecc.) con link alle rispettive privacy policy. Per ora documentiamo lo stato reale: nessun cookie di terza parte attivo.

---

## 4. RACCOMANDATO — Valutazione DPO e registro del trattamento

**DPO obbligatorio (Art. 37 GDPR)** quando:
- Attività core consistono nel **trattamento su larga scala di dati ex Art. 9** (salute) → **questo è il vostro caso** ✅
- Monitoraggio sistematico su larga scala.

**Conclusione:** la nomina del **DPO è obbligatoria**, non opzionale. Non posso nominarlo io — deve essere una decisione di MetaCare SRL (figura interna formata o consulente esterno, costo tipico 1.500–4.000 €/anno).

**Cosa posso fare nel codice:**
- Aggiungere sezione "Responsabile della Protezione dei Dati (DPO)" in Privacy Policy con placeholder `[Da nominare — contattare privacy@memindsport.it]` o, se mi date il nominativo, lo inserisco.
- Generare un **template PDF del Registro del Trattamento** (Art. 30 GDPR) precompilato con le attività di MeMindSport (registrazione atleti, quiz salute, chat clinica, materiali, ecc.) come artefatto separato in `/mnt/documents/`. Documento interno, non pubblico.

---

## Riepilogo modifiche al codice

```text
NUOVI FILE
  src/contexts/ConsentContext.tsx        # provider centrale consenso
  src/components/site/ConditionalScript.tsx  # carica script solo dopo consenso
  src/components/site/ManageCookiesLink.tsx  # link riapri banner nel Footer

MODIFICATI
  src/components/site/CookieBanner.tsx   # usa ConsentContext, blocco reale
  src/components/site/Footer.tsx         # aggiunge "Gestisci cookie"
  src/routes/__root.tsx                  # avvolge in <ConsentProvider>
  src/routes/privacy.tsx                 # sezione Art. 9 + DPO
  src/routes/cookie.tsx                  # tabella fornitori reale
  src/routes/auth.tsx                    # checkbox consenso Art. 9 in signup
  src/components/quiz/QuizModal.tsx      # checkbox Art. 9 prima del primo quiz

MIGRAZIONE DB
  - nessuna nuova tabella; user_consents già supporta document='health_data_art9'

ARTEFATTI (in /mnt/documents/)
  - MeMindSport_Registro_Trattamento.pdf (template Art. 30)
  - MeMindSport_Privacy_Policy_v2.pdf (versione aggiornata stampabile)
```

---

## Domande prima di partire

1. **DPO**: avete già nominato qualcuno (nome + email da inserire), oppure metto placeholder?
2. **Analytics**: confermate che oggi **non** è attivo alcun tracker di terza parte (Google Analytics, Meta Pixel, Hotjar, ecc.)? Se ne avete in mente uno da attivare a breve, conviene predisporre subito l'integrazione CMP.
3. **Cookie banner**: andiamo con soluzione interna (A) o volete che predisponga l'integrazione di Iubenda/Cookiebot (B)?

Confermami questi 3 punti e procedo con l'implementazione.

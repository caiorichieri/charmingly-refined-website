
# Piano di sviluppo — Portale MeMind Sport

## Stato attuale (riepilogo)

**Già fatto:** sito pubblico completo, auth (email + Google), area admin completa (CRUD blog/eventi/piani/percorsi/testimonianze/FAQ/quiz/media/utenti), sistema ruoli sicuro (`admin`, `therapist`), email transazionali, RLS su tutte le tabelle, pagine legali base, multi-dominio attivo.

**Solo gate, contenuto vuoto:** `/area-terapeuta`.

**Mancante:** area atleta, funzioni psicologi, GDPR dati sensibili, audit tecnico.

---

## Cosa costruire (4 blocchi)

### Blocco 1 — Area Atleta completa
Nuovo ruolo `athlete` (default per chi si registra senza essere admin/therapist).

Pagine sotto `/area-atleta/*` (gate authenticated + ruolo athlete):
- **Dashboard**: panoramica personale, ultimo quiz, prossime sessioni, materiali nuovi
- **Il mio profilo**: dati personali, risultati quiz salvati con grafico ragnatela e mappa del campo
- **I miei materiali**: documenti/video condivisi dal terapeuta assegnato
- **Messaggi**: chat con il proprio terapeuta
- **Prenotazioni**: vista calendario terapeuta + booking sessione (placeholder se non si vuole subito booking)
- **I miei dati (GDPR)**: export JSON dei dati + richiesta cancellazione account

### Blocco 2 — Area Psicologi (funzioni prioritarie)
Espansione di `/area-terapeuta`:
- **Lista atleti assegnati**: tabella con ultimo accesso, ultimo quiz, ultimo messaggio
- **Scheda atleta**: anagrafica + tutti i risultati quiz (ragnatela, mappa del campo, storico)
- **Messaggistica 1-a-1**: chat realtime con ogni atleta assegnato
- **Condivisione materiali**: upload file (PDF, video, immagini) destinati a un singolo atleta, con scadenza opzionale
- **Note sessione** (cifrate): note private del terapeuta sull'atleta

Sezione admin nuova: **assegnazione atleta ↔ terapeuta** (in `/admin/users` o nuova `/admin/assegnazioni`).

### Blocco 3 — GDPR completo per dati sensibili
Le note cliniche e i risultati quiz sono dati sanitari/psicologici → trattamento rafforzato.

- **Cookie banner** con consent management (necessari / analytics / marketing) + tabella `cookie_consents`
- **Registro consensi**: ogni atleta accetta esplicitamente trattamento dati sanitari al primo login (versione + timestamp + IP) → tabella `user_consents`
- **Cifratura note cliniche**: campo `notes_encrypted` con pgcrypto (chiave server-side), decifrato solo lato server function per il terapeuta autorizzato
- **Audit log**: tabella `access_log` che registra ogni accesso a dati sensibili (chi, quando, quale atleta) — solo admin la legge
- **Export dati utente**: server function che esporta tutto in JSON per l'atleta
- **Cancellazione account**: workflow soft-delete + hard-delete dopo 30gg
- **Aggiornamento privacy policy**: testo aggiornato che cita base giuridica art. 9 GDPR (consenso esplicito) e ruolo del DPO se nominato

### Blocco 4 — Audit tecnico (documento consegnabile)
Report PDF/MD consegnato al cliente, **nessun nuovo codice da scrivere**:
- Stack tecnologico (TanStack Start, React 19, Supabase, Cloudflare Workers)
- Architettura sicurezza (RLS, ruoli, cifratura, audit log)
- SEO check (Lighthouse, Core Web Vitals, sitemap, schema.org)
- Performance (bundle size, immagini, lazy loading)
- Conformità GDPR (mappatura dati, base giuridica, misure tecniche)
- Backup e disaster recovery (gestiti da Lovable Cloud/Supabase)
- Lista dipendenze e licenze
- Roadmap manutenzione

---

## Ordine di consegna consigliato (3 step)

| Step | Cosa | Stima |
|------|------|-------|
| **1** | Blocco 1 (Area Atleta) + ruolo `athlete` + assegnazione atleta↔terapeuta in admin | 1 iterazione |
| **2** | Blocco 2 (funzioni psicologi: scheda atleta + messaggistica + materiali + note cifrate) | 1-2 iterazioni |
| **3** | Blocco 3 (GDPR completo) + Blocco 4 (audit tecnico documento) | 1 iterazione |

---

## Dettagli tecnici (riferimento)

**Nuove tabelle:**
- `athlete_assignments` (athlete_id, therapist_id, assigned_at, active)
- `messages` (sender_id, recipient_id, content, read_at, created_at) + Realtime
- `shared_materials` (therapist_id, athlete_id, storage_path, title, expires_at)
- `clinical_notes` (therapist_id, athlete_id, notes_encrypted bytea, created_at)
- `user_consents` (user_id, consent_type, version, ip, accepted_at)
- `cookie_consents` (session_id/user_id, categories jsonb, version)
- `access_log` (actor_id, action, target_user_id, resource, created_at)

**Estensioni DB:**
- enum `app_role`: aggiungere `'athlete'`
- pgcrypto per cifratura note
- Realtime su `messages`

**Storage:** nuovo bucket privato `clinical-materials` con RLS scoped per assegnazione.

**Server functions chiave** (`createServerFn` + `requireSupabaseAuth`):
- `getAssignedAthletes` / `getMyTherapist`
- `sendMessage` / `getThread`
- `uploadMaterial` / `getMaterials`
- `writeNote` (cifra) / `readNote` (decifra, solo terapeuta assegnato + log)
- `exportMyData` / `requestAccountDeletion`

**RLS:** ogni tabella sensibile filtrata per `auth.uid()` + `has_role()` + check assegnazione attiva.

---

## Cosa NON è in questo piano (da confermare in futuro)
- Sistema booking sessioni completo con calendario sincronizzato (Google Calendar)
- Video sessioni integrate (Jitsi/Daily)
- Pagamenti per piani in autoservizio (Stripe)
- App mobile

Fammi sapere se il piano è ok o se vuoi modificare priorità / scope prima di partire con lo Step 1.

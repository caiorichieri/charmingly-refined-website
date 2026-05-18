# Piano: Area Admin & Terapeuta

## 1. Backend — Lovable Cloud
Attivo Lovable Cloud (database + auth, nessun account esterno) e configuro Google sign-in oltre a email/password.

## 2. Schema database
Tabelle nuove con Row Level Security:

- **`app_role`** (enum): `admin`, `therapist`
- **`user_roles`** — collega utente↔ruolo (tabella separata per sicurezza, mai sui profili)
- **`profiles`** — nome, avatar, bio, creato al signup via trigger
- **`blog_posts`** — title, slug, excerpt, content, cover, author, published, dates
- **`plans`** — nome, prezzo, periodicità, descrizione, features (jsonb), badge "più scelto", ordine
- **`paths`** — i percorsi/aree mentali (titolo, descrizione, icona, ordine)
- **`testimonials`** — autore, ruolo, contenuto, rating, foto, approvato
- **`faqs`** — domanda, risposta, ordine
- **`media_assets`** — chiave (es. `hero`, `photo-break`), url, alt — per swap immagini hero

Funzione `has_role(user_id, role)` security-definer per le policy.

## 3. Bootstrap primo admin
Trigger sul signup: l'email **caiorichieri@gmail.com** riceve automaticamente il ruolo `admin` al primo accesso. Tutti gli altri nuovi utenti partono senza ruolo.

## 4. Frontend — Autenticazione
- **`/auth`** — login + registrazione, email/password + bottone Google
- Hook `useAuth` per stato sessione globale
- Listener `onAuthStateChange` nel root
- Logout dal menu utente

## 5. Frontend — Area Admin (`/admin/*`)
Layout con sidebar (gate: solo `admin`):

- `/admin` — dashboard con conteggi rapidi
- `/admin/blog` — lista + crea/modifica/elimina articoli (rich editor semplice)
- `/admin/plans` — gestisci piani, prezzi, feature, toggle "più scelto"
- `/admin/paths` — percorsi mentali (CRUD + riordino)
- `/admin/testimonials` — approva/modifica/pubblica
- `/admin/faqs` — CRUD + riordino
- `/admin/media` — upload/sostituzione immagini hero
- `/admin/users` — vedi utenti, assegna/revoca ruolo terapeuta

## 6. Frontend — Area Terapeuta (`/area-terapeuta`)
Solo gate di accesso + pagina "in arrivo" come placeholder. Costruiremo le feature interne dopo.

## 7. Sito pubblico
Le sezioni Hero, Blog, Prezzi, Pilastri (percorsi), Testimonial, FAQ leggono dal database invece dei dati statici. Seed iniziale popola le tabelle con i contenuti attuali del sito così non si perde nulla visivamente.

## 8. Navigazione
- Pulsante "Accedi" nel header
- Quando autenticato: menu utente con link a "Dashboard admin" (se admin) o "Area terapeuta" (se therapist) + logout

---

## Dettagli tecnici (per riferimento)
- Stack: TanStack Start + Supabase via Lovable Cloud
- Auth: server functions con `requireSupabaseAuth`, RLS attivo su tutte le tabelle
- Admin write: policy `has_role(auth.uid(),'admin')`
- Public read: policy aperta su contenuti pubblicati (`published=true`, `approved=true`)
- Google OAuth: configurato via `supabase--configure_social_auth`
- Storage bucket pubblico `media` per upload immagini

## Ordine di consegna suggerito
Data la portata propongo di consegnare in **2 step**:

1. **Step 1 (questa risposta)**: Cloud + schema + auth + `/auth` + `/admin` shell + **Blog admin** + **Plans admin** funzionanti, con il sito pubblico che legge blog e prezzi dal DB. Seed dei contenuti attuali.
2. **Step 2 (prossimo messaggio)**: percorsi, testimonianze, FAQ, media, gestione terapeuti, area terapeuta placeholder.

Confermi questo approccio in 2 step? Se vuoi tutto in una volta lo faccio comunque, ma il risultato sarà più lungo da verificare.

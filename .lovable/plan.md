## Obiettivo

Creare una sezione pubblica "Ambasciatori" su memindsport.it che racconta le personalità che usano MeMindSport e ne diventano testimoni. Primo profilo: **Piergiorgio Iacuzzo**. La struttura prevede già spazio per nuovi ambasciatori in futuro, gestibili dall'admin senza modifiche al codice.

## Esperienza pubblica

### 1. Pagina indice `/ambasciatori`
- Hero con eyebrow "Ambasciatori MeMindSport", titolo grande ("Persone che allenano la mente, e portano il metodo nel mondo") e paragrafo introduttivo.
- Griglia di card ambasciatori (oggi 1, predisposta per N): foto ritaglio, nome, ruolo/territorio, 1 frase, CTA "Scopri la storia →" verso la pagina dettaglio.
- Sezione finale "Vuoi diventare ambasciatore?" con CTA WhatsApp / contatti.

### 2. Pagina dettaglio `/ambasciatori/$slug` (es. `/ambasciatori/piergiorgio-iacuzzo`)
Costruita dal record DB, con sezioni opzionali (vengono mostrate solo se compilate):
- Hero con foto cutout, nome, città/regione, lista dei ruoli (Presidente, Imprenditore, Ambasciatore…), CTA al sito personale.
- Numeri chiave (es. "456 atleti tesserati", "5.000 persone coinvolte") — array di stat.
- "Le realtà che rappresenta" — griglia di organizzazioni con logo + link.
- "Onorificenze e riconoscimenti" — card con immagine, titolo, ente, descrizione.
- Blocco "Ambasciatore MeMindSport" con quote/manifesto del perché.
- Biografia testuale.
- Valori / principi (4 colonne).
- Link al sito ufficiale + social.
- SEO: `head()` per pagina con title, description, og:image (foto ambasciatore).

### 3. Voce di navigazione
Aggiungere "Ambasciatori" nei link del `Nav.tsx` (tra "I professionisti" e "Ambienti immersivi") e una sezione/menzione nella home con link.

## Gestione (admin)

Nuova voce sidebar admin **"Ambasciatori"** (`/admin/ambassadors`) con:
- Lista ambasciatori (foto, nome, slug, pubblicato sì/no, ordine).
- Form "Nuovo / Modifica" con campi:
  - Dati base: `slug`, `full_name`, `tagline`, `location`, `bio` (textarea ricca/markdown semplice), `published`, `display_order`.
  - Media: `photo_url` (cutout), `cover_url` (opzionale), `website_url`, `social_links` (json).
  - **Ruoli** (lista ripetibile): `label` + `organization`.
  - **Stats** (lista ripetibile): `value` + `label`.
  - **Organizzazioni** (lista ripetibile): `name`, `description`, `logo_url`, `url`.
  - **Onorificenze** (lista ripetibile): `title`, `issuer`, `year`, `image_url`, `description`.
  - **Valori** (lista ripetibile): `title` + `body`.
  - **Quote MeMindSport**: `quote_text`.
- Pulsanti: Salva, Anteprima (link a `/ambasciatori/$slug?preview=1`), Elimina.
- Upload immagini riusa bucket `media` già esistente.

## Modello dati (technical)

Nuova tabella `public.ambassadors`:
- `id uuid pk`, `slug text unique not null`, `full_name text not null`, `tagline text`, `location text`, `bio text`, `photo_url text`, `cover_url text`, `website_url text`, `social_links jsonb default '{}'`, `roles jsonb default '[]'`, `stats jsonb default '[]'`, `organizations jsonb default '[]'`, `honors jsonb default '[]'`, `values jsonb default '[]'`, `quote_text text`, `published boolean default false`, `display_order int default 0`, `created_at`, `updated_at`.
- GRANT: `SELECT` ad `anon` + `authenticated` (lista pubblica), `INSERT/UPDATE/DELETE` ad `authenticated` ristretto via RLS, `ALL` a `service_role`.
- RLS:
  - SELECT pubblico solo dove `published = true` (admin vede tutto via policy `has_role(auth.uid(), 'admin')`).
  - INSERT/UPDATE/DELETE solo se `has_role(auth.uid(), 'admin')`.
- Trigger `set_updated_at` già esistente.

Tutti i blocchi ripetibili stanno in JSONB per restare flessibili senza creare 6 tabelle figlie — l'editor admin garantisce la forma con piccoli sub-form tipizzati.

## File da creare/modificare

- Migrazione SQL: tabella `ambassadors` + grants + RLS + trigger.
- `src/routes/ambasciatori.index.tsx` — lista pubblica.
- `src/routes/ambasciatori.$slug.tsx` — dettaglio pubblico.
- `src/routes/_authenticated/admin.ambassadors.tsx` — gestione (lista + form).
- `src/components/site/Nav.tsx` — aggiunta link.
- `src/routes/_authenticated/admin.tsx` — nuova voce sidebar.

## Seed iniziale

Pre-popolare il primo record **Piergiorgio Iacuzzo** dall'admin (non da migration, così resta modificabile): immagini riprese dal suo sito (`piergiorgio-cutout.png`, loghi Atletica 2000 / Codroipo C'è / Fondazione Sport City, medaglia paralimpica), testi e numeri presi da piergiorgioiacuzzo.it, link `https://www.piergiorgioiacuzzo.it`.

## Domande aperte

1. Vuoi che la lista ambasciatori appaia anche come sezione nella **home** (es. dopo le testimonianze)? Default proposto: sì, una striscia compatta con 3 card max + link "Tutti gli ambasciatori →".
2. Il primo seed lo creo io subito con i dati del sito di Piergiorgio, oppure preferisci compilarlo tu dall'admin?


-- Pulizia e seed delle 12 domande ufficiali del Profiler MeMindSport
DELETE FROM public.quiz_responses;
DELETE FROM public.quiz_options;
DELETE FROM public.quiz_questions;

-- D01 DIALOGO INTERNO
WITH q AS (INSERT INTO public.quiz_questions (text, display_order, published) VALUES ('Dopo un errore in gara, cosa si attiva immediatamente nella tua testa?', 1, true) RETURNING id)
INSERT INTO public.quiz_options (question_id, text, profile_tag, display_order)
SELECT q.id, t.text, t.tag, t.ord FROM q, (VALUES
  ('Mi critico subito: rivedo l''errore, capisco dove ho sbagliato e mi dico che non avrei dovuto.', 'perfezionatore', 1),
  ('Mi preoccupo per come andrà il resto: lo scenario si fa buio, comincio a temere altri errori.', 'anticipatore', 2),
  ('Esplodo — rabbia, frustrazione, a volte un gesto o una parola che non riesco a trattenere.', 'intenso', 3),
  ('Mi convinco di non essere abbastanza: l''errore conferma che gli altri sono più forti di me.', 'confermatore', 4),
  ('Sento il corpo prima della testa: tensione, battito, calore — il fisico risponde prima che io pensi.', 'percettivo', 5),
  ('Non succede quasi niente: una sorta di indifferenza piatta, come se non importasse davvero.', 'recuperante', 6)
) AS t(text, tag, ord);

-- D02 PRE-GARA - PENSIERI
WITH q AS (INSERT INTO public.quiz_questions (text, display_order, published) VALUES ('Nei giorni prima di una competizione importante, com''è la tua mente?', 2, true) RETURNING id)
INSERT INTO public.quiz_options (question_id, text, profile_tag, display_order)
SELECT q.id, t.text, t.tag, t.ord FROM q, (VALUES
  ('Rivedo i dettagli tecnici continuamente: voglio che ogni gesto sia preciso, controllato, perfetto.', 'perfezionatore', 1),
  ('Giro scenari nella testa — anche di notte. Anticipo problemi, costruisco piani, non riesco a spegnere.', 'anticipatore', 2),
  ('Sono carico/a: l''energia sale, le emozioni si intensificano, sento il bisogno di sfogare la tensione.', 'intenso', 3),
  ('Mi confronto con gli avversari e mi chiedo se sono pronto/a — spesso la risposta mi spaventa.', 'confermatore', 4),
  ('Il corpo parla già: stomaco chiuso, sonno leggero, tensioni muscolari che arrivano giorni prima.', 'percettivo', 5),
  ('Mi sento distante dalla gara: fatico a trovare motivazione, ci vado perché devo, non perché voglio.', 'recuperante', 6)
) AS t(text, tag, ord);

-- D03 SONNO PRE-GARA
WITH q AS (INSERT INTO public.quiz_questions (text, display_order, published) VALUES ('Come dormi la notte prima di una gara importante?', 3, true) RETURNING id)
INSERT INTO public.quiz_options (question_id, text, profile_tag, display_order)
SELECT q.id, t.text, t.tag, t.ord FROM q, (VALUES
  ('Poco e male: la mente ripassa ancora, rivedo la strategia, non riesce a fermarsi.', 'perfezionatore', 1),
  ('Mi sveglio più volte: pensieri ricorrenti, scenari negativi, mi alzo stanco/a come prima.', 'anticipatore', 2),
  ('Abbastanza, ma mi sveglio teso/a e già acceso/a — il corpo è pronto ad esplodere dal mattino.', 'intenso', 3),
  ('Fatico ad addormentarmi per i pensieri su come andrà, su cosa pensano di me, sul confronto.', 'confermatore', 4),
  ('Molto male: il corpo non si calma, sento tensioni fisiche, a volte nausea o pesantezza.', 'percettivo', 5),
  ('Dormo, ma non recupero: mi sveglio uguale a prima, stanco/a in modo cronico e senza spiegazione.', 'recuperante', 6)
) AS t(text, tag, ord);

-- D04 CORPO E ATTIVAZIONE
WITH q AS (INSERT INTO public.quiz_questions (text, display_order, published) VALUES ('Come vivi i segnali fisici del tuo corpo (battito, tensione, respiro) prima della performance?', 4, true) RETURNING id)
INSERT INTO public.quiz_options (question_id, text, profile_tag, display_order)
SELECT q.id, t.text, t.tag, t.ord FROM q, (VALUES
  ('Li voglio sotto controllo: se qualcosa non è come deve essere, cerco di correggere e gestire tutto.', 'perfezionatore', 1),
  ('Li monitoro, ma soprattutto mi chiedo cosa significano per come andrà la gara.', 'anticipatore', 2),
  ('Li sento forti e li uso: mi caricano, non li leggo come pericolo ma come carburante.', 'intenso', 3),
  ('A volte mi tradiscono: tremano le mani, la voce si incrina — e temo che gli altri se ne accorgano.', 'confermatore', 4),
  ('Li sento moltissimo e con precisione: ogni variazione mi preoccupa, li leggo come segnali di allarme.', 'percettivo', 5),
  ('Li sento poco o non li sento più: c''è una sorta di spegnimento, come se il corpo fosse lontano.', 'recuperante', 6)
) AS t(text, tag, ord);

-- D05 GESTIONE DELL'ERRORE
WITH q AS (INSERT INTO public.quiz_questions (text, display_order, published) VALUES ('Quanto tempo impiega un errore significativo in gara a smettere di occupare la tua mente?', 5, true) RETURNING id)
INSERT INTO public.quiz_options (question_id, text, profile_tag, display_order)
SELECT q.id, t.text, t.tag, t.ord FROM q, (VALUES
  ('Molto: lo analizzo mentre la gara continua, ci torno dopo, lo rimugino anche a casa.', 'perfezionatore', 1),
  ('Per il resto della gara: l''errore apre uno scenario negativo che è difficile da chiudere.', 'anticipatore', 2),
  ('Reagisco subito e con intensità — poi mi calmo, ma mi costa energia e spesso pago il prezzo dopo.', 'intenso', 3),
  ('Mi abbatte: l''errore conferma che non sono all''altezza e cala la fiducia per tutto il resto.', 'confermatore', 4),
  ('Il corpo non dimentica: rimango teso/a, sento ancora la traccia fisica dell''errore a lungo.', 'percettivo', 5),
  ('Non mi tocca quasi: non perché sono forte mentalmente, ma perché non mi importa abbastanza.', 'recuperante', 6)
) AS t(text, tag, ord);

-- D06 MOTIVAZIONE
WITH q AS (INSERT INTO public.quiz_questions (text, display_order, published) VALUES ('Cosa ti spinge ancora a fare questo sport?', 6, true) RETURNING id)
INSERT INTO public.quiz_options (question_id, text, profile_tag, display_order)
SELECT q.id, t.text, t.tag, t.ord FROM q, (VALUES
  ('Il desiderio di migliorare, di fare bene, di essere preciso/a — è parte di chi sono.', 'perfezionatore', 1),
  ('La struttura e il senso che dà alla mia vita, anche se l''ansia pre-gara pesa sempre di più.', 'anticipatore', 2),
  ('L''adrenalina, la sfida, il confronto — senza quella carica emotiva non saprei cosa fare.', 'intenso', 3),
  ('Il riconoscimento: sentire che valgo, che gli altri mi stimano, che il mio impegno si vede.', 'confermatore', 4),
  ('Il piacere fisico del gesto: quando il corpo funziona bene, mi sento vivo/a e a posto.', 'percettivo', 5),
  ('Continuo, ma faccio fatica a rispondere: la motivazione di prima si è esaurita, non so bene perché.', 'recuperante', 6)
) AS t(text, tag, ord);

-- D07 FOCUS E ATTENZIONE
WITH q AS (INSERT INTO public.quiz_questions (text, display_order, published) VALUES ('Dove va la tua attenzione durante la performance quando qualcosa non va come previsto?', 7, true) RETURNING id)
INSERT INTO public.quiz_options (question_id, text, profile_tag, display_order)
SELECT q.id, t.text, t.tag, t.ord FROM q, (VALUES
  ('Sull''errore: lo analizzo al volo, cerco di capire e correggere — ma intanto perdo il filo della gara.', 'perfezionatore', 1),
  ('Sul futuro: "Cosa succederà adesso? Come andrà a finire?" — lo scenario prende tutto lo spazio.', 'anticipatore', 2),
  ('Sull''emozione: la frustrazione o la rabbia occupano tutto e faccio fatica a tornare al compito.', 'intenso', 3),
  ('Su di me e sugli altri: "Non sono bravo/a", "Gli altri stanno facendo meglio di me".', 'confermatore', 4),
  ('Sul corpo: sento ogni segnale fisico amplificato — battito, fiato, tensioni — e questo mi distrae.', 'percettivo', 5),
  ('Da nessuna parte in particolare: c''è una sorta di vuoto, un distacco che rende tutto opaco.', 'recuperante', 6)
) AS t(text, tag, ord);

-- D08 AUTOEFFICACIA E GIUDIZIO
WITH q AS (INSERT INTO public.quiz_questions (text, display_order, published) VALUES ('Quanto pesa su di te il giudizio dell''allenatore, dei compagni o del pubblico?', 8, true) RETURNING id)
INSERT INTO public.quiz_options (question_id, text, profile_tag, display_order)
SELECT q.id, t.text, t.tag, t.ord FROM q, (VALUES
  ('Pesa come feedback: ho bisogno di sapere se sto facendo bene per calibrare la mia performance.', 'perfezionatore', 1),
  ('Molto quando è incerto: non sapere cosa pensano di me alimenta i miei scenari peggiori.', 'anticipatore', 2),
  ('Mi accende: uno sguardo o una parola possono caricarmi o farmi esplodere all''istante.', 'intenso', 3),
  ('Moltissimo: ho bisogno di sentirmi approvato/a per sentirmi sicuro/a e capace di performare.', 'confermatore', 4),
  ('Lo sento nel corpo prima che nella testa: la pressione del giudizio mi attiva fisicamente.', 'percettivo', 5),
  ('Quasi per niente: non mi arriva più. Che mi lodino o critichino, la risposta interna è piatta.', 'recuperante', 6)
) AS t(text, tag, ord);

-- D09 RELAZIONE CON I RISULTATI
WITH q AS (INSERT INTO public.quiz_questions (text, display_order, published) VALUES ('Come descriveresti la tua relazione con i risultati sportivi?', 9, true) RETURNING id)
INSERT INTO public.quiz_options (question_id, text, profile_tag, display_order)
SELECT q.id, t.text, t.tag, t.ord FROM q, (VALUES
  ('Non bastano mai: anche un buon risultato mi fa pensare a tutto quello che potevo fare meglio.', 'perfezionatore', 1),
  ('Dipende troppo dal "prima": se ho vissuto bene il pre-gara, il risultato è più sopportabile.', 'anticipatore', 2),
  ('Li sento con tutto il corpo: la vittoria mi esalta, la sconfitta mi abbatte — nulla è tiepido.', 'intenso', 3),
  ('Oscillano troppo la mia autostima: bene = mi sento qualcuno, male = torno a dubitare di tutto.', 'confermatore', 4),
  ('Li vivo soprattutto come sensazioni fisiche: so dal corpo come è andata ancor prima di leggere il cronometro.', 'percettivo', 5),
  ('Non mi emozionano più come prima: vinco o perdo, la sensazione è la stessa — una specie di niente.', 'recuperante', 6)
) AS t(text, tag, ord);

-- D10 IDENTITÀ SPORTIVA
WITH q AS (INSERT INTO public.quiz_questions (text, display_order, published) VALUES ('Chi saresti senza questo sport?', 10, true) RETURNING id)
INSERT INTO public.quiz_options (question_id, text, profile_tag, display_order)
SELECT q.id, t.text, t.tag, t.ord FROM q, (VALUES
  ('Non lo so bene: l''atleta che sono è strettamente legato alla mia competenza e ai miei standard.', 'perfezionatore', 1),
  ('Probabilmente più ansioso/a su altre cose: lo sport mi dà struttura, senza non so dove mettere la testa.', 'anticipatore', 2),
  ('Molto meno carico/a: avrei bisogno di trovare un''altra fonte di energia e scarica emotiva.', 'intenso', 3),
  ('Meno riconoscibile: lo sport è uno dei pochi contesti dove sento di avere valore e identità chiara.', 'confermatore', 4),
  ('Avrei bisogno di altri modi per sentire il corpo: l''attività fisica è il mio modo principale di abitarmi.', 'percettivo', 5),
  ('Forse più leggero/a: a volte penso che fermarmi sarebbe un sollievo, non una perdita.', 'recuperante', 6)
) AS t(text, tag, ord);

-- D11 RELAZIONI NELLO SPORT
WITH q AS (INSERT INTO public.quiz_questions (text, display_order, published) VALUES ('Come funzioni con l''allenatore e i compagni di squadra in momenti di pressione?', 11, true) RETURNING id)
INSERT INTO public.quiz_options (question_id, text, profile_tag, display_order)
SELECT q.id, t.text, t.tag, t.ord FROM q, (VALUES
  ('Mi chiudo: ho la mia routine, le mie abitudini, e le interferenze esterne mi disturbano molto.', 'perfezionatore', 1),
  ('Cerco rassicurazione: ho bisogno di sapere che il piano è solido e che tutto è sotto controllo.', 'anticipatore', 2),
  ('Posso essere esplosivo/a: rispondo di petto, reagisco ad alta intensità, devo poi recuperare il rapporto.', 'intenso', 3),
  ('Ho bisogno di sentirmi supportato/a: l''allenatore è una figura di cui cerco approvazione continua.', 'confermatore', 4),
  ('Sento le tensioni relazionali nel corpo: un clima di squadra teso si traduce subito in attivazione fisica.', 'percettivo', 5),
  ('Mi distacco: preferisco stare per conto mio, le relazioni mi costano energia che non ho più.', 'recuperante', 6)
) AS t(text, tag, ord);

-- D12 DOPO LA GARA
WITH q AS (INSERT INTO public.quiz_questions (text, display_order, published) VALUES ('Come ti senti tipicamente nelle ore successive a una competizione?', 12, true) RETURNING id)
INSERT INTO public.quiz_options (question_id, text, profile_tag, display_order)
SELECT q.id, t.text, t.tag, t.ord FROM q, (VALUES
  ('Ancora dentro: analizzo, rivedo, valuto — l''interruttore non si spegne facilmente.', 'perfezionatore', 1),
  ('Sollevato/a se è andata bene, ma già preoccupato/a per la prossima: il ciclo riparte subito.', 'anticipatore', 2),
  ('Ho bisogno di scaricare: a volte euforia, a volte crollo — comunque alta intensità emotiva.', 'intenso', 3),
  ('Dipende dal giudizio degli altri: aspetto feedback per capire se posso sentirmi bene o no.', 'confermatore', 4),
  ('Il corpo si prende il tempo che vuole: tensioni, stanchezza, o al contrario attivazione prolungata.', 'percettivo', 5),
  ('Vuoto/a: non c''è né soddisfazione né delusione — solo la sensazione che sia finita, anche questa.', 'recuperante', 6)
) AS t(text, tag, ord);

// Templates & rules estratti dal documento "MeMindSport - Restituzione grafica del profilo".
// Tutti i testi e le regole sono deterministici (no AI) come previsto dalle specifiche.

export type ProfileKey =
  | "perfezionatore"
  | "anticipatore"
  | "intenso"
  | "confermatore"
  | "percettivo"
  | "recuperante";

export const PROFILE_ORDER: ProfileKey[] = [
  "perfezionatore",
  "anticipatore",
  "intenso",
  "confermatore",
  "percettivo",
  "recuperante",
];

export const PROFILE_LABELS: Record<ProfileKey, { name: string; short: string }> = {
  perfezionatore: { name: "Il Perfezionatore", short: "Perfezionatore" },
  anticipatore:   { name: "L'Anticipatore",    short: "Anticipatore" },
  intenso:        { name: "L'Intenso",          short: "Intenso" },
  confermatore:   { name: "Il Confermatore",   short: "Confermatore" },
  percettivo:     { name: "Il Percettivo",     short: "Percettivo" },
  recuperante:    { name: "Il Recuperante",    short: "Recuperante" },
};

// Colore dedicato per tipo (palette evocativa, non semantica UI).
export const PROFILE_COLORS: Record<ProfileKey, string> = {
  perfezionatore: "#3B82F6", // blu — controllo / struttura
  anticipatore:   "#8B5CF6", // viola — cognitivo / pianificazione
  intenso:        "#EF4444", // rosso — fuoco / energia
  confermatore:   "#F59E0B", // ambra — relazionale / conferma
  percettivo:     "#10B981", // verde — corpo / percezione
  recuperante:    "#64748B", // grigio-blu — silenzio / recupero
};

// Mappa del campo: zone, coordinate target per ogni tipo (0,0 = basso-sx, 1,1 = alto-dx).
export type ZoneKey = "flusso" | "fuoco" | "mappa" | "silenzio";

export const ZONES: Record<ZoneKey, { name: string; axisLabel: string; type: ProfileKey }> = {
  flusso:   { name: "Zona del flusso",   axisLabel: "alta energia · alto controllo", type: "perfezionatore" },
  fuoco:    { name: "Zona del fuoco",    axisLabel: "alta energia · basso controllo", type: "intenso" },
  mappa:    { name: "Zona della mappa",  axisLabel: "bassa energia · alto controllo", type: "anticipatore" },
  silenzio: { name: "Zona del silenzio", axisLabel: "bassa energia · basso controllo", type: "recuperante" },
};

export const TYPE_COORDS: Record<ProfileKey, { x: number; y: number; zone: ZoneKey }> = {
  perfezionatore: { x: 0.35, y: 0.75, zone: "flusso" },
  anticipatore:   { x: 0.35, y: 0.30, zone: "mappa" },
  intenso:        { x: 0.72, y: 0.78, zone: "fuoco" },
  confermatore:   { x: 0.70, y: 0.55, zone: "fuoco" },
  percettivo:     { x: 0.38, y: 0.40, zone: "mappa" },
  recuperante:    { x: 0.68, y: 0.25, zone: "silenzio" },
};

// Frase mappa per tipo (Atto 1).
export const FRASE_MAPPA: Record<ProfileKey, string> = {
  intenso:
    "Sei nella zona del fuoco. Porti energia vera nella gara. Il percorso è verso la zona del flusso: imparare a scegliere quando accendere — e quando lasciare che si assesti.",
  perfezionatore:
    "Sei già nella zona del flusso. Hai energia e struttura. Il percorso è verso il centro: imparare a fluire senza stringere troppo.",
  anticipatore:
    "Sei nella zona della mappa. Hai la bussola in testa. Il percorso è verso l'alto: portare quella chiarezza nell'azione, senza aspettare che tutto sia perfetto.",
  confermatore:
    "Sei nella zona del fuoco, vicino al confine. Il percorso è verso il centro: trovare la fiducia dentro, non fuori.",
  percettivo:
    "Sei nella zona della mappa. Il tuo corpo sa già tutto. Il percorso è imparare ad ascoltarlo come risorsa, non come allarme.",
  recuperante:
    "Sei nella zona del silenzio. Non significa che il fuoco si è spento: significa che hai bisogno di aria. Il percorso inizia dall'ascolto.",
};

// Insight ragnatela (Atto 2): forza prima, area di lavoro dopo. Mai il contrario.
export const INSIGHT_RADAR: Record<ProfileKey, string> = {
  perfezionatore:
    "La tua forma è asimmetrica, focalizzata sul controllo: una lancia diretta verso la precisione. La forza è la cura del dettaglio. Il percorso lavorerà sul lasciare fluire, senza stringere ogni passaggio.",
  anticipatore:
    "La tua forma è estesa sugli assi cognitivi: la lettura del contesto è il tuo punto forte. Il percorso lavorerà sul portare quella chiarezza dentro l'azione, senza farsi assorbire dagli scenari.",
  intenso:
    "La tua forma è esplosiva su un asse: l'energia è la tua firma. La forza è la potenza disponibile. Il percorso lavorerà sul canalizzarla, scegliendo il momento giusto per accenderla.",
  confermatore:
    "La tua forma è raccolta e centrata sull'asse relazionale: la sensibilità all'altro è una risorsa rara. Il percorso lavorerà sul costruire una base di fiducia interna, indipendente dal giudizio esterno.",
  percettivo:
    "La tua forma è lunga sull'asse corporeo: senti prima e meglio degli altri. La forza è una sensibilità affilata. Il percorso lavorerà sul leggere i segnali come informazione, non come allarme.",
  recuperante:
    "La tua forma è raccolta su tutti gli assi: stai attraversando una fase di recupero. La forza è esserti fermato ad ascoltarti. Il percorso parte dalla decompressione, non dalla performance.",
};

// Tag di forza (3–4) per tipo.
export const TAG_FORZA: Record<ProfileKey, string[]> = {
  perfezionatore: ["Cura del dettaglio", "Standard alti", "Disciplina", "Affidabilità"],
  anticipatore:   ["Lettura del contesto", "Pianificazione", "Visione", "Strategia"],
  intenso:        ["Alta energia", "Reattività", "Coraggio agonistico", "Carisma"],
  confermatore:   ["Sensibilità relazionale", "Impegno", "Empatia", "Spirito di squadra"],
  percettivo:     ["Sensibilità corporea", "Intuizione", "Presenza", "Tecnica fine"],
  recuperante:    ["Onestà con sé", "Capacità di ascolto", "Esperienza", "Maturità"],
};

// Tag di lavoro (2–3) per tipo.
export const TAG_LAVORO: Record<ProfileKey, string[]> = {
  perfezionatore: ["Gestione errore", "Flessibilità mentale"],
  anticipatore:   ["Presenza nell'azione", "Reset cognitivo"],
  intenso:        ["Canalizzazione energia", "Reset emotivo"],
  confermatore:   ["Fiducia interna", "Autonomia decisionale"],
  percettivo:     ["Filtro dei segnali", "Carico cognitivo"],
  recuperante:    ["Riaccensione graduale", "Recupero strutturato"],
};

export type ProfileResult = {
  primary: ProfileKey;
  secondary: ProfileKey | null;
  isDouble: boolean;
  counts: Record<string, number>;
  total: number;
  scores: number[]; // ordinato secondo PROFILE_ORDER, scala 0–12 (per radar)
};

export function computeProfile(
  answers: Record<string, { optionId: string; tag: string }>,
): ProfileResult {
  const counts: Record<string, number> = {};
  Object.values(answers).forEach((a) => {
    counts[a.tag] = (counts[a.tag] ?? 0) + 1;
  });
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const primary = (ranked[0]?.[0] as ProfileKey) ?? "perfezionatore";
  const primaryScore = ranked[0]?.[1] ?? 0;
  const secondary =
    ranked[1] && primaryScore - ranked[1][1] <= 2
      ? (ranked[1][0] as ProfileKey)
      : null;

  const total = Object.keys(answers).length || 12;
  // Scala il punteggio sulla griglia 0–12 della ragnatela.
  const scaleMax = 12;
  const scores = PROFILE_ORDER.map((k) =>
    Math.round(((counts[k] ?? 0) / Math.max(total, 1)) * scaleMax),
  );

  return {
    primary,
    secondary,
    isDouble: !!secondary,
    counts,
    total,
    scores,
  };
}

export function getAthletePoint(result: ProfileResult): { x: number; y: number } {
  const p = TYPE_COORDS[result.primary];
  if (!result.secondary) return { x: p.x, y: p.y };
  const s = TYPE_COORDS[result.secondary];
  const pScore = result.counts[result.primary] ?? 1;
  const sScore = result.counts[result.secondary] ?? 1;
  const totalW = pScore + sScore;
  return {
    x: (p.x * pScore + s.x * sScore) / totalW,
    y: (p.y * pScore + s.y * sScore) / totalW,
  };
}

export function buildTags(result: ProfileResult): { forza: string[]; lavoro: string[] } {
  if (result.isDouble && result.secondary) {
    const forza = [
      ...TAG_FORZA[result.primary].slice(0, 2),
      ...TAG_FORZA[result.secondary].slice(0, 2),
    ];
    return { forza, lavoro: TAG_LAVORO[result.primary].slice(0, 3) };
  }
  return {
    forza: TAG_FORZA[result.primary].slice(0, 4),
    lavoro: TAG_LAVORO[result.primary].slice(0, 3),
  };
}

export function buildInsight(result: ProfileResult): string {
  if (result.isDouble && result.secondary) {
    const a = PROFILE_LABELS[result.primary].name;
    const b = PROFILE_LABELS[result.secondary].name;
    return `La tua forma racconta un atleta con due centri di gravità: ${a} e ${b}. Questo non è un profilo diviso — è un profilo ricco. ${INSIGHT_RADAR[result.primary]}`;
  }
  return INSIGHT_RADAR[result.primary];
}

export function formatSummary(result: ProfileResult): string {
  const labelOf = (k: string) => PROFILE_LABELS[k as ProfileKey]?.name ?? k;
  const dist = PROFILE_ORDER
    .map((k) => `${labelOf(k)} ${result.counts[k] ?? 0}/${result.total}`)
    .join(" · ");
  const primary = `Prevalente: ${labelOf(result.primary)} ${result.counts[result.primary]}/${result.total}`;
  const secondary = result.secondary
    ? ` · Secondario: ${labelOf(result.secondary)} ${result.counts[result.secondary]}/${result.total}`
    : "";
  return `${primary}${secondary} · Distribuzione: ${dist} · Zona: ${ZONES[TYPE_COORDS[result.primary].zone].name}`;
}

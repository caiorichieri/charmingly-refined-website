export type BlogPost = {
  slug: string;
  tag: string;
  h: string;
  p: string;
  img: string;
  date: string;
  readingTime: string;
};

export const posts: BlogPost[] = [
  {
    slug: "ansia-da-prestazione",
    tag: "Psicologia sportiva",
    h: "Ansia da prestazione: quando la pressione entra in gara prima di te",
    p: "Come riconoscere i segnali mentali e fisici della pressione agonistica e perché lavorare sulla mente può aiutarti a restare lucido nei momenti decisivi.",
    img: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1100&q=85",
    date: "12 Apr 2026",
    readingTime: "6 min",
  },
  {
    slug: "routine-pre-gara",
    tag: "Mental coaching",
    h: "Routine pre-gara: perché i grandi atleti non improvvisano",
    p: "Respirazione, visualizzazione, focus attentivo e self-talk: le routine mentali aiutano a creare continuità quando la competizione si fa intensa.",
    img: "https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=1100&q=85",
    date: "28 Mar 2026",
    readingTime: "5 min",
  },
  {
    slug: "recuperare-dopo-errore",
    tag: "Performance mentale",
    h: "Dopo un errore: come recuperare concentrazione e fiducia",
    p: "Nello sport l'errore è inevitabile. La differenza sta in quanto velocemente riesci a rientrare nella prestazione senza restare bloccato nella testa.",
    img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1100&q=85",
    date: "14 Mar 2026",
    readingTime: "7 min",
  },
  {
    slug: "visualizzazione-mentale",
    tag: "Tecniche",
    h: "Visualizzazione mentale: allenare il gesto prima di farlo",
    p: "Una pratica usata da atleti di vertice per costruire fiducia, automatismi e prontezza neuromuscolare. Come funziona davvero e come integrarla nel tuo allenamento.",
    img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1100&q=85",
    date: "01 Mar 2026",
    readingTime: "8 min",
  },
  {
    slug: "rientro-dopo-infortunio",
    tag: "Psicologia sportiva",
    h: "Rientro dopo un infortunio: il corpo guarisce, la testa no (subito)",
    p: "Paura del nuovo infortunio, perdita di fiducia, identità sportiva sospesa: perché la riabilitazione mentale è parte del rientro.",
    img: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1100&q=85",
    date: "18 Feb 2026",
    readingTime: "6 min",
  },
  {
    slug: "flow-state-sport",
    tag: "Performance mentale",
    h: "Flow state: lo stato mentale in cui tutto sembra più semplice",
    p: "Cos'è il flow, perché alcuni atleti lo vivono spesso e altri quasi mai, e quali condizioni aiutano a entrarci più facilmente.",
    img: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1100&q=85",
    date: "02 Feb 2026",
    readingTime: "7 min",
  },
];

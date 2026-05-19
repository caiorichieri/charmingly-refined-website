import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type F = { id: string; question: string; answer: string };

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const { data: faqs = [] } = useQuery({
    queryKey: ["public", "faqs"],
    queryFn: async () => {
      const { data } = await supabase
        .from("faqs")
        .select("id, question, answer")
        .eq("published", true)
        .order("display_order");
      return (data ?? []) as F[];
    },
  });

  const faqJsonLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          about: { "@type": "Thing", name: "MeMindSport" },
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <section className="bg-white py-24 md:py-32 px-6 md:px-12">
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <div className="max-w-[1000px] mx-auto">
        <div className="reveal text-center mb-12">
          <div className="eyebrow mb-4 justify-center inline-flex">Domande frequenti</div>
          <h2 className="h-display text-[clamp(34px,4.2vw,56px)]">
            Hai dubbi?{" "}
            <em className="not-italic" style={{ background: "var(--gradient-green)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontStyle: "italic" }}>
              Eccoci.
            </em>
          </h2>
        </div>
        <div className="reveal flex flex-col gap-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.id}
                className={`border rounded-lg overflow-hidden transition-all duration-300 ${
                  isOpen ? "bg-off border-brand-green/40 shadow-soft" : "bg-white border-line hover:border-brand-green/30"
                }`}
              >
                <button onClick={() => setOpen(isOpen ? null : i)} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
                  <h3 className="font-display text-[18px] font-extrabold leading-tight pr-4">{f.question}</h3>
                  <span className={`grid place-items-center h-9 w-9 rounded-full transition-all flex-shrink-0 ${isOpen ? "bg-brand-green text-white rotate-45" : "bg-brand-green/10 text-brand-green"}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </button>
                <div className="grid transition-all duration-400 ease-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-[14.5px] leading-relaxed text-muted-foreground whitespace-pre-line">{f.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

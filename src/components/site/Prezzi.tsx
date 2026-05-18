import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Plan = {
  id: string;
  label: string;
  amount: string;
  amount_accent: string | null;
  detail: string;
  description: string;
  is_featured: boolean;
  is_deductible: boolean;
};

function Tile({ c }: { c: Plan }) {
  return (
    <div
      className={`relative rounded-lg p-6 border-[1.5px] transition-all duration-300 hover:-translate-y-1 ${
        c.is_featured
          ? "bg-ink-deep border-ink-deep text-white shadow-glow"
          : "bg-off border-line hover:border-brand-green/40 hover:bg-white"
      }`}
    >
      {c.is_featured && (
        <span className="absolute -top-3 left-6 text-[10px] font-bold tracking-[0.16em] uppercase bg-brand-green text-white px-3 py-1 rounded">
          Più scelto
        </span>
      )}
      <div className={`text-[11px] font-bold tracking-[0.12em] uppercase mb-3 ${c.is_featured ? "text-white/45" : "text-muted-foreground"}`}>
        {c.label}
      </div>
      <div className={`font-display font-extrabold leading-none mb-1 ${c.amount === "Su misura" ? "text-2xl" : "text-[40px]"} ${c.is_featured ? "text-white" : "text-ink"}`}>
        {c.amount}
        {c.amount_accent && <span className="text-brand-green">{c.amount_accent}</span>}
      </div>
      <div className={`text-[12px] mb-3 ${c.is_featured ? "text-white/50" : "text-muted-foreground"}`}>{c.detail}</div>
      <div className={`text-[13px] leading-snug ${c.is_featured ? "text-white/70" : "text-foreground/70"}`}>{c.description}</div>
      {c.is_deductible && (
        <span className="inline-block mt-3 text-[11px] font-bold text-brand-green bg-brand-green/12 px-2.5 py-1 rounded">
          Detraibile 19%
        </span>
      )}
    </div>
  );
}

export function Prezzi() {
  const { data: plans = [] } = useQuery({
    queryKey: ["public", "plans"],
    queryFn: async () => {
      const { data } = await supabase
        .from("plans")
        .select("id, label, amount, amount_accent, detail, description, is_featured, is_deductible")
        .eq("published", true)
        .order("display_order");
      return (data ?? []) as Plan[];
    },
  });

  const row1 = plans.slice(0, 4);
  const row2 = plans.slice(4, 8);

  return (
    <section id="prezzi" className="bg-white py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-[1180px] mx-auto">
        <div className="reveal">
          <div className="eyebrow mb-4">Prezzi chiari</div>
          <h2 className="h-display text-[clamp(34px,4.2vw,56px)]">
            Nessuna{" "}
            <em className="not-italic" style={{ background: "var(--gradient-green)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontStyle: "italic" }}>
              sorpresa.
            </em>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {row1.map((c) => <Tile key={c.id} c={c} />)}
        </div>
        {row2.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {row2.map((c) => <Tile key={c.id} c={c} />)}
          </div>
        )}
        <p className="text-center mt-8 text-[14px] text-muted-foreground">
          Le sessioni con psicologo sportivo sono prestazioni sanitarie.{" "}
          <a href="#" className="text-brand-green font-semibold hover:underline">
            Informazioni →
          </a>
        </p>
      </div>
    </section>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Construction } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/paths")({
  component: () => <Stub title="Percorsi mentali" />,
});

function Stub({ title }: { title: string }) {
  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold text-ink">{title}</h1>
      <div className="mt-8 bg-white border border-line rounded-2xl p-12 text-center">
        <Construction size={40} className="mx-auto text-brand-green mb-4" />
        <p className="text-muted-foreground">Modulo CRUD in arrivo nel prossimo step.</p>
        <p className="text-xs text-muted-foreground mt-2">I dati sono già nel database e leggibili dal sito pubblico.</p>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Construction } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: () => (
    <div>
      <h1 className="font-display text-3xl font-extrabold text-ink">Utenti & ruoli</h1>
      <div className="mt-8 bg-white border border-line rounded-2xl p-12 text-center">
        <Construction size={40} className="mx-auto text-brand-green mb-4" />
        <p className="text-muted-foreground">Gestione utenti e ruoli (admin/terapeuta) in arrivo nel prossimo step.</p>
      </div>
    </div>
  ),
});

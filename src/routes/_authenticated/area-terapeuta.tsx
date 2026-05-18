import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/_authenticated/area-terapeuta")({
  component: TherapistArea,
});

function TherapistArea() {
  async function handleLogout() {
    await supabase.auth.signOut();
    toast.success("Disconnesso");
    window.location.href = "/";
  }
  return (
    <div className="min-h-screen bg-off">
      <header className="px-6 md:px-12 py-6 flex items-center justify-between bg-white border-b border-line">
        <Link to="/" className="flex items-center"><Logo variant="light" className="h-16 w-auto -my-4" /></Link>
        <button onClick={handleLogout} className="text-sm font-medium text-muted-foreground hover:text-foreground">Logout</button>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="bg-white border border-line rounded-2xl p-12">
          <h1 className="font-display text-3xl font-extrabold text-ink">Area Terapeuta</h1>
          <p className="text-muted-foreground mt-4">
            Quest'area è in costruzione. Le funzionalità per i professionisti (calendario sessioni,
            schede atleti, materiali) saranno disponibili nei prossimi rilasci.
          </p>
        </div>
      </main>
    </div>
  );
}

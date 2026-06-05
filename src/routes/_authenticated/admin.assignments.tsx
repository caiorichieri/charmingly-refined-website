import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Users, UserPlus, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/assignments")({
  component: AssignmentsAdmin,
});

type Profile = { id: string; email: string | null; display_name: string | null };
type Assignment = {
  id: string;
  athlete_id: string;
  therapist_id: string;
  active: boolean;
  assigned_at: string;
};

function AssignmentsAdmin() {
  const qc = useQueryClient();
  const [selectedAthlete, setSelectedAthlete] = useState<string>("");
  const [selectedTherapist, setSelectedTherapist] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "assignments"],
    queryFn: async () => {
      const [{ data: profiles }, { data: roles }, { data: assignments }] = await Promise.all([
        supabase.from("profiles").select("id, email, display_name").order("email"),
        supabase.from("user_roles").select("user_id, role"),
        supabase.from("athlete_assignments").select("*").eq("active", true),
      ]);
      const rolesMap = new Map<string, string[]>();
      (roles ?? []).forEach((r) => {
        const arr = rolesMap.get(r.user_id) ?? [];
        arr.push(r.role);
        rolesMap.set(r.user_id, arr);
      });
      const allProfiles = (profiles ?? []) as Profile[];
      const athletes = allProfiles.filter((p) => (rolesMap.get(p.id) ?? ["athlete"]).includes("athlete"));
      const therapists = allProfiles.filter((p) => (rolesMap.get(p.id) ?? []).includes("therapist"));
      return { athletes, therapists, assignments: (assignments ?? []) as Assignment[], allProfiles };
    },
  });

  const profileMap = useMemo(() => {
    const m = new Map<string, Profile>();
    (data?.allProfiles ?? []).forEach((p) => m.set(p.id, p));
    return m;
  }, [data]);

  const assignedAthleteIds = useMemo(
    () => new Set((data?.assignments ?? []).map((a) => a.athlete_id)),
    [data],
  );

  const unassignedAthletes = useMemo(
    () => (data?.athletes ?? []).filter((a) => !assignedAthleteIds.has(a.id)),
    [data, assignedAthleteIds],
  );

  const assign = useMutation({
    mutationFn: async () => {
      if (!selectedAthlete || !selectedTherapist) throw new Error("Seleziona atleta e terapeuta");
      const { error } = await supabase.from("athlete_assignments").insert({
        athlete_id: selectedAthlete,
        therapist_id: selectedTherapist,
        active: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Assegnazione creata");
      setSelectedAthlete("");
      setSelectedTherapist("");
      qc.invalidateQueries({ queryKey: ["admin", "assignments"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Errore"),
  });

  const unassign = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("athlete_assignments")
        .update({ active: false, ended_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Assegnazione rimossa");
      qc.invalidateQueries({ queryKey: ["admin", "assignments"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Errore"),
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-extrabold text-ink">Assegnazioni atleta ↔ terapeuta</h1>
        <p className="text-muted-foreground mt-1">
          Collega ogni atleta al terapeuta di riferimento. Ogni atleta può avere un solo terapeuta attivo.
        </p>
      </div>

      {/* Nuova assegnazione */}
      <div className="bg-white border border-line rounded-2xl p-6 mb-6">
        <h2 className="font-display text-lg font-extrabold text-ink mb-4 flex items-center gap-2">
          <UserPlus size={18} /> Nuova assegnazione
        </h2>
        <div className="grid md:grid-cols-3 gap-3 items-end">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-foreground/80">Atleta</span>
            <select
              value={selectedAthlete}
              onChange={(e) => setSelectedAthlete(e.target.value)}
              className="border border-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
            >
              <option value="">— seleziona —</option>
              {unassignedAthletes.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.display_name || a.email} ({a.email})
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-foreground/80">Terapeuta</span>
            <select
              value={selectedTherapist}
              onChange={(e) => setSelectedTherapist(e.target.value)}
              className="border border-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
            >
              <option value="">— seleziona —</option>
              {(data?.therapists ?? []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.display_name || t.email}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={() => assign.mutate()}
            disabled={!selectedAthlete || !selectedTherapist || assign.isPending}
            className="font-display font-bold tracking-wider text-white bg-brand-green hover:brightness-110 px-5 py-2.5 rounded-full transition-all disabled:opacity-50"
          >
            Assegna
          </button>
        </div>
        {unassignedAthletes.length === 0 && !isLoading && (
          <p className="text-sm text-muted-foreground mt-3">
            Tutti gli atleti registrati hanno già un terapeuta assegnato.
          </p>
        )}
        {(data?.therapists.length ?? 0) === 0 && !isLoading && (
          <p className="text-sm text-amber-600 mt-3">
            Nessun utente ha il ruolo "terapeuta". Vai in <strong>Utenti & ruoli</strong> per assegnarlo.
          </p>
        )}
      </div>

      {/* Assegnazioni attive */}
      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-line flex items-center gap-2">
          <Users size={16} className="text-muted-foreground" />
          <h2 className="font-display text-lg font-extrabold text-ink">
            Assegnazioni attive ({data?.assignments.length ?? 0})
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-off text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4">Atleta</th>
              <th className="p-4">Terapeuta</th>
              <th className="p-4">Dal</th>
              <th className="p-4 w-32"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Caricamento…</td></tr>
            )}
            {!isLoading && (data?.assignments ?? []).map((a) => {
              const ath = profileMap.get(a.athlete_id);
              const ter = profileMap.get(a.therapist_id);
              return (
                <tr key={a.id} className="border-t border-line">
                  <td className="p-4">
                    <div className="font-medium">{ath?.display_name || "—"}</div>
                    <div className="text-xs text-muted-foreground">{ath?.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{ter?.display_name || "—"}</div>
                    <div className="text-xs text-muted-foreground">{ter?.email}</div>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(a.assigned_at).toLocaleDateString("it-IT")}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        if (confirm("Disattivare questa assegnazione?")) unassign.mutate(a.id);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded"
                    >
                      <X size={12} /> Rimuovi
                    </button>
                  </td>
                </tr>
              );
            })}
            {!isLoading && (data?.assignments ?? []).length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Nessuna assegnazione attiva.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

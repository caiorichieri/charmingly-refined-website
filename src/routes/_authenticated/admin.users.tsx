import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Stethoscope, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersAdmin,
});

type Role = "admin" | "therapist";
type Profile = { id: string; email: string | null; display_name: string | null };
type UserRow = Profile & { roles: Role[] };

function UsersAdmin() {
  const qc = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async (): Promise<UserRow[]> => {
      const [{ data: profiles, error: pe }, { data: roles, error: re }] = await Promise.all([
        supabase.from("profiles").select("id, email, display_name").order("email"),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (pe) throw pe;
      if (re) throw re;
      const map = new Map<string, Role[]>();
      (roles ?? []).forEach((r) => {
        const arr = map.get(r.user_id) ?? [];
        arr.push(r.role as Role);
        map.set(r.user_id, arr);
      });
      return (profiles ?? []).map((p) => ({ ...p, roles: map.get(p.id) ?? [] }));
    },
  });

  const toggleRole = useMutation({
    mutationFn: async ({ userId, role, has }: { userId: string; role: Role; has: boolean }) => {
      if (has) {
        const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Ruolo aggiornato");
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Errore"),
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-extrabold text-ink">Utenti & ruoli</h1>
        <p className="text-muted-foreground mt-1">Assegna o revoca i ruoli di amministratore e terapeuta.</p>
      </div>

      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-off text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4">Utente</th>
              <th className="p-4">Email</th>
              <th className="p-4 w-40">Admin</th>
              <th className="p-4 w-40">Terapeuta</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Caricamento…</td></tr>}
            {!isLoading && users.map((u) => {
              const isAdmin = u.roles.includes("admin");
              const isTher = u.roles.includes("therapist");
              return (
                <tr key={u.id} className="border-t border-line">
                  <td className="p-4 font-medium">{u.display_name || "—"}</td>
                  <td className="p-4 text-muted-foreground">{u.email}</td>
                  <td className="p-4">
                    <RoleToggle on={isAdmin} icon={Shield} label="Admin" onClick={() => toggleRole.mutate({ userId: u.id, role: "admin", has: isAdmin })} />
                  </td>
                  <td className="p-4">
                    <RoleToggle on={isTher} icon={Stethoscope} label="Terapeuta" onClick={() => toggleRole.mutate({ userId: u.id, role: "therapist", has: isTher })} />
                  </td>
                </tr>
              );
            })}
            {!isLoading && users.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Nessun utente registrato.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RoleToggle({ on, icon: Icon, label, onClick }: { on: boolean; icon: typeof Shield; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
        on ? "bg-brand-green text-white hover:brightness-110" : "bg-off text-muted-foreground hover:bg-line"
      }`}
    >
      {on ? <Icon size={12} /> : <X size={12} />} {on ? label : `Assegna ${label.toLowerCase()}`}
    </button>
  );
}

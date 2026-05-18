import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuthSubscription() {
  const queryClient = useQueryClient();
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    });
    return () => subscription.unsubscribe();
  }, [queryClient]);
}

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: async (): Promise<Session | null> => {
      const { data } = await supabase.auth.getSession();
      return data.session ?? null;
    },
    staleTime: 1000 * 60,
  });
}

export function useRoles(userId: string | undefined) {
  return useQuery({
    queryKey: ["roles", userId],
    queryFn: async (): Promise<string[]> => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
      if (error) return [];
      return (data ?? []).map((r) => r.role);
    },
    enabled: !!userId,
    staleTime: 1000 * 60,
  });
}

export function useAuth() {
  const sessionQuery = useSession();
  const user: User | undefined = sessionQuery.data?.user;
  const rolesQuery = useRoles(user?.id);
  return {
    session: sessionQuery.data,
    user,
    isAuthenticated: !!user,
    isAdmin: (rolesQuery.data ?? []).includes("admin"),
    isTherapist: (rolesQuery.data ?? []).includes("therapist"),
    loading: sessionQuery.isLoading || (!!user && rolesQuery.isLoading),
  };
}

export function useHydratedAuth() {
  // Returns true once the initial session check has resolved (client-only)
  const [hydrated, setHydrated] = useState(false);
  const { isLoading } = useSession();
  useEffect(() => {
    if (!isLoading) setHydrated(true);
  }, [isLoading]);
  return hydrated;
}

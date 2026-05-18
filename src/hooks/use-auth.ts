import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthState = {
  session: Session | null;
  user: User | undefined;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTherapist: boolean;
  loading: boolean;
};

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

export function useAuth(): AuthState {
  const [auth, setAuth] = useState<AuthState>({
    session: null,
    user: undefined,
    isAuthenticated: false,
    isAdmin: false,
    isTherapist: false,
    loading: true,
  });

  useEffect(() => {
    let active = true;

    async function load(session: Session | null) {
      const user = session?.user;
      let roles: string[] = [];

      if (user) {
        const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
        roles = (data ?? []).map((r) => r.role);
      }

      if (!active) return;
      setAuth({
        session,
        user,
        isAuthenticated: !!user,
        isAdmin: roles.includes("admin"),
        isTherapist: roles.includes("therapist"),
        loading: false,
      });
    }

    supabase.auth.getSession().then(({ data }) => load(data.session ?? null));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void load(session);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return auth;
}

export function useHydratedAuth() {
  return !useAuth().loading;
}

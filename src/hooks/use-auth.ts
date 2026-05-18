import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
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

const initialAuthState: AuthState = {
  session: null,
  user: undefined,
  isAuthenticated: false,
  isAdmin: false,
  isTherapist: false,
  loading: true,
};

const AuthContext = createContext<AuthState>(initialAuthState);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [auth, setAuth] = useState<AuthState>(initialAuthState);

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
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    }

    void supabase.auth.getSession().then(({ data }) => load(data.session ?? null));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void load(session);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return createElement(AuthContext.Provider, { value: auth }, children);
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}

export function useHydratedAuth() {
  return !useAuth().loading;
}

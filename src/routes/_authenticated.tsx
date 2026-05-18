import { useEffect } from "react";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useAuth, useHydratedAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const hydrated = useHydratedAuth();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      void navigate({ to: "/auth", replace: true });
    }
  }, [hydrated, isAuthenticated, navigate]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off">
        <div className="text-sm text-muted-foreground">Caricamento…</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off">
        <div className="text-sm text-muted-foreground">Reindirizzamento…</div>
      </div>
    );
  }

  return <Outlet />;
}

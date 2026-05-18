import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { useAuth, useHydratedAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const hydrated = useHydratedAuth();
  const { isAuthenticated } = useAuth();

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off">
        <div className="text-sm text-muted-foreground">Caricamento…</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return <Outlet />;
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper, Tag, Route as RouteIcon, Quote, HelpCircle, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function useCount(table: string) {
  return useQuery({
    queryKey: ["count", table],
    queryFn: async () => {
      const { count } = await supabase.from(table as never).select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });
}

function AdminDashboard() {
  const blog = useCount("blog_posts");
  const plans = useCount("plans");
  const paths = useCount("paths");
  const testimonials = useCount("testimonials");
  const faqs = useCount("faqs");
  const media = useCount("media_assets");

  const stats = [
    { label: "Articoli", value: blog.data, to: "/admin/blog", icon: Newspaper },
    { label: "Piani", value: plans.data, to: "/admin/plans", icon: Tag },
    { label: "Percorsi", value: paths.data, to: "/admin/paths", icon: RouteIcon },
    { label: "Testimonianze", value: testimonials.data, to: "/admin/testimonials", icon: Quote },
    { label: "FAQ", value: faqs.data, to: "/admin/faqs", icon: HelpCircle },
    { label: "Media", value: media.data, to: "/admin/media", icon: ImageIcon },
  ] as const;

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold text-ink">Dashboard</h1>
      <p className="text-muted-foreground mt-1">Benvenuto nel pannello di gestione MM Sport.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              to={s.to}
              className="bg-white border border-line rounded-2xl p-6 hover:shadow-card hover:-translate-y-0.5 transition-all flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center">
                <Icon size={22} />
              </div>
              <div>
                <div className="text-3xl font-display font-extrabold text-ink">
                  {s.value ?? "—"}
                </div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

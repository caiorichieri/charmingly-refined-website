import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/use-auth";
import { QuizModal } from "@/components/quiz/QuizModal";
import { ConditionalScript } from "@/components/site/ConditionalScript";
import { CookieBanner } from "@/components/site/CookieBanner";
import { ConsentProvider } from "@/contexts/ConsentContext";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Pagina non trovata</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Torna alla home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Questa pagina non si è caricata
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Qualcosa è andato storto. Puoi riprovare o tornare alla home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Riprova
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "google-site-verification", content: "UOehGj0iu0-dDp-fLkznqRRnItodWEx5i8zeMQry42w" },
      { name: "author", content: "MeMindSport — MetaCare SRL" },
      { property: "og:site_name", content: "MeMindSport" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;1,600;1,700;1,800&family=Barlow:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": ["MedicalBusiness", "MedicalOrganization"],
              "@id": "https://memindsport.it/#medicalbusiness",
              name: "MeMindSport — MetaCare SRL",
              legalName: "MetaCare SRL",
              alternateName: "MeMindSport",
              url: "https://memindsport.it",
              logo: "https://memindsport.it/favicon.png",
              image: "https://memindsport.it/favicon.png",
              description:
                "Centro sanitario autorizzato specializzato in psicologia dello sport, mental coaching e ambienti immersivi VR per atleti, squadre e federazioni.",
              medicalSpecialty: ["Psychiatric", "PublicHealth"],
              vatID: "IT03102350307",
              taxID: "03102350307",
              identifier: {
                "@type": "PropertyValue",
                propertyID: "Autorizzazione Sanitaria Regione FVG",
                value: "n. 4710 del 13/01/2026",
              },
              address: {
                "@type": "PostalAddress",
                streetAddress: "Via Pola 7",
                addressLocality: "Codroipo",
                postalCode: "33033",
                addressRegion: "UD",
                addressCountry: "IT",
              },
              email: "info@memindsport.it",
              areaServed: "IT",
              priceRange: "€€",
            },
            {
              "@type": "SportsActivityLocation",
              "@id": "https://memindsport.it/#sportsactivitylocation",
              name: "MeMindSport — Allenamento mentale per atleti",
              url: "https://memindsport.it",
              parentOrganization: { "@id": "https://memindsport.it/#medicalbusiness" },
              description:
                "Percorsi di preparazione mentale erogati da psicologi sportivi iscritti all'Ordine e mental coach certificati (CONI / ICF / ECA), con sessioni in ambienti immersivi VR.",
              sport: [
                "Sports psychology",
                "Mental coaching",
                "Athletic performance training",
              ],
              address: {
                "@type": "PostalAddress",
                streetAddress: "Via Pola 7",
                addressLocality: "Codroipo",
                postalCode: "33033",
                addressRegion: "UD",
                addressCountry: "IT",
              },
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ConsentProvider>
        <AuthProvider>
          <Outlet />
          <QuizModal />
          <CookieBanner />
          <Toaster position="top-right" />
          <ConditionalScript
            category="marketing"
            id="fb-pixel-script"
            innerHTML={`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '763288839671636'); fbq('track', 'PageView');`}
          />
          <noscript>
            <img
              height="1"
              width="1"
              src="https://www.facebook.com/tr?id=763288839671636&ev=PageView&noscript=1"
              alt=""
              style={{ display: "none" }}
            />
          </noscript>
        </AuthProvider>
      </ConsentProvider>
    </QueryClientProvider>
  );
}

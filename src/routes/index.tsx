import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { ProofBar } from "@/components/site/ProofBar";
import { Marquee } from "@/components/site/Marquee";
import { Problema } from "@/components/site/Problema";
import { PhotoBreak } from "@/components/site/PhotoBreak";
import { Posizionamento } from "@/components/site/Posizionamento";
import { ComeFunziona } from "@/components/site/ComeFunziona";
import { VRSection } from "@/components/site/VRSection";
import { DueFigure } from "@/components/site/DueFigure";
import { Benefici } from "@/components/site/Benefici";
import { Pilastri } from "@/components/site/Pilastri";
import { Testimonial } from "@/components/site/Testimonial";
import { Ambasciatori } from "@/components/site/Ambasciatori";
import { Prezzi } from "@/components/site/Prezzi";
import { Blog } from "@/components/site/Blog";
import { FAQ } from "@/components/site/FAQ";
import { CTAFinal } from "@/components/site/CTAFinal";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MeMindSport — Psicologia dello sport e mental coaching" },
      {
        name: "description",
        content:
          "Allenamento mentale per atleti: psicologia dello sport, mental coaching e ambienti immersivi VR per concentrazione, pressione e performance.",
      },
      {
        name: "keywords",
        content:
          "psicologia sportiva online, mental coaching sportivo, allenamento mentale, psicologo sportivo online, mental coach atleti, performance sportiva, ansia da prestazione, realtà virtuale sport, ambienti immersivi, preparazione mentale gara",
      },
      { property: "og:title", content: "MeMindSport — Allenamento mentale per atleti" },
      { property: "og:description", content: "Psicologia dello sport, mental coaching e ambienti immersivi per migliorare concentrazione, pressione e performance." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://memindsport.it/" },
    ],
    links: [{ rel: "canonical", href: "https://memindsport.it/" }],
  }),
  component: Index,
});

function Index() {
  useReveal();
  return (
    <main className="bg-background">
      <Nav />
      <Hero />
      <ProofBar />
      <Problema />
      <Marquee />
      <Posizionamento />
      <PhotoBreak />
      <ComeFunziona />
      <VRSection />
      <DueFigure />
      <Benefici />
      <Pilastri />
      <Testimonial />
      <Prezzi />
      <Blog />
      <FAQ />
      <CTAFinal />
      <Footer />
    </main>
  );
}

import logoSrc from "@/assets/logo-mmsport.png";

type LogoProps = { variant?: "light" | "dark"; className?: string };

export function Logo({ variant = "light", className = "" }: LogoProps) {
  return (
    <img
      src={logoSrc}
      alt="MeMindSport — Psicologia dello sport e mental coaching"
      className={`${className} ${variant === "dark" ? "brightness-0 invert" : ""}`}
    />
  );
}

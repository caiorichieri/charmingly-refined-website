import logoSrc from "@/assets/logo-mmsport.png";

type LogoProps = { variant?: "light" | "dark"; className?: string };

export function Logo({ variant = "light", className = "" }: LogoProps) {
  return (
    <img
      src={logoSrc}
      alt="MMSport"
      className={`${className} ${variant === "dark" ? "brightness-0 invert" : ""}`}
    />
  );
}

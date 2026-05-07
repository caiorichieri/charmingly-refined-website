type LogoProps = { variant?: "light" | "dark"; className?: string };

export function Logo({ variant = "light", className = "" }: LogoProps) {
  const textFill = variant === "light" ? "#1e1e1c" : "#ffffff";
  const lc3 = variant === "light" ? "#1d1d1b" : "#ffffff";
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="110 40 280 90"
      aria-label="MeMindSport"
    >
      <path d="M198.4,70.93c5.04-6.92,12.65-11.89,20.97-13.88,9.22-2.21,18.9-.86,28.22.92,18.49,3.52,36.78,8.69,55.57,9.76,6.02.34,12.47.13,17.43-3.3" fill="none" stroke="#e30613" strokeMiterlimit={10} strokeWidth={1.5} />
      <path d="M205.5,67.67c5.04-6.92,12.65-11.89,20.97-13.88,9.22-2.21,18.9-.86,28.22.92,18.49,3.52,36.78,8.69,55.57,9.76,6.02.34,12.47.13,17.43-3.3" fill="none" stroke="#2fac66" strokeMiterlimit={10} strokeWidth={1.5} />
      <path d="M211.79,64.78c5.04-6.92,12.65-11.89,20.97-13.88,9.22-2.21,18.9-.86,28.22.92,18.49,3.52,36.78,8.69,55.57,9.76,6.02.34,12.47.13,17.43-3.3" fill="none" stroke="#36a9e1" strokeMiterlimit={10} strokeWidth={1.5} />
      <path d="M218.25,61.91c5.04-6.92,12.65-11.89,20.97-13.88,9.22-2.21,18.9-.86,28.22.92,18.49,3.52,36.78,8.69,55.57,9.76,6.02.34,12.47.13,17.43-3.3" fill="none" stroke={lc3} strokeMiterlimit={10} strokeWidth={1.5} />
      <path d="M225.86,59.15c5.04-6.92,12.65-11.89,20.97-13.88,9.22-2.21,18.9-.86,28.22.92,18.49,3.52,36.78,8.69,55.57,9.76,6.02.34,12.47.13,17.43-3.3" fill="none" stroke="#ffed00" strokeMiterlimit={10} strokeWidth={1.5} />
      <text
        transform="translate(122.57 109.02) scale(1.02 1)"
        fill={textFill}
        fontFamily="Barlow Condensed, sans-serif"
        fontWeight={800}
        fontSize={62}
      >
        MeMindSport
      </text>
    </svg>
  );
}

import { openQuiz } from "./openQuiz";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  children?: React.ReactNode;
  variant?: "primary" | "outline-light";
}

export function QuizCTA({ className, children, variant = "primary" }: Props) {
  const base = variant === "primary" ? "btn-primary" : "btn-outline-light";
  return (
    <button type="button" onClick={openQuiz} className={cn(base, className)}>
      {children ?? <>Che tipo di atleta sei? →</>}
    </button>
  );
}

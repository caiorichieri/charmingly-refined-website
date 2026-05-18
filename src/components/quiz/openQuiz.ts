export const QUIZ_OPEN_EVENT = "mm:open-quiz";

export function openQuiz() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(QUIZ_OPEN_EVENT));
}

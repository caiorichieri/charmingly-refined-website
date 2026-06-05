import { useConsent } from "@/contexts/ConsentContext";

export function ManageCookiesLink({ className }: { className?: string }) {
  const { openBanner } = useConsent();
  return (
    <button
      type="button"
      onClick={openBanner}
      className={
        className ??
        "block text-[13px] text-white/45 hover:text-white mb-2 transition-colors text-left"
      }
    >
      Gestisci cookie
    </button>
  );
}

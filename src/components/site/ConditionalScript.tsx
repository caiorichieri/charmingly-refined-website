import { useEffect } from "react";
import { useConsent, type ConsentCategory } from "@/contexts/ConsentContext";

/**
 * Carica uno <script> di terza parte SOLO se l'utente ha acconsentito alla categoria indicata.
 * Esempio: <ConditionalScript category="analytics" src="https://www.googletagmanager.com/gtag/js?id=G-XXX" />
 */
export function ConditionalScript({
  category,
  src,
  innerHTML,
  id,
  async = true,
  defer = false,
}: {
  category: Exclude<ConsentCategory, "necessary">;
  src?: string;
  innerHTML?: string;
  id?: string;
  async?: boolean;
  defer?: boolean;
}) {
  const { hasConsent } = useConsent();
  const allowed = hasConsent(category);

  useEffect(() => {
    if (!allowed) return;
    const scriptId = id ?? (src ? `cs-${btoa(src).slice(0, 16)}` : undefined);
    if (scriptId && document.getElementById(scriptId)) return;

    const el = document.createElement("script");
    if (scriptId) el.id = scriptId;
    if (src) el.src = src;
    if (innerHTML) el.text = innerHTML;
    el.async = async;
    el.defer = defer;
    document.head.appendChild(el);

    return () => {
      if (scriptId) document.getElementById(scriptId)?.remove();
    };
  }, [allowed, src, innerHTML, id, async, defer]);

  return null;
}

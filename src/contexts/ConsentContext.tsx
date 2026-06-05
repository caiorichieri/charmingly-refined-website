import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type ConsentCategory = "necessary" | "analytics" | "marketing";

export type ConsentChoice = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
};

const STORAGE_KEY = "memind:cookie-consent:v1";

type Ctx = {
  choice: ConsentChoice | null;
  hasConsent: (c: ConsentCategory) => boolean;
  setChoice: (c: Omit<ConsentChoice, "decidedAt"> | null) => void;
  openBanner: () => void;
  bannerOpen: boolean;
  closeBanner: () => void;
};

const ConsentContext = createContext<Ctx | null>(null);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [choice, setChoiceState] = useState<ConsentChoice | null>(null);
  const [bannerOpen, setBannerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setChoiceState(JSON.parse(raw));
      else setBannerOpen(true);
    } catch {
      setBannerOpen(true);
    }
    setHydrated(true);
  }, []);

  const setChoice = useCallback((c: Omit<ConsentChoice, "decidedAt"> | null) => {
    if (c === null) {
      localStorage.removeItem(STORAGE_KEY);
      setChoiceState(null);
      setBannerOpen(true);
      return;
    }
    const full: ConsentChoice = { ...c, decidedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
    setChoiceState(full);
    setBannerOpen(false);
  }, []);

  const hasConsent = useCallback(
    (cat: ConsentCategory) => {
      if (cat === "necessary") return true;
      return !!choice?.[cat];
    },
    [choice]
  );

  const value = useMemo<Ctx>(
    () => ({
      choice,
      hasConsent,
      setChoice,
      openBanner: () => setBannerOpen(true),
      closeBanner: () => setBannerOpen(false),
      bannerOpen: hydrated && bannerOpen,
    }),
    [choice, hasConsent, setChoice, bannerOpen, hydrated]
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used inside ConsentProvider");
  return ctx;
}

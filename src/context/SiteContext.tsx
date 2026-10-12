import { createContext, useContext, type ReactNode } from "react";
import { useSettings } from "@/hooks/useSiteData";
import type { PaymentInfo, SiteIdentity } from "@/lib/types";

interface SiteContextValue {
  identity: SiteIdentity;
  payment: PaymentInfo;
  loading: boolean;
  error: boolean;
  reload: () => void;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const value = useSettings();
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    throw new Error("useSite must be used within SiteProvider");
  }
  return ctx;
}
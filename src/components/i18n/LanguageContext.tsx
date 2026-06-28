import { createContext, useContext, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";

export type Lang = "cs" | "en";

interface LanguageContextType {
  lang: Lang;
  t: (cs: string, en: string) => string;
  /** Pick the right value/fallback chain for editable content. */
  pick: (cs: string | undefined, en: string | undefined, fallback?: string) => string;
}

const Ctx = createContext<LanguageContextType | undefined>(undefined);

/**
 * Derives language from the current URL. Pages under `/en` are English,
 * everything else Czech.
 */
function detectLang(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "cs";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lang = detectLang(pathname);

  const t = (cs: string, en: string) => (lang === "en" ? en : cs);

  const pick = (cs: string | undefined, en: string | undefined, fallback = "") => {
    if (lang === "en") {
      const v = en?.trim();
      if (v) return v;
    }
    return cs?.trim() || fallback;
  };

  return <Ctx.Provider value={{ lang, t, pick }}>{children}</Ctx.Provider>;
}

export function useLang(): LanguageContextType {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return {
      lang: "cs",
      t: (cs) => cs,
      pick: (cs, _en, fallback = "") => cs?.trim() || fallback,
    };
  }
  return ctx;
}

/** Build the equivalent route path in the other language. */
export function switchLangPath(pathname: string, target: Lang): string {
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  if (target === "en") {
    if (isEn) return pathname;
    if (pathname === "/") return "/en";
    if (pathname === "/rezervace") return "/en/booking";
    return "/en";
  }
  // target = "cs"
  if (!isEn) return pathname;
  if (pathname === "/en") return "/";
  if (pathname === "/en/booking") return "/rezervace";
  return "/";
}

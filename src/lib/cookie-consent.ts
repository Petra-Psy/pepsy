import { useEffect, useState } from "react";

export type CookieConsent = "accepted" | "rejected" | null;

const STORAGE_KEY = "cookie-consent";
const EVENT = "cookie-consent-change";

export function getConsent(): CookieConsent {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "accepted" || v === "rejected" ? v : null;
}

export function setConsent(value: Exclude<CookieConsent, null>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, value);
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function clearConsent() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useCookieConsent(): CookieConsent {
  const [consent, setState] = useState<CookieConsent>(null);
  useEffect(() => {
    setState(getConsent());
    const handler = () => setState(getConsent());
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return consent;
}

import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { useCookieConsent, setConsent } from "@/lib/cookie-consent";
import { useLang } from "@/components/i18n/LanguageContext";

export function CookieConsentBanner() {
  const consent = useCookieConsent();
  const { lang } = useLang();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || consent !== null) return null;

  const t = {
    text:
      lang === "en"
        ? "This site uses essential cookies for it to work. With your consent, we also use analytics cookies to understand traffic. You can change your choice anytime in the Privacy section."
        : "Tento web používá nezbytné cookies pro svůj chod. S vaším souhlasem používáme také analytické cookies pro sledování návštěvnosti. Volbu můžete kdykoliv změnit v sekci Ochrana osobních údajů.",
    accept: lang === "en" ? "Accept all" : "Přijmout vše",
    reject: lang === "en" ? "Only essential" : "Jen nezbytné",
  };

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50">
      <div className="rounded-2xl border border-border bg-background/95 backdrop-blur shadow-lg p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Cookie className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-muted-foreground">{t.text}</div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 justify-end">
          <button
            type="button"
            onClick={() => setConsent("rejected")}
            className="px-3 py-1.5 rounded-full border border-input text-xs sm:text-sm hover:bg-accent"
          >
            {t.reject}
          </button>
          <button
            type="button"
            onClick={() => setConsent("accepted")}
            className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs sm:text-sm hover:opacity-90"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}

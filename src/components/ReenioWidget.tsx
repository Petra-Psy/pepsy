import { useEffect } from "react";
import { useSiteContent } from "@/components/admin/SiteContentContext";

/**
 * Vloží Reenio rezervační widget do stránky.
 * Script URL bere ze site_content klíče `booking.widget_url`
 * (např. https://reenio.cz/cs/XXXX/widget-iframe.js).
 *
 * Reenio script si sám najde všechny `.reenio-iframe` divy a vyrenderuje do nich iframe.
 */
export function ReenioWidget({ className }: { className?: string }) {
  const { content } = useSiteContent();
  const scriptUrl = content["booking.widget_url"]?.trim();

  useEffect(() => {
    if (!scriptUrl) return;
    // Idempotentní vložení – pokud už script existuje, neduplikuj ho.
    const selector = `script[data-reenio-src="${scriptUrl}"]`;
    if (document.querySelector(selector)) return;

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.defer = true;
    script.dataset.reenioSrc = scriptUrl;
    document.body.appendChild(script);
    // Záměrně necleanupujeme – widget je permanentní součást stránky.
  }, [scriptUrl]);

  if (!scriptUrl) {
    return (
      <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
        Rezervační widget není nakonfigurován. Otevřete admin nastavení (ozubené kolečko) a vyplňte Reenio widget URL.
      </div>
    );
  }

  return <div className={className ?? "reenio-iframe w-full"} data-size="auto" />;
}

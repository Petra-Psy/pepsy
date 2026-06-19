import { useEffect, useRef, useState } from "react";
import { X, Loader2 } from "lucide-react";

interface BookingModalProps {
  /** URL of the Reenio widget script (e.g. https://reenio.cz/cs/XXXX/widget-iframe.js) */
  url: string;
  onClose: () => void;
}

export function BookingModal({ url, onClose }: BookingModalProps) {
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  // Load the Reenio widget script and observe when it injects the iframe.
  useEffect(() => {
    if (!url) return;
    const container = containerRef.current;
    if (!container) return;

    const isReenioScript = /reenio\.cz\/.+\/widget-iframe\.js/i.test(url);

    // Watch for the iframe Reenio injects into the .reenio-iframe div.
    const observer = new MutationObserver(() => {
      if (container.querySelector("iframe")) setLoaded(true);
    });
    observer.observe(container, { childList: true, subtree: true });

    // If a Reenio script tag is already on the page, remove it so it re-runs
    // and targets our freshly-mounted .reenio-iframe container.
    document
      .querySelectorAll<HTMLScriptElement>(`script[data-reenio-widget="1"]`)
      .forEach((s) => s.remove());

    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.defer = true;
    if (isReenioScript) script.dataset.reenioWidget = "1";
    document.body.appendChild(script);

    // Fallback timeout: hide spinner even if mutation observer misses it.
    const t = window.setTimeout(() => setLoaded(true), 6000);

    return () => {
      observer.disconnect();
      window.clearTimeout(t);
      script.remove();
    };
  }, [url]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full sm:h-[85vh] sm:max-w-4xl bg-card sm:rounded-2xl overflow-hidden shadow-2xl border border-border flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card/95">
          <span className="text-sm font-medium text-muted-foreground">Online rezervace</span>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Zavřít"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="relative flex-1 bg-background overflow-auto">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}
          <div
            ref={containerRef}
            className="reenio-iframe w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0 [&>iframe]:block"
            data-size="auto"
          />
        </div>
      </div>
    </div>
  );
}

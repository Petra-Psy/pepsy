import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";

interface BookingModalProps {
  url: string;
  onClose: () => void;
}

export function BookingModal({ url, onClose }: BookingModalProps) {
  const [loaded, setLoaded] = useState(false);

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
        <div className="relative flex-1 bg-background">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}
          <iframe
            src={url}
            title="Rezervační systém"
            className="w-full h-full border-0"
            onLoad={() => setLoaded(true)}
            allow="payment"
          />
        </div>
      </div>
    </div>
  );
}

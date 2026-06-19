import { useEffect, useState } from "react";

// Jednoduchá ROT13-podobná obfuskace, aby v HTML/zdrojáku nebyl čitelný e-mail
// ani telefon. Hodnota se sestaví až v prohlížeči po mountu.
function decode(s: string) {
  // base64 → text
  try {
    if (typeof atob === "function") return atob(s);
  } catch {
    /* noop */
  }
  return s;
}

function encode(s: string) {
  if (typeof btoa === "function") return btoa(s);
  // SSR fallback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const B: any = (globalThis as any).Buffer;
  if (B) return B.from(s, "utf-8").toString("base64");
  return s;
}

interface Props {
  value: string;
  type: "email" | "phone";
  className?: string;
}

export function ObfuscatedContact({ value, type, className }: Props) {
  const [revealed, setRevealed] = useState(false);
  const encoded = encode(value);

  // Mount na klientu — nebude v SSR HTML
  useEffect(() => {
    setRevealed(true);
  }, []);

  if (!revealed) {
    return (
      <span className={className} aria-hidden="true">
        {type === "email" ? "[ochrana proti spamu]" : "[zobrazit číslo]"}
      </span>
    );
  }

  const real = decode(encoded);
  const href = type === "email" ? `mailto:${real}` : `tel:${real.replace(/\s/g, "")}`;

  // Vykreslíme reverzně a CSS otočíme zpět — robotí scrapeři typicky čtou textContent
  const display = real.split("").reverse().join("");

  return (
    <a
      href={href}
      className={className}
      style={{ unicodeBidi: "bidi-override", direction: "rtl" }}
    >
      <span style={{ unicodeBidi: "bidi-override", direction: "ltr" }}>{display}</span>
    </a>
  );
}

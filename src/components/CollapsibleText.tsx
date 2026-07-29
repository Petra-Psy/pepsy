import { useMemo, useState } from "react";
import { renderRichMultiline } from "@/lib/rich-text";
import { useLang } from "@/components/i18n/LanguageContext";


interface Props {
  text: string;
  sentences?: number;
  className?: string;
}

function splitSentences(text: string): string[] {
  // Split on newlines first (each line = its own segment), then on sentence
  // terminators within each line. Preserves original characters so joining
  // the first N parts reproduces the source prefix exactly.
  const out: string[] = [];
  const lines = text.split(/(\n+)/); // keep newline separators as their own tokens
  for (const chunk of lines) {
    if (!chunk) continue;
    if (/^\n+$/.test(chunk)) {
      if (out.length) out[out.length - 1] += chunk;
      continue;
    }
    const matches = chunk.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) ?? [chunk];
    for (const m of matches) out.push(m);
  }
  return out.filter((s) => s.trim().length > 0);
}

export function CollapsibleText({ text, sentences = 2, className = "" }: Props) {
  const { t } = useLang();

  const [expanded, setExpanded] = useState(false);
  const { preview, hasMore } = useMemo(() => {
    const parts = splitSentences(text);
    if (parts.length <= sentences) return { preview: text, hasMore: false };
    return { preview: parts.slice(0, sentences).join("").trim(), hasMore: true };
  }, [text, sentences]);

  const shown = expanded || !hasMore ? text : preview;

  return (
    <div className={className}>
      <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
        {renderRichMultiline(shown)}
        {hasMore && !expanded && <span className="text-foreground/50">… </span>}
      </p>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-sm font-medium text-primary hover:underline"
        >
          {expanded ? t("Zobrazit méně", "Show less") : t("Zobrazit více", "Show more")}
        </button>
      )}

    </div>
  );
}

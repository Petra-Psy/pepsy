import { Fragment, type ReactNode } from "react";

/**
 * Lightweight markdown-ish inline renderer.
 * Supports **bold** (rendered as highlighted strong) and _italic_.
 * Safe: builds React nodes, never injects HTML.
 */
export function renderRichInline(text: string): ReactNode {
  if (!text) return text;
  // Tokenize by ** and _ in a single pass.
  const tokens: Array<{ type: "text" | "bold" | "italic"; value: string }> = [];
  let i = 0;
  while (i < text.length) {
    if (text.startsWith("**", i)) {
      const end = text.indexOf("**", i + 2);
      if (end !== -1) {
        tokens.push({ type: "bold", value: text.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    if (text[i] === "_") {
      const end = text.indexOf("_", i + 1);
      if (end !== -1 && end > i + 1) {
        tokens.push({ type: "italic", value: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    // accumulate plain char
    const last = tokens[tokens.length - 1];
    if (last && last.type === "text") last.value += text[i];
    else tokens.push({ type: "text", value: text[i] });
    i++;
  }

  return tokens.map((t, idx) => {
    if (t.type === "bold")
      return (
        <strong key={idx} className="font-semibold text-primary">
          {t.value}
        </strong>
      );
    if (t.type === "italic") return <em key={idx}>{t.value}</em>;
    return <Fragment key={idx}>{t.value}</Fragment>;
  });
}

/** Render with newline preservation (for multiline text). */
export function renderRichMultiline(text: string): ReactNode {
  if (!text) return text;
  const lines = text.split("\n");
  return lines.map((line, idx) => (
    <Fragment key={idx}>
      {renderRichInline(line)}
      {idx < lines.length - 1 ? <br /> : null}
    </Fragment>
  ));
}

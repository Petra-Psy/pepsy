import { useEffect, useRef, useState, type ElementType } from "react";
import { Bold, Check, Italic, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "./AdminContext";
import { useSiteContent } from "./SiteContentContext";
import { renderRichInline, renderRichMultiline } from "@/lib/rich-text";

interface Props {
  contentKey: string;
  defaultValue: string;
  as?: ElementType;
  className?: string;
  multiline?: boolean;
  /** Disable rich text rendering (plain text only). Defaults to true. */
  richText?: boolean;
}

export function EditableText({
  contentKey,
  defaultValue,
  as: Component = "span",
  className = "",
  multiline = false,
  richText = true,
}: Props) {
  const { editMode, isAdmin } = useAdmin();
  const { content, updateContent } = useSiteContent();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const current = content[contentKey] ?? defaultValue;

  useEffect(() => {
    if (editing) {
      const el = multiline ? textareaRef.current : inputRef.current;
      el?.focus();
    }
  }, [editing, multiline]);

  const cancelRef = useRef(false);

  const save = async (nextValue?: string) => {
    const v = nextValue ?? value;
    if (v === current) {
      setEditing(false);
      return;
    }
    setSaving(true);
    const { error } = await updateContent(contentKey, v);
    setSaving(false);
    if (error) toast.error("Nepodařilo se uložit");
    else toast.success("Uloženo");
    setEditing(false);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (cancelRef.current) {
        cancelRef.current = false;
        setEditing(false);
        return;
      }
      save();
    }, 0);
  };

  const wrapSelection = (marker: string) => {
    const el = (multiline ? textareaRef.current : inputRef.current) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const before = value.slice(0, start);
    const sel = value.slice(start, end) || "text";
    const after = value.slice(end);
    const next = `${before}${marker}${sel}${marker}${after}`;
    setValue(next);
    requestAnimationFrame(() => {
      el.focus();
      const cursorStart = start + marker.length;
      const cursorEnd = cursorStart + sel.length;
      el.setSelectionRange(cursorStart, cursorEnd);
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
      e.preventDefault();
      wrapSelection("**");
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
      e.preventDefault();
      wrapSelection("_");
      return;
    }
    if (e.key === "Escape") {
      cancelRef.current = true;
      setEditing(false);
    }
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      save();
    }
  };

  const renderValue = () => {
    if (!richText) return current;
    return multiline ? renderRichMultiline(current) : renderRichInline(current);
  };

  if (!isAdmin || !editMode) {
    return <Component className={className}>{renderValue()}</Component>;
  }

  if (editing) {
    const toolbar = (
      <div className="flex gap-1 mb-1">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            wrapSelection("**");
          }}
          className="p-1 bg-card border border-border rounded hover:bg-muted"
          title="Zvýraznění (Ctrl+B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            wrapSelection("_");
          }}
          className="p-1 bg-card border border-border rounded hover:bg-muted"
          title="Kurzíva (Ctrl+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
      </div>
    );

    return (
      <span className="inline-flex flex-col items-start gap-0 align-top">
        {toolbar}
        <span className="inline-flex items-start gap-1">
          {multiline ? (
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={onKeyDown}
              rows={5}
              className={`${className} bg-card border border-primary/60 rounded px-2 py-1 min-w-[260px] focus:outline-none focus:ring-2 focus:ring-primary/40`}
            />
          ) : (
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={onKeyDown}
              className={`${className} bg-card border border-primary/60 rounded px-2 py-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-primary/40`}
            />
          )}
          <button
            type="button"
            onMouseDown={() => save()}
            disabled={saving}
            className="p-1.5 bg-primary text-primary-foreground rounded hover:opacity-90"
            title="Uložit"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={() => {
              cancelRef.current = true;
            }}
            onClick={() => setEditing(false)}
            className="p-1.5 bg-muted text-muted-foreground rounded hover:opacity-90"
            title="Zrušit"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      </span>
    );
  }

  return (
    <span className="group relative inline-block">
      <Component
        className={`${className} cursor-pointer rounded outline outline-2 outline-dashed outline-transparent hover:outline-primary/40 transition-colors`}
        onClick={() => {
          setValue(current);
          setEditing(true);
        }}
      >
        {renderValue()}
      </Component>
      <Pencil className="w-3 h-3 absolute -top-1 -right-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
    </span>
  );
}

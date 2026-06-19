import { useEffect, useRef, useState, type ElementType } from "react";
import { Check, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "./AdminContext";
import { useSiteContent } from "./SiteContentContext";

interface Props {
  contentKey: string;
  defaultValue: string;
  as?: ElementType;
  className?: string;
  multiline?: boolean;
}

export function EditableText({
  contentKey,
  defaultValue,
  as: Component = "span",
  className = "",
  multiline = false,
}: Props) {
  const { editMode, isAdmin } = useAdmin();
  const { content, updateContent } = useSiteContent();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const current = content[contentKey] ?? defaultValue;

  useEffect(() => {
    if (editing && ref.current) ref.current.focus();
  }, [editing]);

  const save = async () => {
    if (value === current) {
      setEditing(false);
      return;
    }
    setSaving(true);
    const { error } = await updateContent(contentKey, value);
    setSaving(false);
    if (error) toast.error("Nepodařilo se uložit");
    else toast.success("Uloženo");
    setEditing(false);
  };

  if (!isAdmin || !editMode) {
    return <Component className={className}>{current}</Component>;
  }

  if (editing) {
    return (
      <span className="inline-flex items-start gap-1 align-top">
        {multiline ? (
          <textarea
            ref={ref as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setEditing(false);
            }}
            rows={4}
            className={`${className} bg-card border border-primary/60 rounded px-2 py-1 min-w-[260px] focus:outline-none focus:ring-2 focus:ring-primary/40`}
          />
        ) : (
          <input
            ref={ref as React.RefObject<HTMLInputElement>}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") setEditing(false);
            }}
            className={`${className} bg-card border border-primary/60 rounded px-2 py-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-primary/40`}
          />
        )}
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="p-1.5 bg-primary text-primary-foreground rounded hover:opacity-90"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="p-1.5 bg-muted text-muted-foreground rounded hover:opacity-90"
        >
          <X className="w-3.5 h-3.5" />
        </button>
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
        {current}
      </Component>
      <Pencil className="w-3 h-3 absolute -top-1 -right-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
    </span>
  );
}

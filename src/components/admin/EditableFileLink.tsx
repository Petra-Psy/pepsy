import { useRef, useState, type ReactNode } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "./AdminContext";
import { useSiteContent } from "./SiteContentContext";
import { EditableText } from "./EditableText";

interface Props {
  /** Key for the uploaded file in site_files (e.g. "pricing.agreement.pdf"). */
  fileKey: string;
  /** Key for the visible link label in site_content. */
  labelKey: string;
  labelDefault: string;
  className?: string;
  accept?: string;
  /** Shown to admin if no file uploaded yet. */
  placeholderHint?: ReactNode;
}

export function EditableFileLink({
  fileKey,
  labelKey,
  labelDefault,
  className = "underline underline-offset-4 hover:text-primary",
  accept = "application/pdf",
  placeholderHint = "Nahrát PDF",
}: Props) {
  const { isAdmin, editMode } = useAdmin();
  const { files, updateFile } = useSiteContent();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const url = files[fileKey];
  const editable = isAdmin && editMode;

  const handlePicked = async (file: File) => {
    setUploading(true);
    const { error } = await updateFile(fileKey, file);
    setUploading(false);
    if (error) toast.error("Nahrání selhalo");
    else toast.success("Soubor aktualizován");
  };

  if (editable) {
    return (
      <span className="inline-flex items-center gap-2">
        <span className={className}>
          <EditableText contentKey={labelKey} defaultValue={labelDefault} />
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handlePicked(f);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary text-primary-foreground hover:opacity-90"
          title={url ? "Nahradit PDF" : "Nahrát PDF"}
        >
          {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileUp className="w-3 h-3" />}
          {uploading ? "Nahrávám…" : url ? "Nahradit PDF" : placeholderHint}
        </button>
      </span>
    );
  }

  if (!url) return null;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
      {labelDefault.split("|")[0] /* fallback */}
      <EditableTextReadonly contentKey={labelKey} defaultValue={labelDefault} />
    </a>
  );
}

// Tiny read-only helper to avoid extra round-trips: re-uses content map from context.
function EditableTextReadonly({ contentKey, defaultValue }: { contentKey: string; defaultValue: string }) {
  const { content } = useSiteContent();
  return <>{content[contentKey] ?? defaultValue}</>;
}

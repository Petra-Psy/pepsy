import { useRef, useState } from "react";
import { FileUp, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "./AdminContext";
import { useSiteContent } from "./SiteContentContext";

interface Props {
  /** Key for the uploaded file in site_files (e.g. "pricing.agreement.pdf"). */
  fileKey: string;
  /** Key for the visible link label in site_content. */
  labelKey: string;
  labelDefault: string;
  className?: string;
  accept?: string;
}

export function EditableFileLink({
  fileKey,
  labelKey,
  labelDefault,
  className = "underline underline-offset-4 hover:text-primary",
  accept = "application/pdf",
}: Props) {
  const { isAdmin, editMode } = useAdmin();
  const { files, content, updateFile, updateContent } = useSiteContent();
  const [uploading, setUploading] = useState(false);
  const [editingLabel, setEditingLabel] = useState(false);
  const [draftLabel, setDraftLabel] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const url = files[fileKey];
  const label = content[labelKey] ?? labelDefault;
  const editable = isAdmin && editMode;

  const handlePicked = async (file: File) => {
    setUploading(true);
    const { error } = await updateFile(fileKey, file);
    setUploading(false);
    if (error) toast.error("Nahrání selhalo");
    else toast.success("Soubor aktualizován");
  };

  const saveLabel = async () => {
    const next = draftLabel.trim();
    setEditingLabel(false);
    if (!next || next === label) return;
    const { error } = await updateContent(labelKey, next);
    if (error) toast.error("Uložení textu selhalo");
  };

  if (editable) {
    return (
      <span className="inline-flex flex-wrap items-center gap-2">
        {editingLabel ? (
          <input
            autoFocus
            value={draftLabel}
            onChange={(e) => setDraftLabel(e.target.value)}
            onBlur={saveLabel}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              if (e.key === "Escape") setEditingLabel(false);
            }}
            className="px-2 py-1 rounded border border-primary/40 bg-background text-sm"
          />
        ) : url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
            {label}
          </a>
        ) : (
          <span className={className}>{label}</span>
        )}
        <button
          type="button"
          onClick={() => {
            setDraftLabel(label);
            setEditingLabel(true);
          }}
          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-border hover:bg-muted"
          title="Upravit text odkazu"
        >
          <Pencil className="w-3 h-3" />
          Text
        </button>
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
        >
          {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileUp className="w-3 h-3" />}
          {uploading ? "Nahrávám…" : url ? "Nahradit PDF" : "Nahrát PDF"}
        </button>
      </span>
    );
  }

  if (!url) {
    // No PDF uploaded yet → render plain text so the sentence still reads naturally.
    return <span>{label}</span>;
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
      {label}
    </a>
  );
}

import { useRef, useState } from "react";
import { FileUp, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "./AdminContext";
import { useSiteContent } from "./SiteContentContext";
import { useLang } from "@/components/i18n/LanguageContext";

interface Props {
  /** Base key for the uploaded file in site_files (e.g. "pricing.agreement.pdf").
   *  The EN variant is stored under `${fileKey}.en`. */
  fileKey: string;
  /** Key for the visible link label in site_content (CZ+EN columns share this key). */
  labelKey: string;
  labelDefault: string;
  labelDefaultEn?: string;
  className?: string;
  accept?: string;
}

export function EditableFileLink({
  fileKey,
  labelKey,
  labelDefault,
  labelDefaultEn,
  className = "underline underline-offset-4 hover:text-primary",
  accept = "application/pdf",
}: Props) {
  const { isAdmin, editMode } = useAdmin();
  const { files, content, contentEn, updateFile, updateContent } = useSiteContent();
  const { lang } = useLang();
  const [uploading, setUploading] = useState(false);
  const [editingLabel, setEditingLabel] = useState(false);
  const [draftLabel, setDraftLabel] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Per-language storage key for the PDF. CZ keeps the original key for
  // backward compatibility; EN uses a `.en` suffix so both files coexist.
  const activeFileKey = lang === "en" ? `${fileKey}.en` : fileKey;
  // When viewing EN and no EN PDF is uploaded yet, fall back to CZ so the
  // link keeps working. In admin edit mode we DO NOT fall back — the upload
  // button must clearly target the active language.
  const url =
    files[activeFileKey] ??
    (lang === "en" && !(isAdmin && editMode) ? files[fileKey] : undefined);
  // Route the download through the language-specific storage key so we serve
  // the right PDF (and fall back inside the route if EN is missing).
  const fileHref = url ? `/api/soubor/${encodeURIComponent(activeFileKey)}` : "";

  const csLabel = content[labelKey];
  const enLabel = contentEn[labelKey];
  const label =
    lang === "en"
      ? (enLabel && enLabel.length > 0
          ? enLabel
          : (labelDefaultEn && labelDefaultEn.length > 0 ? labelDefaultEn : (csLabel ?? labelDefault)))
      : (csLabel && csLabel.length > 0 ? csLabel : labelDefault);
  const editable = isAdmin && editMode;

  const handlePicked = async (file: File) => {
    setUploading(true);
    const { error } = await updateFile(activeFileKey, file);
    setUploading(false);
    if (error) toast.error(lang === "en" ? "Upload failed" : "Nahrání selhalo");
    else toast.success(lang === "en" ? "File updated (EN)" : "Soubor aktualizován");
  };

  const saveLabel = async () => {
    const next = draftLabel.trim();
    setEditingLabel(false);
    if (!next || next === label) return;
    const { error } = await updateContent(labelKey, next, lang);
    if (error) toast.error(lang === "en" ? "Saving text failed" : "Uložení textu selhalo");
  };

  if (editable) {
    const uploadLabel = uploading
      ? (lang === "en" ? "Uploading…" : "Nahrávám…")
      : url
        ? (lang === "en" ? "Replace PDF (EN)" : "Nahradit PDF (CZ)")
        : (lang === "en" ? "Upload PDF (EN)" : "Nahrát PDF (CZ)");
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
          <a href={fileHref} target="_blank" rel="noopener noreferrer" className={className}>
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
          title={lang === "en" ? "Edit link text" : "Upravit text odkazu"}
        >
          <Pencil className="w-3 h-3" />
          {lang === "en" ? "Text" : "Text"}
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
          {uploadLabel}
        </button>
      </span>
    );
  }

  if (!url) {
    // No PDF uploaded yet → render plain text so the sentence still reads naturally.
    return <span>{label}</span>;
  }

  return (
    <a href={fileHref} target="_blank" rel="noopener noreferrer" className={className}>
      {label}
    </a>
  );
}

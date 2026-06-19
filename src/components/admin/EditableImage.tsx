import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "./AdminContext";
import { useSiteContent } from "./SiteContentContext";

interface Props {
  contentKey: string;
  defaultSrc: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
}

export function EditableImage({
  contentKey,
  defaultSrc,
  alt,
  className = "",
  imgClassName = "",
  loading = "lazy",
}: Props) {
  const { editMode, isAdmin } = useAdmin();
  const { images, updateImage } = useSiteContent();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const src = images[contentKey] ?? defaultSrc;

  const onFile = async (file: File) => {
    setUploading(true);
    const { error } = await updateImage(contentKey, file);
    setUploading(false);
    if (error) toast.error("Nahrání selhalo");
    else toast.success("Fotka aktualizována");
  };

  const editable = isAdmin && editMode;

  return (
    <div className={`relative ${className}`}>
      <img src={src} alt={alt} loading={loading} className={imgClassName} />
      {editable && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 m-auto h-fit w-fit flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:opacity-90"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
            {uploading ? "Nahrávám…" : "Změnit fotku"}
          </button>
          <div className="pointer-events-none absolute inset-0 ring-2 ring-dashed ring-primary/50 rounded" />
        </>
      )}
    </div>
  );
}

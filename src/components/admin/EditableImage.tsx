import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "./AdminContext";
import { useSiteContent } from "./SiteContentContext";
import { ImageCropDialog } from "./ImageCropDialog";

interface Props {
  contentKey: string;
  defaultSrc?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
  aspect?: number;
  cropShape?: "rect" | "round";
}

export function EditableImage({
  contentKey,
  defaultSrc,
  alt,
  className = "",
  imgClassName = "",
  loading = "lazy",
  aspect = 1,
  cropShape = "rect",
}: Props) {
  const { editMode, isAdmin } = useAdmin();
  const { images, isLoading, updateImage } = useSiteContent();
  const [uploading, setUploading] = useState(false);
  const [cropUrl, setCropUrl] = useState<string | null>(null);
  const [cropName, setCropName] = useState<string>("image");
  const inputRef = useRef<HTMLInputElement>(null);

  const stored = images[contentKey];
  // While the initial fetch is running and we have no cached/stored URL,
  // render an empty placeholder rather than flashing the bundled default.
  const src = stored ?? (isLoading ? undefined : defaultSrc);

  useEffect(() => {
    return () => {
      if (cropUrl) URL.revokeObjectURL(cropUrl);
    };
  }, [cropUrl]);

  const handlePicked = (file: File) => {
    if (cropUrl) URL.revokeObjectURL(cropUrl);
    setCropName(file.name);
    setCropUrl(URL.createObjectURL(file));
  };

  const handleConfirm = async (file: File) => {
    const url = cropUrl;
    setCropUrl(null);
    if (url) URL.revokeObjectURL(url);
    setUploading(true);
    const { error } = await updateImage(contentKey, file);
    setUploading(false);
    if (error) toast.error("Nahrání selhalo");
    else toast.success("Fotka aktualizována");
  };

  const handleCancel = () => {
    if (cropUrl) URL.revokeObjectURL(cropUrl);
    setCropUrl(null);
  };

  const editable = isAdmin && editMode;

  return (
    <div className={`relative ${className}`}>
      {src ? (
        <img src={src} alt={alt} loading={loading} className={imgClassName} />
      ) : (
        <div className={`${imgClassName} bg-muted animate-pulse`} aria-hidden />
      )}
      {editable && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
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
            className="absolute inset-0 m-auto h-fit w-fit flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:opacity-90"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
            {uploading ? "Nahrávám…" : "Změnit fotku"}
          </button>
          <div className="pointer-events-none absolute inset-0 ring-2 ring-dashed ring-primary/50 rounded" />
          <ImageCropDialog
            open={cropUrl !== null}
            imageUrl={cropUrl}
            aspect={aspect}
            cropShape={cropShape}
            fileName={cropName}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
          />
        </>
      )}
    </div>
  );
}

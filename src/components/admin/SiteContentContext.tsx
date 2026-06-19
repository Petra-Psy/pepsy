import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteContentContextType {
  content: Record<string, string>;
  images: Record<string, string>; // key -> signed URL
  isLoading: boolean;
  updateContent: (key: string, value: string) => Promise<{ error: unknown }>;
  updateImage: (key: string, file: File) => Promise<{ error: unknown }>;
}

const Ctx = createContext<SiteContentContextType | undefined>(undefined);

const BUCKET = "site-images";
const SIGN_EXPIRY = 60 * 60 * 24 * 365; // 1 year

async function signPath(path: string): Promise<string | null> {
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGN_EXPIRY);
  return data?.signedUrl ?? null;
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Record<string, string>>({});
  const [images, setImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  const refetch = async () => {
    const [{ data: texts }, { data: imgs }] = await Promise.all([
      supabase.from("site_content").select("key, value"),
      supabase.from("site_images").select("key, storage_path"),
    ]);
    const cMap: Record<string, string> = {};
    texts?.forEach((r) => (cMap[r.key] = r.value));
    setContent(cMap);

    const iMap: Record<string, string> = {};
    await Promise.all(
      (imgs ?? []).map(async (r) => {
        const url = await signPath(r.storage_path);
        if (url) iMap[r.key] = url;
      }),
    );
    setImages(iMap);
    setIsLoading(false);
  };

  useEffect(() => {
    refetch();
  }, []);

  const updateContent = async (key: string, value: string) => {
    const { error } = await supabase
      .from("site_content")
      .upsert({ key, value }, { onConflict: "key" });
    if (!error) setContent((p) => ({ ...p, [key]: value }));
    return { error };
  };

  const updateImage = async (key: string, file: File) => {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${key}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });
    if (upErr) return { error: upErr };
    const { error: dbErr } = await supabase
      .from("site_images")
      .upsert({ key, storage_path: path }, { onConflict: "key" });
    if (dbErr) return { error: dbErr };
    const url = await signPath(path);
    if (url) setImages((p) => ({ ...p, [key]: url }));
    return { error: null };
  };

  return (
    <Ctx.Provider value={{ content, images, isLoading, updateContent, updateImage }}>
      {children}
    </Ctx.Provider>
  );
}

export const useSiteContent = () => {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return {
      content: {},
      images: {},
      isLoading: false,
      updateContent: async () => ({ error: new Error("No provider") }),
      updateImage: async () => ({ error: new Error("No provider") }),
    } as SiteContentContextType;
  }
  return ctx;
};

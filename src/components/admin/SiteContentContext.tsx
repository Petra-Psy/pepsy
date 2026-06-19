import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteContentContextType {
  content: Record<string, string>;
  images: Record<string, string>; // key -> public URL
  isLoading: boolean;
  updateContent: (key: string, value: string) => Promise<{ error: unknown }>;
  updateImage: (key: string, file: File) => Promise<{ error: unknown }>;
}

const Ctx = createContext<SiteContentContextType | undefined>(undefined);

const BUCKET = "site-images";
const CACHE_KEY = "site-images-cache-v1";
const CONTENT_CACHE_KEY = "site-content-cache-v1";

function publicUrl(path: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function readCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeCache(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Record<string, string>>(
    () => readCache<Record<string, string>>(CONTENT_CACHE_KEY) ?? {},
  );
  const [images, setImages] = useState<Record<string, string>>(
    () => readCache<Record<string, string>>(CACHE_KEY) ?? {},
  );
  const [isLoading, setIsLoading] = useState(true);

  const refetch = async () => {
    const [{ data: texts }, { data: imgs }] = await Promise.all([
      supabase.from("site_content").select("key, value"),
      supabase.from("site_images").select("key, storage_path"),
    ]);
    const cMap: Record<string, string> = {};
    texts?.forEach((r) => (cMap[r.key] = r.value));
    setContent(cMap);
    writeCache(CONTENT_CACHE_KEY, cMap);

    const iMap: Record<string, string> = {};
    (imgs ?? []).forEach((r) => {
      iMap[r.key] = publicUrl(r.storage_path);
    });
    setImages(iMap);
    writeCache(CACHE_KEY, iMap);
    setIsLoading(false);
  };

  useEffect(() => {
    refetch();
  }, []);

  const updateContent = async (key: string, value: string) => {
    const { error } = await supabase
      .from("site_content")
      .upsert({ key, value }, { onConflict: "key" });
    if (!error) {
      setContent((p) => {
        const next = { ...p, [key]: value };
        writeCache(CONTENT_CACHE_KEY, next);
        return next;
      });
    }
    return { error };
  };

  const updateImage = async (key: string, file: File) => {
    // fetch previous path so we can clean it up afterwards
    const { data: prev } = await supabase
      .from("site_images")
      .select("storage_path")
      .eq("key", key)
      .maybeSingle();

    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${key}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "31536000",
      upsert: true,
    });
    if (upErr) return { error: upErr };
    const { error: dbErr } = await supabase
      .from("site_images")
      .upsert({ key, storage_path: path }, { onConflict: "key" });
    if (dbErr) return { error: dbErr };

    // remove the previous file from storage (best-effort)
    if (prev?.storage_path && prev.storage_path !== path) {
      await supabase.storage.from(BUCKET).remove([prev.storage_path]);
    }

    const url = publicUrl(path);
    setImages((p) => {
      const next = { ...p, [key]: url };
      writeCache(CACHE_KEY, next);
      return next;
    });
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

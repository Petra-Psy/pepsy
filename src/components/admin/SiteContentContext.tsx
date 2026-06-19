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
const IMG_CACHE_KEY = "site-images-cache-v2";
const TXT_CACHE_KEY = "site-content-cache-v2";

async function signPath(path: string): Promise<string | null> {
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGN_EXPIRY);
  return data?.signedUrl ?? null;
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
  // IMPORTANT: start empty on both server and client to avoid hydration mismatch.
  // Cache is loaded synchronously in a layout effect below.
  const [content, setContent] = useState<Record<string, string>>({});
  const [images, setImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hydrate from cache immediately after mount for instant paint on revisit.
    const cachedTxt = readCache<Record<string, string>>(TXT_CACHE_KEY);
    const cachedImg = readCache<Record<string, string>>(IMG_CACHE_KEY);
    if (cachedTxt) setContent(cachedTxt);
    if (cachedImg) setImages(cachedImg);

    let cancelled = false;
    (async () => {
      const [{ data: texts }, { data: imgs }] = await Promise.all([
        supabase.from("site_content").select("key, value"),
        supabase.from("site_images").select("key, storage_path"),
      ]);
      if (cancelled) return;

      const cMap: Record<string, string> = {};
      texts?.forEach((r) => (cMap[r.key] = r.value));
      setContent(cMap);
      writeCache(TXT_CACHE_KEY, cMap);

      const iMap: Record<string, string> = {};
      await Promise.all(
        (imgs ?? []).map(async (r) => {
          const url = await signPath(r.storage_path);
          if (url) iMap[r.key] = url;
        }),
      );
      if (cancelled) return;
      setImages(iMap);
      writeCache(IMG_CACHE_KEY, iMap);
      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateContent = async (key: string, value: string) => {
    const { error } = await supabase
      .from("site_content")
      .upsert({ key, value }, { onConflict: "key" });
    if (!error) {
      setContent((p) => {
        const next = { ...p, [key]: value };
        writeCache(TXT_CACHE_KEY, next);
        return next;
      });
    }
    return { error };
  };

  const updateImage = async (key: string, file: File) => {
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

    if (prev?.storage_path && prev.storage_path !== path) {
      await supabase.storage.from(BUCKET).remove([prev.storage_path]);
    }

    const url = await signPath(path);
    if (url) {
      setImages((p) => {
        const next = { ...p, [key]: url };
        writeCache(IMG_CACHE_KEY, next);
        return next;
      });
    }
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

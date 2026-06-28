import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Lang } from "@/components/i18n/LanguageContext";

interface SiteContentContextType {
  /** Czech values keyed by content key. */
  content: Record<string, string>;
  /** English values keyed by content key (may be empty/missing). */
  contentEn: Record<string, string>;
  images: Record<string, string>;
  files: Record<string, string>;
  isLoading: boolean;
  updateContent: (key: string, value: string, lang?: Lang) => Promise<{ error: unknown }>;
  updateImage: (key: string, file: File) => Promise<{ error: unknown }>;
  updateFile: (key: string, file: File) => Promise<{ error: unknown }>;
}

const Ctx = createContext<SiteContentContextType | undefined>(undefined);

const BUCKET = "site-images";
const SIGN_EXPIRY = 60 * 60 * 24 * 365;
const IMG_CACHE_KEY = "site-images-cache-v2";
const TXT_CACHE_KEY = "site-content-cache-v3";
const TXT_EN_CACHE_KEY = "site-content-en-cache-v1";
const FILE_CACHE_KEY = "site-files-cache-v1";

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
  const [content, setContent] = useState<Record<string, string>>({});
  const [contentEn, setContentEn] = useState<Record<string, string>>({});
  const [images, setImages] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cachedTxt = readCache<Record<string, string>>(TXT_CACHE_KEY);
    const cachedTxtEn = readCache<Record<string, string>>(TXT_EN_CACHE_KEY);
    const cachedImg = readCache<Record<string, string>>(IMG_CACHE_KEY);
    const cachedFile = readCache<Record<string, string>>(FILE_CACHE_KEY);
    if (cachedTxt) setContent(cachedTxt);
    if (cachedTxtEn) setContentEn(cachedTxtEn);
    if (cachedImg) setImages(cachedImg);
    if (cachedFile) setFiles(cachedFile);

    let cancelled = false;
    (async () => {
      const [{ data: texts }, { data: imgs }, { data: fls }] = await Promise.all([
        supabase.from("site_content").select("key, value, value_en"),
        supabase.from("site_images").select("key, storage_path"),
        supabase.from("site_files").select("key, storage_path"),
      ]);
      if (cancelled) return;

      const cMap: Record<string, string> = {};
      const cMapEn: Record<string, string> = {};
      texts?.forEach((r: { key: string; value: string; value_en: string | null }) => {
        cMap[r.key] = r.value;
        if (r.value_en) cMapEn[r.key] = r.value_en;
      });
      setContent(cMap);
      setContentEn(cMapEn);
      writeCache(TXT_CACHE_KEY, cMap);
      writeCache(TXT_EN_CACHE_KEY, cMapEn);

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

      const fMap: Record<string, string> = {};
      await Promise.all(
        (fls ?? []).map(async (r) => {
          const url = await signPath(r.storage_path);
          if (url) fMap[r.key] = url;
        }),
      );
      if (cancelled) return;
      setFiles(fMap);
      writeCache(FILE_CACHE_KEY, fMap);
      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateContent = async (key: string, value: string, lang: Lang = "cs") => {
    if (lang === "en") {
      // EN write: don't touch `value` (NOT NULL on CZ). Upsert needs CZ value too.
      const existingCs = content[key] ?? "";
      const { error } = await supabase
        .from("site_content")
        .upsert({ key, value: existingCs, value_en: value }, { onConflict: "key" });
      if (!error) {
        setContentEn((p) => {
          const next = { ...p, [key]: value };
          writeCache(TXT_EN_CACHE_KEY, next);
          return next;
        });
      }
      return { error };
    }

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

  const updateFile = async (key: string, file: File) => {
    const { data: prev } = await supabase
      .from("site_files")
      .select("storage_path")
      .eq("key", key)
      .maybeSingle();

    const ext = file.name.split(".").pop() ?? "pdf";
    const path = `files/${key}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "31536000",
      upsert: true,
      contentType: file.type || "application/pdf",
    });
    if (upErr) return { error: upErr };
    const { error: dbErr } = await supabase
      .from("site_files")
      .upsert({ key, storage_path: path }, { onConflict: "key" });
    if (dbErr) return { error: dbErr };

    if (prev?.storage_path && prev.storage_path !== path) {
      await supabase.storage.from(BUCKET).remove([prev.storage_path]);
    }

    const url = await signPath(path);
    if (url) {
      setFiles((p) => {
        const next = { ...p, [key]: url };
        writeCache(FILE_CACHE_KEY, next);
        return next;
      });
    }
    return { error: null };
  };

  return (
    <Ctx.Provider
      value={{ content, contentEn, images, files, isLoading, updateContent, updateImage, updateFile }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useSiteContent = () => {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return {
      content: {},
      contentEn: {},
      images: {},
      files: {},
      isLoading: false,
      updateContent: async () => ({ error: new Error("No provider") }),
      updateImage: async () => ({ error: new Error("No provider") }),
      updateFile: async () => ({ error: new Error("No provider") }),
    } as SiteContentContextType;
  }
  return ctx;
};

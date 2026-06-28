import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface FaqItem {
  id: string;
  position: number;
  question: string;
  answer: string;
  question_en: string | null;
  answer_en: string | null;
}

export type FaqPatch = Partial<Pick<FaqItem, "question" | "answer" | "question_en" | "answer_en">>;

interface FaqContextType {
  items: FaqItem[];
  isLoading: boolean;
  refetch: () => Promise<void>;
  addItem: (q: string, a: string, lang?: "cs" | "en") => Promise<{ error: unknown }>;
  updateItem: (id: string, patch: FaqPatch) => Promise<{ error: unknown }>;
  deleteItem: (id: string) => Promise<{ error: unknown }>;
  reorder: (orderedIds: string[]) => Promise<{ error: unknown }>;
}


const Ctx = createContext<FaqContextType | undefined>(undefined);

export function FaqProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    const { data } = await supabase
      .from("faq_items")
      .select("id, position, question, answer, question_en, answer_en")
      .order("position", { ascending: true });
    setItems((data ?? []) as FaqItem[]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const addItem = async (question: string, answer: string, lang: "cs" | "en" = "cs") => {
    const nextPos = (items.at(-1)?.position ?? 0) + 1;
    // Schema requires CZ question/answer NOT NULL. When adding from EN admin,
    // mirror the EN text into the CZ columns so the row exists everywhere;
    // the CZ admin can later refine the Czech wording.
    const row =
      lang === "en"
        ? { question, answer, question_en: question, answer_en: answer, position: nextPos }
        : { question, answer, position: nextPos };
    const { data, error } = await supabase
      .from("faq_items")
      .insert(row)
      .select("id, position, question, answer, question_en, answer_en")
      .single();
    if (!error && data) setItems((p) => [...p, data as FaqItem]);
    return { error };
  };


  const updateItem = async (id: string, patch: FaqPatch) => {
    const { error } = await supabase.from("faq_items").update(patch).eq("id", id);
    if (!error) setItems((p) => p.map((it) => (it.id === id ? { ...it, ...patch } : it)));
    return { error };
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from("faq_items").delete().eq("id", id);
    if (!error) setItems((p) => p.filter((it) => it.id !== id));
    return { error };
  };

  const reorder = async (orderedIds: string[]) => {
    const newItems = orderedIds
      .map((id, idx) => {
        const it = items.find((x) => x.id === id);
        return it ? { ...it, position: idx + 1 } : null;
      })
      .filter(Boolean) as FaqItem[];
    setItems(newItems);
    const updates = await Promise.all(
      newItems.map((it) =>
        supabase.from("faq_items").update({ position: it.position }).eq("id", it.id),
      ),
    );
    const error = updates.find((u) => u.error)?.error ?? null;
    return { error };
  };

  return (
    <Ctx.Provider value={{ items, isLoading, refetch, addItem, updateItem, deleteItem, reorder }}>
      {children}
    </Ctx.Provider>
  );
}

export const useFaq = () => {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return {
      items: [],
      isLoading: false,
      refetch: async () => {},
      addItem: async () => ({ error: new Error("No provider") }),
      updateItem: async () => ({ error: new Error("No provider") }),
      deleteItem: async () => ({ error: new Error("No provider") }),
      reorder: async () => ({ error: new Error("No provider") }),
    } as FaqContextType;
  }
  return ctx;
};

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface FaqItem {
  id: string;
  position: number;
  question: string;
  answer: string;
}

interface FaqContextType {
  items: FaqItem[];
  isLoading: boolean;
  refetch: () => Promise<void>;
  addItem: (q: string, a: string) => Promise<{ error: unknown }>;
  updateItem: (id: string, patch: Partial<Pick<FaqItem, "question" | "answer">>) => Promise<{ error: unknown }>;
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
      .select("id, position, question, answer")
      .order("position", { ascending: true });
    setItems((data ?? []) as FaqItem[]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const addItem = async (question: string, answer: string) => {
    const nextPos = (items.at(-1)?.position ?? 0) + 1;
    const { data, error } = await supabase
      .from("faq_items")
      .insert({ question, answer, position: nextPos })
      .select("id, position, question, answer")
      .single();
    if (!error && data) setItems((p) => [...p, data as FaqItem]);
    return { error };
  };

  const updateItem = async (id: string, patch: Partial<Pick<FaqItem, "question" | "answer">>) => {
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

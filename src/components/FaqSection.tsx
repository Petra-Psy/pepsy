import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EditableText } from "@/components/admin/EditableText";
import { useAdmin } from "@/components/admin/AdminContext";
import { useFaq, type FaqItem } from "@/components/admin/FaqContext";
import { useLang } from "@/components/i18n/LanguageContext";
import { STRINGS } from "@/i18n/strings";
import { Plus, GripVertical, Trash2, Check, X, Pencil } from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const VISIBLE_COUNT = 3;

/** Pick the displayed question/answer for the current locale, with CZ fallback. */
function localized(item: FaqItem, lang: "cs" | "en") {
  if (lang === "en") {
    return {
      question: item.question_en?.trim() || item.question,
      answer: item.answer_en?.trim() || item.answer,
    };
  }
  return { question: item.question, answer: item.answer };
}

export function FaqSection() {
  const { isAdmin, editMode } = useAdmin();
  const { items } = useFaq();
  const { t } = useLang();
  const adminEditing = isAdmin && editMode;

  return (
    <section id="faq" className="bg-card/60 border-y border-border/60">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
          <EditableText
            contentKey="faq.title"
            defaultValue={STRINGS.faq.title.cs}
            defaultValueEn={STRINGS.faq.title.en}
          />
        </h2>

        {adminEditing ? <FaqAdminList items={items} /> : <FaqPublicList items={items} />}
      </div>
    </section>
  );
}

function FaqPublicList({ items }: { items: FaqItem[] }) {
  const { lang, t } = useLang();
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, VISIBLE_COUNT);
  const hidden = items.length - VISIBLE_COUNT;

  return (
    <>
      <Accordion type="single" collapsible className="mt-8">
        {visible.map((f) => {
          const l = localized(f, lang);
          return (
            <AccordionItem key={f.id} value={f.id}>
              <AccordionTrigger className="text-left text-base font-medium">
                {l.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 leading-relaxed whitespace-pre-line">
                {l.answer}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {hidden > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={expanded ? t(STRINGS.faq.hide.cs, STRINGS.faq.hide.en) : t(STRINGS.faq.showMore.cs, STRINGS.faq.showMore.en)}
            className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-border bg-background hover:bg-muted transition-colors"
          >
            <Plus
              className={`w-5 h-5 transition-transform ${expanded ? "rotate-45" : ""}`}
            />
          </button>
        </div>
      )}
    </>
  );
}

function FaqAdminList({ items }: { items: FaqItem[] }) {
  const { reorder, addItem } = useFaq();
  const [adding, setAdding] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = items.findIndex((i) => i.id === active.id);
    const newIdx = items.findIndex((i) => i.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    const newOrder = arrayMove(items, oldIdx, newIdx).map((i) => i.id);
    const { error } = await reorder(newOrder);
    if (error) toast.error("Nepodařilo se uložit pořadí");
  };

  return (
    <div className="mt-8 space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((it) => (
            <SortableRow key={it.id} item={it} />
          ))}
        </SortableContext>
      </DndContext>

      {adding ? (
        <NewItemForm onDone={() => setAdding(false)} onCreate={addItem} />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Přidat otázku
        </button>
      )}
    </div>
  );
}

function SortableRow({ item }: { item: FaqItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });
  const { updateItem, deleteItem } = useFaq();
  const { lang } = useLang();
  const isEn = lang === "en";
  const [editing, setEditing] = useState(false);
  const [q, setQ] = useState(isEn ? (item.question_en ?? "") : item.question);
  const [a, setA] = useState(isEn ? (item.answer_en ?? "") : item.answer);
  const [saving, setSaving] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const startEdit = () => {
    setQ(isEn ? (item.question_en ?? "") : item.question);
    setA(isEn ? (item.answer_en ?? "") : item.answer);
    setEditing(true);
  };

  const save = async () => {
    setSaving(true);
    const patch = isEn ? { question_en: q, answer_en: a } : { question: q, answer: a };
    const { error } = await updateItem(item.id, patch);
    setSaving(false);
    if (error) toast.error("Nepodařilo se uložit");
    else {
      toast.success(isEn ? "Uloženo (EN)" : "Uloženo");
      setEditing(false);
    }
  };

  const remove = async () => {
    if (!confirm("Opravdu smazat tuto otázku?")) return;
    const { error } = await deleteItem(item.id);
    if (error) toast.error("Nepodařilo se smazat");
    else toast.success("Smazáno");
  };

  const displayedQ = isEn ? (item.question_en?.trim() || item.question) : item.question;
  const displayedA = isEn ? (item.answer_en?.trim() || item.answer) : item.answer;
  const enMissing = isEn && !(item.question_en?.trim() && item.answer_en?.trim());

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex gap-2 items-start rounded-xl border bg-background p-3 ${
        enMissing ? "border-amber-400/60" : "border-border"
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="mt-1 p-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
        aria-label="Přesunout"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span
                className={`px-1.5 py-0.5 rounded ${
                  isEn ? "bg-blue-500 text-white" : "bg-primary text-primary-foreground"
                }`}
              >
                {isEn ? "EN" : "CZ"}
              </span>
              <span className="text-muted-foreground font-normal">
                {isEn ? "ukládá se do EN sloupců" : "ukládá se do CZ sloupců"}
              </span>
            </div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={isEn ? "Question" : "Otázka"}
              className="w-full bg-card border border-primary/60 rounded px-2 py-1 text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <textarea
              value={a}
              onChange={(e) => setA(e.target.value)}
              placeholder={isEn ? "Answer" : "Odpověď"}
              rows={4}
              className="w-full bg-card border border-primary/60 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm hover:opacity-90"
              >
                <Check className="w-3.5 h-3.5" /> Uložit
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-muted text-muted-foreground rounded text-sm hover:opacity-90"
              >
                <X className="w-3.5 h-3.5" /> Zrušit
              </button>
            </div>
          </div>
        ) : (
          <div>
            {isEn && (
              <div className="text-[10px] font-bold mb-1">
                <span className="px-1.5 py-0.5 rounded bg-blue-500 text-white">EN</span>
                {enMissing && (
                  <span className="ml-2 text-amber-600 font-normal">⚠ chybí překlad – ukazuje se CZ</span>
                )}
              </div>
            )}
            <div className="font-medium">{displayedQ}</div>
            <div className="mt-1 text-sm text-muted-foreground whitespace-pre-line">{displayedA}</div>
          </div>
        )}
      </div>

      {!editing && (
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={startEdit}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded"
            aria-label="Upravit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={remove}
            className="p-1.5 text-muted-foreground hover:text-destructive rounded"
            aria-label="Smazat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function NewItemForm({
  onDone,
  onCreate,
}: {
  onDone: () => void;
  onCreate: (q: string, a: string) => Promise<{ error: unknown }>;
}) {
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!q.trim()) return toast.error("Zadejte otázku");
    setSaving(true);
    const { error } = await onCreate(q.trim(), a.trim());
    setSaving(false);
    if (error) toast.error("Nepodařilo se přidat");
    else {
      toast.success("Přidáno");
      onDone();
    }
  };

  return (
    <div className="rounded-xl border border-primary/40 bg-background p-3 space-y-2">
      <p className="text-xs text-muted-foreground">Nová otázka se přidává v CZ. Přepni se na /en a doplň EN překlad.</p>
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Otázka"
        className="w-full bg-card border border-border rounded px-2 py-1 text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      <textarea
        value={a}
        onChange={(e) => setA(e.target.value)}
        placeholder="Odpověď"
        rows={4}
        className="w-full bg-card border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={saving}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm hover:opacity-90"
        >
          <Check className="w-3.5 h-3.5" /> Přidat
        </button>
        <button
          type="button"
          onClick={onDone}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-muted text-muted-foreground rounded text-sm hover:opacity-90"
        >
          <X className="w-3.5 h-3.5" /> Zrušit
        </button>
      </div>
    </div>
  );
}

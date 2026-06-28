import { useState } from "react";
import { useAdmin } from "@/components/admin/AdminContext";
import {
  useAboutEducation,
  type EducationItem,
} from "@/components/admin/AboutEducationContext";
import { useLang } from "@/components/i18n/LanguageContext";
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
import { renderRichInline } from "@/lib/rich-text";

const PREVIEW_COUNT = 2;

function localizedText(item: EducationItem, lang: "cs" | "en") {
  if (lang === "en") return item.text_en?.trim() || item.text;
  return item.text;
}

export function EducationList() {
  const { isAdmin, editMode } = useAdmin();
  const { items } = useAboutEducation();
  const adminEditing = isAdmin && editMode;

  if (adminEditing) return <AdminView items={items} />;
  return <PublicView items={items} />;
}

function PublicView({ items }: { items: EducationItem[] }) {
  const { lang, t } = useLang();
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, PREVIEW_COUNT);
  const hidden = items.length - PREVIEW_COUNT;

  if (items.length === 0) return null;

  return (
    <div>
      <ul className="list-disc pl-5 space-y-1.5 text-foreground/80 leading-relaxed">
        {visible.map((it) => (
          <li key={it.id}>{renderRichInline(localizedText(it, lang))}</li>
        ))}
      </ul>
      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-sm font-medium text-primary hover:underline"
        >
          {expanded ? t("Zobrazit méně", "Show less") : t("Zobrazit více", "Show more")}
        </button>
      )}
    </div>
  );
}

function AdminView({ items }: { items: EducationItem[] }) {
  const { reorder, addItem } = useAboutEducation();
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
    <div className="space-y-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((it) => (
            <Row key={it.id} item={it} />
          ))}
        </SortableContext>
      </DndContext>

      {adding ? (
        <NewItemForm onDone={() => setAdding(false)} onCreate={addItem} />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Přidat školu
        </button>
      )}
    </div>
  );
}

function Row({ item }: { item: EducationItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const { updateItem, deleteItem } = useAboutEducation();
  const { lang } = useLang();
  const isEn = lang === "en";
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(isEn ? (item.text_en ?? "") : item.text);
  const [saving, setSaving] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const startEdit = () => {
    setValue(isEn ? (item.text_en ?? "") : item.text);
    setEditing(true);
  };

  const save = async () => {
    setSaving(true);
    const patch = isEn ? { text_en: value } : { text: value };
    const { error } = await updateItem(item.id, patch);
    setSaving(false);
    if (error) toast.error("Nepodařilo se uložit");
    else {
      toast.success(isEn ? "Uloženo (EN)" : "Uloženo");
      setEditing(false);
    }
  };

  const remove = async () => {
    if (!confirm("Opravdu smazat tuto položku?")) return;
    const { error } = await deleteItem(item.id);
    if (error) toast.error("Nepodařilo se smazat");
    else toast.success("Smazáno");
  };

  const displayed = isEn ? (item.text_en?.trim() || item.text) : item.text;
  const enMissing = isEn && !item.text_en?.trim();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex gap-2 items-start rounded-lg border bg-background p-2 ${
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
            <span
              className={`inline-block px-1.5 py-0.5 text-[10px] font-bold rounded ${
                isEn ? "bg-blue-500 text-white" : "bg-primary text-primary-foreground"
              }`}
            >
              {isEn ? "EN" : "CZ"}
            </span>
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  save();
                }
                if (e.key === "Escape") setEditing(false);
              }}
              className="w-full bg-card border border-primary/60 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <div className="flex gap-2">
              <button onClick={save} disabled={saving} className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:opacity-90">
                <Check className="w-3.5 h-3.5" /> Uložit
              </button>
              <button onClick={() => setEditing(false)} className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground rounded text-sm hover:opacity-90">
                <X className="w-3.5 h-3.5" /> Zrušit
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-foreground/90 py-1">
            {isEn && (
              <span className="mr-2 inline-block px-1.5 py-0.5 text-[10px] font-bold rounded bg-blue-500 text-white align-middle">
                EN
              </span>
            )}
            {renderRichInline(displayed)}
            {enMissing && (
              <span className="ml-2 text-xs text-amber-600">⚠ chybí překlad</span>
            )}
          </div>
        )}
      </div>
      {!editing && (
        <div className="flex flex-col gap-1">
          <button onClick={startEdit} className="p-1.5 text-muted-foreground hover:text-foreground rounded" aria-label="Upravit">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={remove} className="p-1.5 text-muted-foreground hover:text-destructive rounded" aria-label="Smazat">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function NewItemForm({ onDone, onCreate }: { onDone: () => void; onCreate: (text: string) => Promise<{ error: unknown }> }) {
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!value.trim()) return toast.error("Zadejte text");
    setSaving(true);
    const { error } = await onCreate(value.trim());
    setSaving(false);
    if (error) toast.error("Nepodařilo se přidat");
    else {
      toast.success("Přidáno");
      onDone();
    }
  };

  return (
    <div className="rounded-lg border border-primary/40 bg-background p-2 space-y-2">
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          }
          if (e.key === "Escape") onDone();
        }}
        placeholder="Např. Univerzita Karlova v Praze, jednooborová psychologie"
        className="w-full bg-card border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      <div className="flex gap-2">
        <button onClick={submit} disabled={saving} className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:opacity-90">
          <Check className="w-3.5 h-3.5" /> Přidat
        </button>
        <button onClick={onDone} className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground rounded text-sm hover:opacity-90">
          <X className="w-3.5 h-3.5" /> Zrušit
        </button>
      </div>
    </div>
  );
}

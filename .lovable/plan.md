
## Co se změní

### 1. Pořadí bloků v "O mně"
Nové pořadí: **Představení → Můj přístup → Mé vzdělání** (dnes je první vzdělání, poslední představení).

### 2. Rozklikávací odstavce
Všechny tři bloky se v základu zobrazí jen jako **první 2 věty** s odkazem **„Zobrazit více"** (a po rozkliknutí „Zobrazit méně"). Detekce vět: rozdělení podle `.`/`!`/`?` následovaných mezerou nebo koncem řádku. Pokud má text 2 věty nebo méně, tlačítko se nezobrazí. V admin edit módu se vždy ukáže celý text (aby šel editovat).

### 3. "Mé vzdělání" jako seznam škol
Místo jednoho textového pole bude **seznam řádků**, kde každý řádek = jedna škola/výcvik. V admin rozhraní:
- tlačítko **„Přidat školu"**
- u každého řádku ikony **upravit / smazat / přesunout (drag handle)**
- v běžném zobrazení se vyrenderují jako odrážkový seznam (`<ul>`), na který se zároveň aplikuje pravidlo „v základu jen první 2 položky, rozklik na celý seznam".

Data se uloží do nové tabulky `about_education` (řádky se sloupci `id`, `position`, `text`). Stejný princip jako už existující `faq_items`.

### 4. Formátování textu v admin rozhraní
V `EditableText` (multiline i inline) přibude **malá lišta nad editorem** se dvěma tlačítky:
- **Kurzíva** — obalí výběr `_text_`
- **Zvýraznění** — obalí výběr `**text**`

Plus klávesové zkratky **Ctrl/Cmd+I** a **Ctrl/Cmd+B**. Renderování: jednoduchý markdown-light parser (jen `**bold**` a `_italic_`), žádná HTML injektáž — výstup se skládá z `<strong>` a `<em>` Reactem, takže je bezpečný. Zvýraznění (`**`) se vykreslí jako `<strong>` se zvýrazněnou barvou (primary). Použije se ve všech místech, kde se dnes zobrazuje `EditableText` v read-only režimu.

## Technické detaily

**Databáze (migrace):**
```sql
create table public.about_education (
  id uuid primary key default gen_random_uuid(),
  position int not null default 0,
  text text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.about_education to anon, authenticated;
grant all on public.about_education to service_role;
alter table public.about_education enable row level security;
-- policies: anon/authenticated SELECT; admin INSERT/UPDATE/DELETE (přes has_role)
-- trigger set_updated_at
```
Seed: aktuální text rozdělený na řádky podle "."/odřádkování.

**Nový kontext** `AboutEducationContext` (kopie `FaqContext` se 3 metodami: `addItem`, `updateItem`, `deleteItem`, `reorder`). Drag-and-drop přes `@dnd-kit` (už v projektu).

**Nová komponenta** `<CollapsibleText text={…} sentences={2} />` — sdílená pro všechny tři bloky.

**`EditableText`:**
- nová prop `richText?: boolean` (default `true` pro multiline)
- nový helper `renderInline(text)` který bezpečně rozparsuje `**` a `_`
- toolbar se vykreslí jen v edit režimu
- výchozí `defaultValue` ostatních polí (texty bez markdownu) se nezmění

**Soubory ke změně/vytvoření:**
- nová migrace pro `about_education`
- nový `src/components/admin/AboutEducationContext.tsx`
- registrace providera v `__root.tsx` (vedle `FaqProvider`)
- nová `src/components/CollapsibleText.tsx`
- nová `src/components/admin/EducationList.tsx` (admin + public render)
- úprava `src/components/admin/EditableText.tsx` (toolbar + render markdown-light)
- úprava `src/routes/index.tsx` — `About()`: pořadí bloků, `AboutBlock` použije `CollapsibleText`, blok "Mé vzdělání" nahrazen `<EducationList />`

## Co se NEmění
- Ostatní sekce (Hero, Služby, FAQ, Kontakt) zůstanou stejné.
- Drag-and-drop pro celé sekce stránky se v tomto kroku neřeší — jen řádky vzdělání.

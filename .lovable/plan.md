## Co se stalo

V `SiteContentContext.updateContent` je při ukládání anglické verze tato logika:

```ts
const existingCs = content[key] ?? "";
supabase.from("site_content").upsert(
  { key, value: existingCs, value_en: value },
  { onConflict: "key" },
);
```

Když v EN admin rozhraní upravíš text, jehož česká varianta ještě nebyla ručně uložená (zobrazovala se jen z `defaultValue` v kódu), `content[key]` je `undefined` → upsert zapíše do databáze **prázdný `value=""`** pro češtinu. `EditableText` pak zobrazuje `csValue ?? defaultValue` — a protože `""` není `undefined`, default se nepoužije a **česká sekce zmizí**. Ověřeno dotazem na DB: `hero.title`, `about.approach.title`, `services.wellbeing.*`, celá `privacy.*`, `pricing.duration/format`… mají `value=""` a plnou EN hodnotu.

Druhý problém: `PrivacySection` a `Footer` mají `EditableText` bez `defaultValueEn`, takže na `/en` se stejně ukáže české znění (dokud admin ručně nezaloží EN verzi).

## Plán opravy

### 1. Úplná nezávislost CZ ↔ EN (kořen problému)

- **Migrace databáze:** `ALTER TABLE public.site_content ALTER COLUMN value DROP NOT NULL;` (analogicky projít i `faq_items.question/answer` — dnes NOT NULL — a `about_education.text`, aby šlo mít pouze EN řádek/pole bez CZ).
- **Přepsat `updateContent`** v `SiteContentContext.tsx`: pro CZ upsert jen `{ key, value }`, pro EN upsert jen `{ key, value_en }` — nikdy nesahat na druhý jazyk.
- **`FaqContext.addItem`**: při přidávání z EN admina vkládat jen `{ question_en, answer_en, position }` (dnes zrcadlí EN i do CZ sloupců, ať už tam bylo cokoli).
- **`EducationList` / `AboutEducationContext`**: povolit přidat položku i jen v EN (patch pouze `text_en`, CZ nechat NULL).

### 2. Bezpečnostní pojistka v renderu

V `EditableText` (a analogicky ve FAQ/Education) považovat prázdný string za „nenastaveno" — když je uložená hodnota `""`, zobraz `defaultValue`/`defaultValueEn`. Tím po nasazení opravy **okamžitě znovu naskočí zmizelé sekce** i bez ručního zásahu.

### 3. Očištění DB od poškozených řádků

Migrace, která nastaví `value = NULL` všude, kde `value = ''` a zároveň `value_en IS NOT NULL AND value_en <> ''` (v `site_content`), aby se řádky vrátily do konzistentního stavu (EN vyplněné, CZ = default z kódu). Totéž zkontrolovat pro `faq_items` (`question=''` nebo `answer=''`) a `about_education` (`text=''`).

### 4. EN verze GDPR a patičky

- Do `src/i18n/strings.ts` doplnit `STRINGS.privacy.*` (nadpisy a texty všech 6 sekcí + cookies) a `STRINGS.footer.note` už existuje — přidat i EN znění pro `footer.brand`.
- V `PrivacySection.tsx` a `SiteSections.Footer` doplnit `defaultValueEn` ke každému `EditableText` z těch nových řetězců. Uživatel pak i bez ručních zásahů uvidí kompletní anglickou variantu; admin může kdykoli přepsat.
- Ověřit, že `useLang()` funguje uvnitř patičky (funguje — patička je uvnitř `LanguageProvider` v `__root.tsx`).

### 5. Ověření

- `bun run build:dev` bez chyb.
- Playwright: otevřít `/`, zkontrolovat že sekce Hero/O mně/Ceník/Služby/Privacy mají české texty; otevřít `/en`, zkontrolovat anglické; screenshoty.
- Zaznamenat, že cache prohlížeče (`site-content-cache-v3` v localStorage) obsahuje stará prázdná data — v poznámce uživateli poradit tvrdý refresh (nebo bumpnout klíč cache na `v4`, ať se všem klientům refresh vynutí automaticky).

## Technické poznámky

- Migrace = jeden SQL soubor: DROP NOT NULL + čištění dat + odpovídající GRANT check.
- Cache-key bump v `SiteContentContext.tsx` (`TXT_CACHE_KEY` → `v4`) vyřeší i klienty, co mají v localStorage cachovaná stará prázdná pole.
- Žádné změny v `src/integrations/supabase/*` (auto-gen typy si vygenerují po migraci).

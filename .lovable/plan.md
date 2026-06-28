## Plán: EN verze webu + přepínač jazyka

### 1. Databáze — přidat EN sloupce k existujícím tabulkám

Místo duplikování řádků přidám paralelní `*_en` sloupce. Stávající data zůstanou nedotčená.

- `site_content` → `value_en text`
- `faq_items` → `question_en text`, `answer_en text`
- `about_education` → `text_en text`
- `site_images` a `site_files` zůstanou jednojazyčné (obrázky a PDF se nepřekládají — fotka a terapeutická dohoda budou stejné v obou jazycích).

Pokud někdy EN hodnota chybí nebo je prázdná, web automaticky spadne na CZ. Díky tomu se EN verze publikuje hned, i když ještě nebude celá přeložená.

### 2. URL struktura (TanStack file routes)

- `/` → CZ úvod (`src/routes/index.tsx` — stávající)
- `/rezervace` → CZ rezervace (stávající)
- `/en` → EN úvod (`src/routes/en.index.tsx`)
- `/en/booking` → EN rezervace (`src/routes/en.booking.tsx`)
- `/auth` zůstává jen česky (admin přístup)

Každá route má vlastní `head()` s lokalizovaným title / description / og:title / og:url + správný `<html lang>` přes `<link rel="alternate" hreflang="...">` na obou variantách (SEO).

### 3. Jazykový kontext

Nový `LanguageProvider` (`src/components/i18n/LanguageContext.tsx`):
- `lang: "cs" | "en"` — odvozeno z URL (root segment `en` = EN, jinak CZ)
- helper `t(cs, en)` pro inline překlady
- helper `tc(key)` který vrátí `value_en` když lang=en a není prázdné, jinak `value`

`SiteContentContext` rozšířím tak, aby načítal i EN sloupce a držel paralelní mapy (`contentEn`, `faqEn`, `eduEn`). Cache se rozšíří o EN verze.

### 4. Statické UI stringy

Nový soubor `src/i18n/strings.ts` se slovníkem pro:
- navigace (O mně / About, Služby / Services, Ceník / Pricing, FAQ, Kontakt / Contact)
- tlačítka (Rezervace / Book, Rezervovat online / Book online, Zpět / Back)
- nadpis sekcí, popisky, error hlášky, admin toolbar (jen pokud edituje EN verzi — popisky zůstávají česky pro admina)

### 5. EditableText — vědomí jazyka

V admin edit módu na `/en/*` route bude `EditableText` ukládat do `value_en` místo `value`. Vizuálně se zobrazí malý badge "EN" u editovaného pole. Totéž pro FAQ editor a Education editor.

V admin toolbaru přidám info "Editujete: CS / EN" podle aktuální route, ať je jasné kam zápis jde.

### 6. Přepínač v hlavičce

V `Header` (komponenta `SiteSections.tsx`) vpravo vedle CTA tlačítka:

```
CZ | EN
```

Aktivní jazyk tučně, kliknutím se naviguje na ekvivalentní route ve druhém jazyce (mapování `/ ↔ /en`, `/rezervace ↔ /en/booking`). Hash kotvy v URL se zachovají.

### 7. Překlady obsahu

Po nasazení DB sloupců vyplním:
- statické UI (CZ↔EN slovník v kódu) — kompletní
- DB obsah (hero, sekce, FAQ, vzdělání) — vyplním rozumný EN překlad přímo do migrace nebo přes admin (řekni co preferuješ)

### Souhrn změn

- 1 migrace (přidání sloupců, žádné mazání)
- 2 nové route soubory (`en.index.tsx`, `en.booking.tsx`)
- 1 nový context (`LanguageContext`)
- 1 nový slovník (`i18n/strings.ts`)
- úpravy: `SiteContentContext`, `EditableText`, `EducationList`, `FaqContext`/`FaqSection`, `SiteSections` (Header + Footer + Contact), `index.tsx`, `rezervace.tsx`, `__root.tsx` (hreflang)

### Otázka před spuštěním

Mám počáteční EN překlady obsahu napsat já (do migrace jako default hodnoty pro hlavní texty — nadpisy, perex, sekce, hlavní FAQ), nebo si je vyplníš sama v adminu po nasazení?

## Cíl

Po nahrání jakékoliv fotky přes admin rozhraní se otevře crop editor s pevným poměrem podle daného slotu. Admin vybere přesný výřez, ten se před uploadem ořízne na klientovi a uloží do Cloud storage jako správně nakadrovaný JPG.

## Fotky na stránce (kompletní výčet)

| Slot | `contentKey` | Cílový poměr | Doporučené rozlišení |
|---|---|---|---|
| Hero (header) | `hero.photo` | **4 : 5** (na výšku) | 1200 × 1500 px (retina 1600 × 2000) |
| Portrét „O mně" | `about.portrait` | **1 : 1** (čtverec, zobrazí se jako kruh) | 600 × 600 px (retina 800 × 800) |

Žádné další `EditableImage` na webu nejsou.

## Co se změní

1. **Nová závislost:** `react-easy-crop` (UI cropperu, ~15 kB).
2. **Nový komponent `ImageCropDialog`** (`src/components/admin/ImageCropDialog.tsx`):
   - shadcn `Dialog`, uvnitř `react-easy-crop` s `aspect` podle propu.
   - Drag = posun, scroll / slider = zoom, tlačítka **Uložit výřez** / **Zrušit**.
   - U kulaté varianty (`cropShape="round"`) zobrazí kruhovou masku, ale výstup je vždy čtvercový JPG.
   - Při potvrzení vykreslí výřez na `<canvas>`, exportuje JPG (`quality 0.9`, max delší strana 1600 px), předá `File` zpět callbackem.
   - Při zavření uvolní blob URL (`URL.revokeObjectURL`).
3. **Úprava `EditableImage`:**
   - Nové propy `aspect?: number` (default `1`) a `cropShape?: "rect" | "round"` (default `"rect"`).
   - Po výběru souboru místo přímého uploadu otevři `ImageCropDialog` s `URL.createObjectURL(file)`.
   - Po potvrzení voláme stávající `updateImage(contentKey, croppedFile)` – beze změny backendu.
4. **`src/routes/index.tsx`:**
   - Hero `<EditableImage>` → `aspect={4/5}`.
   - Portrét About → `aspect={1}` + `cropShape="round"`.

## Technické detaily

- Cropper běží čistě v prohlížeči admina – žádná server fn, žádná Edge function, žádné sharp.
- Pre-crop = menší soubor v `site-images` bucketu = rychlejší načítání.
- Beze změn DB / RLS / storage policies – `updateImage` už funguje.
- Pokud admin v budoucnu přidá další `EditableImage`, stačí předat `aspect` (a případně `cropShape`).

## Mimo rozsah

- Žádný focal-point uložený do DB (uživatel preferuje plný crop).
- Žádné změny publikovaného layoutu ani ostatních komponent.

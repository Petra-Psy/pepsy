## Cíl
Vrátit se k původní piktogramové stylizaci ikon u sekce „S čím vám mohu pomoci?" podle přiložených předloh (postava+baterie, postava s rukou u brady, dvě sklíčené postavy, profil hlavy se srdcem-úsměvem), **bez textu uvnitř ikony**, ale ve **stejné barvě jako stávající ikony na webu** — tj. sage zelená (`--primary`, ~#7ea58b) na transparentním pozadí.

## Mapování (klíč v kódu → předloha)
- `anxiety` (Úzkostné stavy / vztahy) → ANXIETY (postava s rukou u brady, čárky kolem hlavy)
- `burnout` (Stres a vyhoření) → BURNOUT (postava s vybitou baterií nad hlavou)
- `relationships` (Depresivní stavy) → DEPRESSION (dvě sklíčené postavy se smutnými obličeji)
- `wellbeing` (Všeobecné poradenství / well-being) → EMOTIONAL WELL-BEING (hlava z profilu se srdíčkem-úsměvem uvnitř)

## Co se udělá

1. **Vygenerovat 4 nové PNG ikony** přes `imagegen--generate_image` (model `premium`, `transparent_background: true`, 1024×1024). Společný brief:
   > „Minimal monoline pictogram icon, single uniform stroke in sage green (#7ea58b), no fill, no shading, no text or letters anywhere, rounded line caps, centered on a solid white background, square framing with consistent padding, flat 2D. Style identical across the four icons."
   
   Per ikona doplnit motiv (postava s prsty u brady + krátké čárky nervozity kolem hlavy; postava s ikonou vybité baterie nad hlavou; dvě postavy se sklíčenými výrazy vedle sebe; profil hlavy s úsměvem ve tvaru srdce uvnitř). U každé explicitně **„no caption, no word, no label below the icon"**.

2. **Přepsat assety na místě** (zachovat existující asset.json cesty):
   - `src/assets/icon-anxiety.png`
   - `src/assets/icon-burnout.png`
   - `src/assets/icon-relationships.png` (staré `icon-depression.png.asset.json` smazat přes `lovable-assets delete`)
   - `src/assets/icon-wellbeing.png`

3. **`src/routes/index.tsx`** — dokončit přechod z inline-SVG na PNG:
   - Smazat `AnxietyIcon`, `BurnoutIcon`, `DepressionIcon`, `WellbeingIcon` a nepoužité `SVGProps`/`ComponentType` importy.
   - `SERVICES` přepsat tak, aby drželo `src` z importovaného `*.asset.json`.
   - V dlaždici renderovat `<img src={s.src} alt="" width={64} height={64} loading="lazy" className="w-16 h-16 object-contain" />` místo dnešního accent kruhu s ikonou (kruh odstranit — piktogramy už drží barvu samy).

4. **QA**: Playwright screenshot sekce v desktop i mobilním viewportu — ověřit jednotný sage line-art styl, žádný text v ikonách, vyrovnaná velikost. Pokud se některá vymyká, regenerovat ji jednotlivě.

## Mimo rozsah
Žádné změny v i18n, DB, kontextech ani jiných sekcích.

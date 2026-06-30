## Cíl
Sekce „Služby" (4 dlaždice: úzkost, vyhoření, vztahy, well-being) má teď ručně psané inline SVG, které vypadají hrubě. Nahradíme je 4 novými PNG ilustracemi ve stejném výtvarném stylu, sladěnými s paletou webu (warm cream + sage), a propojíme je přes asset CDN.

## Co se udělá

1. **Vygenerovat 4 nové ilustrace** (premium quality, transparentní pozadí, 1024×1024) ve společném briefu:
   - jednotný hand-drawn / soft-line styl s jemným barevným fillem
   - paleta sage (#7ea58b) + warm cream + clay accent (ladí s `--primary` / `--accent`)
   - tématické motivy:
     - **anxiety** — postava držící se za hlavu, jemné kruhy/vlnky kolem (neklid)
     - **burnout** — vyhasínající svíčka / postava s prázdným hrnkem
     - **relationships** — dvě postavy v rozhovoru / propojené ruce
     - **wellbeing** — rostlinka v dlani / vycházející slunce nad krajinou
   - konzistentní tloušťka linky, stejná kompozice (středová, čtvercová), žádný text

2. **Uložit přes Lovable assets** jako:
   - `src/assets/icon-anxiety.png` (+ `.asset.json`)
   - `src/assets/icon-burnout.png`
   - `src/assets/icon-relationships.png` (nová — dnes je `icon-depression.png`)
   - `src/assets/icon-wellbeing.png`

3. **`src/routes/index.tsx`** (a `src/routes/en.index.tsx` pokud má vlastní kopii):
   - Smazat komponenty `AnxietyIcon`, `BurnoutIcon`, `DepressionIcon`, `WellbeingIcon` a nepoužité `SVGProps`/`ComponentType` importy.
   - `SERVICES` přepsat tak, aby místo `Icon` komponenty drželo `src` z importovaného `*.asset.json`.
   - V dlaždici renderovat `<img src={s.src} alt="" className="w-16 h-16 object-contain" />` místo barevného `accent` kruhu (ilustrace mluví sama, kruh už nesedí). Zachovat hover stav celé karty.

4. **Úklid**: smazat staré `icon-depression.png.asset.json` pokud zůstane nepoužité (`lovable-assets delete`).

## Technické detaily
- Generování přes `imagegen--generate_image`, `model: "premium"`, `transparent_background: true`, prompt obsahuje větu „on a clean white background, flat hand-drawn editorial illustration, soft sage green and warm cream palette, consistent line weight".
- Žádná změna kontextů / DB / i18n — jen prezentační vrstva.
- Build ověřit (`bun run build` proběhne automaticky), vizuálně zkontrolovat sekci v prohlížeči (Playwright screenshot dlaždic).

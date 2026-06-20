## Diagnóza

Gemini se mýlí. Tvůj projekt je **TanStack Start v1 se SSR** běžící na Cloudflare Workers (viz `wrangler.jsonc`, `vite.config.ts` s `@cloudflare/vite-plugin`, server functions přes `createServerFn`). To není SPA s `index.html` + `assets/`, takže:

- Soubor `_redirects` s `/* /index.html 200` **nic nevyřeší** — žádný `index.html` v buildu neexistuje. Build output je Worker script (`.output/server/`), ne statické soubory.
- "Bílá stránka v Pages" není chybějící `_redirects` — Pages prostě nemá co servírovat, protože SSR build nemá statické HTML.

## Možnosti — vyber jednu

### Možnost A (doporučená): Zůstat na Workers
Workers už funguje. Pages je v tomhle případě krok zpět — ztratíš SSR, server functions (auth middleware, RPC) a `requireSupabaseAuth`. Pokud Pages chceš jen kvůli UI v Cloudflare dashboardu, nestojí to za to.

**Akce:** žádné — necháme `deploy.yml` a `preview.yml` jak jsou.

### Možnost B: Přepnout na Cloudflare Pages se Static Site (SSG)
Vypnout SSR, prerenderovat všechny routy do statického HTML, deploynout jako Pages.

**Co to obnáší:**
1. V `vite.config.ts` zapnout `tanstackStart.prerender` se seznamem všech routes (`/`, `/auth`, `/admin`, ...).
2. **Smazat všechny server functions** — `requireSupabaseAuth`, RPC, attachéry. Auth musí jít čistě přes browser Supabase client.
3. Admin routy (úprava obsahu, upload obrázků) musí volat Supabase přímo z browseru přes RLS — žádný server-side validace.
4. Nahradit `deploy.yml`/`preview.yml` za `cloudflare/pages-action` s `directory: dist`.
5. Přidat `public/_redirects` s `/* /index.html 200` pro client-side routing fallback.

**Riziko:** dynamický obsah (DB editace přes admin) zůstane funkční jen pokud RLS policies dovolí přímý zápis z anon/authenticated klienta. Žádné server-side tajemství (service role atd.).

### Možnost C: Pages s Functions (hybrid)
Cloudflare Pages umí spustit Worker jako `_worker.js`. Build output TanStack Start by se musel zabalit do struktury, kterou Pages očekává (`functions/` nebo `_worker.js` v root + statické assets vedle). TanStack Start oficiálně tenhle target nepodporuje — vyžadovalo by custom build script a křehkou údržbu.

**Nedoporučuji** — víc práce než Workers, žádný benefit.

## Doporučení

Zůstaň na **Workers (Možnost A)**. Pokud trváš na Pages, jdi do **Možnosti B** s vědomím, že SSR + server functions + auth middleware zmizí a admin musí spoléhat čistě na RLS.

## Otázka

Kterou cestou jít?
- **A** — žádné změny, vysvětlit ti proč Workers je správná volba a jak ověřit, že běží
- **B** — přepnout na Pages + SSG (přijdeš o server functions, admin přes RLS)
- **C** — Pages + custom `_worker.js` hybrid (nedoporučuji)

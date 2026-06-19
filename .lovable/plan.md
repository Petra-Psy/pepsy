## Problém

Cloudflare provádí dvě věci, které se v aktuálním projektu rozbíjí:

1. **Build neprodukuje Worker bundle.** V logu je:
   `[@lovable.dev/vite-tanstack-config] No Lovable context detected — skipping nitro deploy plugin. Pass `nitro: true` to force-enable.`
   Lovable wrapper kolem TanStack Start sám detekuje, že běží mimo Lovable infra, a vypne nitro/cloudflare adapter. Výstup je jen `dist/client` + `dist/server` (Node SSR), ne `.output/server/index.mjs` pro Workery.

2. **`npx wrangler deploy` spustí auto-setup (C3)** — protože v projektu není `wrangler.jsonc` ani `deploy` skript, wrangler si myslí, že projekt teprve konfiguruje, a snaží se injektovat Cloudflare Vite plugin do `vite.config.ts`. To selže, protože náš config používá `defineConfig` z `@lovable.dev/vite-tanstack-config` a wrangler v něm „nevidí" `plugins: []`.

Tedy přesně to, co jsem říkal v předchozí zprávě: výstup je nakonfigurovaný pro Lovable infra, mimo ni se Worker nesestaví.

## Plán opravy

### 1. `vite.config.ts` — vynutit nitro/Cloudflare adapter

```ts
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: true, // ← vynutí build Workeru i mimo Lovable
});
```

Po této změně `bun run build` produkuje `.output/server/index.mjs` + `.output/public/` + vygenerované `.output/wrangler.json`.

### 2. `wrangler.jsonc` v rootu projektu

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "pepsy",
  "main": ".output/server/index.mjs",
  "compatibility_date": "2026-06-19",
  "compatibility_flags": ["nodejs_compat"],
  "assets": { "directory": ".output/public", "binding": "ASSETS" },
  "observability": { "enabled": true }
}
```

Když wrangler najde existující `wrangler.jsonc`, **neběží** auto-setup, který se snaží přepsat `vite.config.ts`. Tím se odstraní `ERROR: Cannot modify Vite config`.

### 3. `package.json` — přidat deploy skripty

```json
"deploy": "bun run build && wrangler deploy",
"preview:wrangler": "bun run build && wrangler dev"
```

Wrangler tím přestane navrhovat „Update package.json scripts" v setup wizardu.

### 4. GitHub Secrets pro env

`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` se musí dostat do build prostředí Cloudflare (v dashboardu **Workers & Pages → pepsy → Settings → Variables and Secrets → Build**), jinak SSR bundle nebude mít přístup k backendu. To je manuální krok v Cloudflare UI — můžu jen vypsat přesný seznam.

### 5. Smazat `.github/workflows/deploy.yml` (volitelné)

Když používáš Cloudflare Workers Builds napojený přímo na repo, GitHub Actions workflow je duplicitní a zbytečně spotřebovává minuty. Doporučuji smazat — nebo naopak používat **jen** Actions a v Cloudflare vypnout Workers Builds. Dvě cesty deployu zároveň = konflikty.

## Co musíš udělat ručně po implementaci

1. V Cloudflare dashboardu → Workers & Pages → **pepsy** → Settings → Variables and Secrets → **Build** přidat:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
2. Rozhodnout: **buď** Cloudflare Workers Builds (git napojení) **nebo** GitHub Actions — ne obojí.
3. Po úspěšném prvním deployi: Workers & Pages → pepsy → **Domains & Routes** → Add Custom Domain.

## Otevřená otázka

Smazat `.github/workflows/deploy.yml` (používáš Cloudflare git napojení), nebo ho nechat a v Cloudflare vypnout auto-build (používat GitHub Actions)?
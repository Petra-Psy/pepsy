## Cíl
Zastavit maily o selhání workflow tím, že opravíme příčinu failu. Zachovat auto-deploy na Cloudflare Workers.

## Diagnostika

### 1. Lokální build test
Spustit `bun run build` v sandboxu a ověřit, jestli projekt buildí bez chyb. Pokud build selže lokálně, selže i v GitHub Actions.

### 2. Kontrola workflow konfigurace
- `deploy.yml` — správné secrety, správný build command, správný deploy command
- `wrangler.jsonc` — správná cesta k `.output/server/index.mjs`, kompatibilita s TanStack Start

### 3. Kontrola chybějících env var
Workflow potřebuje v GitHub Secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

Pokud některý chybí, workflow selže.

## Oprava

- **Pokud build selže lokálně:** Opravit build chyby v kódu (chybějící importy, syntax, TypeScript chyby).
- **Pokud build projde:** Problém je pravděpodobně v GitHub Secrets. Dát uživateli instrukce, jaké secrety přidat do repo Settings → Secrets and variables → Actions.
- **Pokud je workflow konfigurace zastaralá:** Aktualizovat workflow podle aktuálního TanStack Start + Cloudflare Workers best practices.

## Výsledek
Po opravě workflow přestane posílat fail maily a bude zase automaticky deployovat na Cloudflare Workers.
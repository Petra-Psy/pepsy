## Proč Vercel teď nefunguje

Projekt je **TanStack Start s SSR**, build cílí na **Cloudflare Worker** (přes nitro). Vercel umí buď statický SPA, nebo svoje vlastní Vercel Functions — neumí spustit Cloudflare Worker bundle. Proto buď build selže, nebo nasadí jen statiku a všechny routy hodí 404.

Tenhle stack je nativně Cloudflare. Půjdeme tedy správnou cestou — Cloudflare Workers přes GitHub Actions, podobně jako u Visionary Studia jen s FTP.

## Co vytvořím

### 1. `.github/workflows/deploy.yml`
GitHub Actions workflow, který:
- spustí se při push do `main`
- nainstaluje závislosti (`bun install`)
- nabuildí projekt (`bun run build`) — vyrobí Cloudflare Worker bundle
- nasadí přes `cloudflare/wrangler-action@v3` (`wrangler deploy`)
- předá build-time env proměnné z GitHub Secrets

### 2. Ověření `wrangler.jsonc`
Zkontroluju, že je správně nastavený `name`, `main`, `compatibility_date` a `nodejs_compat` flag. Pokud chybí něco pro produkční deploy (např. custom routes/domain), doplním.

### 3. README sekce s návodem
Krátký návod, co musíš sám nastavit v GitHubu a Cloudflare — viz níže.

## Co musíš udělat ručně (jednorázově)

**V Cloudflare dashboardu:**
1. Vytvořit API token: My Profile → API Tokens → Create Token → šablona „Edit Cloudflare Workers"
2. Zkopírovat Account ID (pravý sidebar v Workers & Pages)

**V GitHub repu (Settings → Secrets and variables → Actions):**
Přidat tyto **Secrets**:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

**Custom doména:**
Po prvním úspěšném deployi → Cloudflare dashboard → Workers & Pages → pepsy → Settings → Domains & Routes → Add Custom Domain.

## Důležité upozornění

Lovable Cloud (databáze + auth) běží na Lovable infrastruktuře. Cloudflare Worker se k ní bude připojovat pomocí `VITE_SUPABASE_*` proměnných — to funguje, ale **runtime secrets** (např. `LOVABLE_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`), které máš nastavené v Lovable, **se na Cloudflare automaticky nepřenesou**. Pokud nějakou server function používáš a ta potřebuje secret, musíš ji přidat i jako Cloudflare Worker secret (`wrangler secret put NAZEV`).

Aktuálně Pepsy nejspíš žádné takové runtime secrets v server functions nepoužívá (jen veřejný anon klíč), takže by to mělo jet rovnou. Pokud něco selže, podívám se na logy.

## Alternativa, kterou doporučuji zvážit

Pokud nepotřebuješ nutně vlastní hosting a jde ti hlavně o vlastní doménu, **nejjednodušší cesta je nechat to běžet na Lovable a jen připojit custom doménu** v Project Settings → Domains. Žádný GitHub Actions, žádné Cloudflare API tokeny, žádné syncování secretů. Funguje hned a SSR, server functions i auth jedou.

Chceš pokračovat s Cloudflare Workers deployem, nebo radši zvolíš jednodušší cestu přes Lovable custom doménu?

# Deploy na Cloudflare Workers

Tenhle projekt je **TanStack Start s SSR**, nitro ho buildí jako **Cloudflare Worker**. Proto Vercel / FTP / statický hosting nefunguje — potřebuješ runtime, který umí spustit Worker bundle.

GitHub Actions workflow `.github/workflows/deploy.yml` při každém pushi do `main` udělá:
1. `bun install`
2. `bun run build` → vyrobí `.output/` (Worker + statika + `wrangler.json`)
3. `wrangler deploy` → nahraje na Cloudflare

## Jednorázové nastavení

### 1. Cloudflare API token
1. https://dash.cloudflare.com/profile/api-tokens → **Create Token**
2. Šablona **"Edit Cloudflare Workers"** → Continue → Create
3. Zkopíruj token (zobrazí se jen jednou)

### 2. Cloudflare Account ID
Dashboard → Workers & Pages → v pravém sidebaru je **Account ID**.

### 3. GitHub Secrets
Repo → **Settings → Secrets and variables → Actions → New repository secret**. Přidej:

| Name | Hodnota |
|---|---|
| `CLOUDFLARE_API_TOKEN` | token z kroku 1 |
| `CLOUDFLARE_ACCOUNT_ID` | ID z kroku 2 |
| `VITE_SUPABASE_URL` | z `.env` v projektu |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | z `.env` |
| `VITE_SUPABASE_PROJECT_ID` | z `.env` |

### 4. Vlastní doména
Po prvním úspěšném deployi:
Cloudflare dashboard → **Workers & Pages → tanstack_start_ts → Settings → Domains & Routes → Add Custom Domain**.

(Pokud chceš jiné jméno Workeru než `tanstack_start_ts`, uprav `name` v `wrangler.json`, který vygeneruje build — nebo přidej vlastní `wrangler.jsonc` do repa.)

## Runtime secrets (volitelné)

Pokud někdy přidáš server function, která čte privátní secret (např. `SUPABASE_SERVICE_ROLE_KEY`, `LOVABLE_API_KEY`), musíš ho přidat i do Cloudflare Workeru:

```bash
bunx wrangler secret put NAZEV_SECRETU
```

Pro Lovable Cloud běžné aplikace (čte se jen publishable klíč) to není potřeba.

## Vynucení HTTPS

Správné řešení je na úrovni Cloudflare (které už máš zapnuté), ale aby uživatelé na http nikdy nezůstali ani jeden request, přidám do appky dvě pojistky:

### Co udělám

1. **Meta tag `Content-Security-Policy: upgrade-insecure-requests`** v `src/routes/__root.tsx` — řekne prohlížeči, ať všechny http odkazy/zdroje automaticky bere jako https.

2. **Klientský redirect** v `RootShell` (malý inline script v `<head>`) — pokud se stránka přesto otevře přes `http://` (na produkční doméně, ne na `localhost`), okamžitě přesměruje na `https://` přes `location.replace()`. Tím se to spraví i v případě, kdy Cloudflare „Always Use HTTPS" z nějakého důvodu request nezachytí (např. cache mobilního prohlížeče).

### Co doporučím udělat v Cloudflare (nemůžu za tebe)

- **SSL/TLS → Edge Certificates → Always Use HTTPS: ON** (asi už máš)
- **SSL/TLS → Edge Certificates → Automatic HTTPS Rewrites: ON**
- **HSTS** zapnout (Enable HSTS, max-age 6+ měsíců, include subdomains, preload) — po HSTS si prohlížeč pamatuje, že na doménu má chodit jen přes https, a problém s mobilním prohlížečem zmizí natrvalo.

HSTS header bych mohl posílat i z aplikace, ale na Cloudflare Workers/edge přes TanStack Start je to zbytečně křehké — Cloudflare to umí jedním přepínačem správně.

### Proč k tomu došlo

Mobilní prohlížeč si nejspíš pamatoval starou http verzi (před zapnutím Always Use HTTPS) v cache/historii a otevřel ji napřímo. Bez HSTS nemá prohlížeč jak vědět, že má http verzi přeskočit.

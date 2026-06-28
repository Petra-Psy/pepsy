Ověření:
- V preview jsou všechny 4 ikony ve službách načtené ze správných `__l5e/assets-v1/...` cest.
- Prohlížeč je hlásí jako `complete: true`, každá má `naturalWidth/naturalHeight: 1024x1024` a reálně se vykresluje jako `40x40`.
- Na publikované doméně `pepsy.lovable.app` asset URL vrací `image/png`, takže soubory existují a cesta je platná.

Plán úpravy:
1. Přidat verzování URL ikon v kódu, např. `?v=20260628`, aby nový build přes Cloudflare/GitHub nepoužíval starou cache pro tyto assety.
2. Nezasahovat do cookies globálním mazáním — automatické mazání cookies by mohlo odhlašovat admina a rozbíjet editaci.
3. Pokud bude potřeba tvrdší řešení, přidat jen cache-busting pro statické obrázky ikon, ne pro uživatelská data ani přihlášení.
4. Zapsat do projektové paměti pravidlo: projekt běží přes Cloudflare napojený na GitHub, takže při změnách myslet na CDN/build cache.

Technicky:
- Změna bude jen v referenci ikon v `src/routes/index.tsx`.
- Cookies/localStorage se mazat nebudou; místo toho se vynutí nová URL assetů pro prohlížeč a CDN.
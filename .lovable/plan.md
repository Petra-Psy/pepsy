Nemyslím, že jde o výpadek. Podle screenshotu už se používá správná interní URL `/api/soubor/pricing.agreement.pdf`, ale na custom doméně selže načtení souboru na serveru. Nejpravděpodobnější příčina je, že tahle serverová route na externím deploymentu nemá dostupné `process.env` hodnoty, zatímco v Lovable preview fungovala.

Plán opravy:
1. Upravím `/api/soubor/$fileKey`, aby pro veřejný backend klient používal fallback na veřejné `VITE_` proměnné, nejen `process.env`.
2. Ponechám výdej PDF přes doménu webu, takže se už nebude otevírat blokovaná backendová doména.
3. Přidám přesnější chování pro chyby: pokud chybí konfigurace, soubor v databázi, nebo storage download, bude jasné, kde to padá.
4. Ověřím lokálně, že `/api/soubor/pricing.agreement.pdf` vrací `application/pdf` a začíná jako skutečný PDF soubor.
5. Pokud bude potřeba pro custom doménu, upozorním jen na nutnost znovu publikovat/deploynout změnu, protože petrapsy.eu běží přes externí Cloudflare/GitHub cache.
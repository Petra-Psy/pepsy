Problém je v tom, že odkaz vede přímo na backendovou storage doménu a Chrome ji u vás blokuje jako `ERR_BLOCKED_BY_CLIENT`. Soubor je nahraný a podepsaný URL se generuje, ale prohlížeč/rozšíření blokuje samotnou externí doménu.

Plán opravy:
1. Přidám interní veřejnou routu v aplikaci, např. `/soubor/$key`, která po otevření najde soubor podle klíče `pricing.agreement.pdf`.
2. Route stáhne PDF serverově z úložiště a vrátí ho přes doménu webu, takže návštěvník už nepůjde na blokovanou backend doménu.
3. Upravím `EditableFileLink`, aby odkazoval na tuto interní routu místo přímého signed storage odkazu.
4. Zachovám admin nahrávání PDF beze změny a ponechám editovatelný text odkazu.
5. Ověřím, že odkaz z ceníku už míří na doménu aplikace a otevře PDF v novém panelu.
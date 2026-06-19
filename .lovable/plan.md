## Diagnóza

Trasa `/rezervace` v kódu existuje a je správně zaregistrovaná v `routeTree.gen.ts`. Lokální dev server na `/rezervace` vrací **HTTP 200** a renderuje rezervační stránku — žádný 404.

To znamená, že 404 nevidíš v živém preview sandboxu, ale na **publikované verzi** (`pepsy.lovable.app`), která pořád ještě běží ze starého buildu (před přidáním `/rezervace`). Publikovaná verze se neaktualizuje automaticky při každé úpravě — je potřeba ji znovu publikovat.

## Plán

1. **Znovu publikovat projekt** — tím se nasadí aktuální build s rezervační stránkou. Po publikaci budou všechna tlačítka „Rezervace" / „Objednat se" / „Rezervovat online" mířit na funkční `/rezervace`.
2. Pokud i po republikaci uvidíš 404, zkus tvrdě refresh (Ctrl+Shift+R) — prohlížeč může držet starou cache.

## Co tedy v kódu měnit?

Nic. Kód je správně. Stačí publikovat.

<presentation-actions>
<presentation-open-publish>Publish your app</presentation-open-publish>
</presentation-actions>

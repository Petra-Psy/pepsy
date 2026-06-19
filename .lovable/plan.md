## Cíl

Zbavit se modálu (kvůli kterému Reenio widget posílá postMessage chyby a vyjíždí mimo viewport) a vložit rezervační widget natvrdo do stránky jako samostatnou sekci. Všechna tlačítka „Rezervace" a „Objednat se" budou plynule scrollovat k téhle sekci.

## Co se změní

1. **Nová sekce `#rezervace`** v `src/routes/index.tsx`
   - Nadpis „Rezervace" + krátký editovatelný úvodní text (`booking.intro`).
   - Container, do kterého se vyrenderuje `<div class="reenio-iframe" data-size="auto" />`.
   - Script `https://reenio.cz/cs/GI3DQNRR/widget-iframe.js` se načte jednou při mountu sekce (přes `useEffect`, `async defer`, idempotentně — pokud už je v DOMu, znovu se nevkládá).
   - Sekce se přidá do hlavní navigace (`NAV`) mezi stávající položky (nejspíš před „Kontakt").

2. **Nový sdílený komponent `ReenioWidget`** (`src/components/ReenioWidget.tsx`)
   - Vyrenderuje cílový div a zajistí jednorázové načtení Reenio scriptu.
   - Skript URL se bere ze `site_content` klíče `booking.widget_url` (už nastaveno), takže admin to může i nadále měnit přes ozubené kolečko.

3. **`BookingLink` v `src/routes/index.tsx`**
   - Místo otevírání modálu bude vždy plynule scrollovat na `#rezervace` (`scrollIntoView({ behavior: 'smooth' })`).
   - Týká se obou stávajících tlačítek: nav „Rezervace" i hero „Objednat se".
   - V admin edit módu se nadále chová jako neutrální tlačítko, aby šel editovat text.

4. **Úklid**
   - `src/components/BookingModal.tsx` se smaže (už nebude potřeba).
   - V `AdminToolbar` Settings modálu zůstane pole pro Reenio widget URL (klíč `booking.widget_url`), popisek upravím tak, aby reflektoval, že jde o vložený widget v sekci Rezervace, ne modál.
   - `booking.url` (záložní přímý odkaz) zůstává — kdyby někdy widget URL nebyla nastavená, tlačítka spadnou na něj (nebo na `#rezervace` anchor).

## Co se nemění

- Obsah, design ani existující barevné/typografické tokeny.
- Admin editování textů, obrázků a SiteContent.
- Reenio konfigurace v `site_content` (klíč `booking.widget_url` je už nastavený na správnou URL).

## Technické poznámky

- Reenio script je idempotentní pouze v rámci jedné instance widgetu na stránce — kontroluju existenci `script[data-reenio-loaded="1"]` v `document.head`/`body` před vložením.
- `postMessage` chyby z předchozí verze zmizí, protože widget poběží přímo v document flow, kde s rodičovským oknem komunikuje korektně (modál mu rušil odkaz na parent při unmount/remount).
- Sekce dostane `scroll-margin-top` odpovídající výšce sticky headeru (64 px), aby scroll nezakryl nadpis.

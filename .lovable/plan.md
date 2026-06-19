## Napojení rezervací – Reenio widget (iframe)

### Cíl
Umožnit návštěvníkům rezervovat se přímo na webu pomocí vloženého Reenio rezervačního widgetu (iframe), aniž by museli opustit stránku.

### Technický přístup
Reenio podporuje vložení rezervačního systému do webu přes `<iframe>`. Uživatel/ka si z Reenio adminu zkopíruje embed URL, vloží ho do webového adminu a rezervační formulář se pak zobrazí v modálním okně přímo na stránce.

### Krok 1 – Admin konfigurace widget URL
- Rozšířit admin rozhraní o možnost nastavit nový klíč `booking.widget_url` v tabulce `site_content`.
- Vedle existujícího `booking.url` (přímý odkaz) přidat pole pro „Embed URL z Reenia“.
- Pokud uživatel/ka nezadá widget URL, stránka se chová jako dosud (pouze přímý odkaz).

### Krok 2 – Modální okno s iframe
- Vytvořit novou komponentu `BookingModal` (`src/components/BookingModal.tsx`):
  - Overlay na celou obrazovku, zavíratelný křížkem a klávesou Esc.
  - Uvnitř responzivní `<iframe>` s `src={booking.widget_url}`.
  - Výška iframu: na desktopu ~600–700 px, na mobilu 100 % viewport výšky.
  - Přidat načítací stav (spinner) dokud se iframe nenačte.
  - Zabránit scrollování stránky pod otevřeným modalem.

### Krok 3 – Aktualizace tlačítek „Objednat se / Rezervovat“
- Upravit komponenty `BookingButton` (Hero sekce) a `BookingLink` (Kontakt sekce):
  - Pokud je v `site_content` nastaveno `booking.widget_url`, kliknutí otevře `BookingModal`.
  - Pokud není nastaveno, ponechá se stávající chování – přesměrování na `booking.url` (nebo `#kontakt`).
  - V admin režimu (edit mód) se modal neotevírá – klik funguje jako dosud, aby bylo možné editovat text tlačítka.

### Krok 4 – Responzivita a UX
- Desktop: modal vycentrovaný, max šířka 960 px, zaoblené rohy, stín.
- Mobil: modal na celou šířku a výšku obrazovky, bez okrajů.
- Plynulá animace otevření/zavření (fade-in + scale).

### Soubory ke změně
- `src/components/BookingModal.tsx` – nový modal s iframe
- `src/routes/index.tsx` – úprava `BookingButton` a `BookingLink` pro otevření modalu
- Admin konfigurace – rozšíření o nastavení `booking.widget_url` (podle stávajícího vzoru `booking.url`)

### Co bude potřeba od uživatele
- Embed URL z Reenio adminu (nastavení → vložení do webu → zkopírovat iframe src).

Bez tohoto URL se nic nezmění – stránka bude fungovat jako dosud s přímým odkazem.
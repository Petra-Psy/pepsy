# Onepager psychologického poradenství + admin editace

## Cíl
Jeden veřejný onepager (sekce O mně, Služby, FAQ, Kontakt, Rezervace) podle přiložené předlohy. Po přihlášení admina se na stránce zapne „Edit mód" – všechny texty a klíčové fotky jdou měnit přímo na místě, bez separátního CMS. Rezervační systém zatím není – tlačítko „Objednat se" povede na externí URL (doplníte později v adminu).

## Design
- Klidná, teplá paleta z předlohy: krémové pozadí, šalvějově zelená (`#7d9b76` / `Sage & Cream` paleta), warm sand neutrály, tmavá zem na text.
- Typografie: nadpisy `Outfit` (geometrické, jemné), tělo `Figtree`. Velkorysý whitespace, jemné stíny, žádné fialové gradienty.
- Layout přesně jako na předloze:
  1. **Hero** – fotka psycholožky vpravo, vlevo nadpis „POMÁHÁM LIDEM ZVLÁDAT ÚZKOSTI A KRIZOVÉ SITUACE", podnadpis, CTA „Objednat se", nahoře sticky nav (O mně / Služby / FAQ / Kontakt / Rezervace).
  2. **O mně** – portrét + jméno/titul, bloky „Mé vzdělání", „Můj přístup", „Představení".
  3. **Služby** – 4 karty (Úzkostné stavy, Vyhoření a stres, Vztahové problémy, Ceník) s ikonami.
  4. **FAQ** – accordion (Co mě čeká, Jak dlouho terapie trvá, Předepisujete léky?).
  5. **Kontakt** – telefon, e-mail, ordinace + odkaz „Rezervovat online" (externí URL).
- Plně responzivní (mobil / tablet / desktop) podle náhledu.

## Editovatelnost (vzor Visionary Studio, přizpůsobeno TanStack Startu)
- Každý text na stránce je obalený komponentou `<EditableText contentKey="hero.title" defaultValue="…" />`.
- Stejně tak fotky: `<EditableImage contentKey="hero.photo" defaultSrc="…" />` – v edit módu klik otevře upload do storage bucketu.
- Pro nepřihlášené / vypnutý edit mód se vykreslí čistý text/`<img>` bez jakékoli UI navíc – nulový vliv na běžného návštěvníka.
- Plovoucí `AdminToolbar` vpravo dole (jen pro admina): přepínač „Edit mód", tlačítko „Odhlásit".

## Backend (Lovable Cloud)
Tabulky:
- `site_content (key text PK, value text, updated_at)` – všechny texty.
- `site_images (key text PK, storage_path text, updated_at)` – cesty k obrázkům.
- `user_roles (user_id, role app_role)` + enum `app_role` a `has_role()` SECURITY DEFINER funkce (oddělená role tabulka kvůli bezpečnosti).
- Storage bucket `site-images` (veřejný pro čtení, zápis jen admin).

RLS:
- `site_content` / `site_images`: `SELECT` veřejně (anon), `INSERT/UPDATE` jen pro `has_role(auth.uid(),'admin')`.
- `user_roles`: SELECT jen authenticated, žádný self-grant.
- Bucket `site-images`: read public, write/update/delete jen admin.

Žádná veřejná registrace – vytvořím vám **jeden admin účet** (email + heslo, dodáte mi je v dalším kroku, případně si je nastavíte přes „zapomenuté heslo"). Stránka `/auth` je skrytá, dostupná jen na přímou URL.

## Stránky / routy
- `/` – onepager s kotvami `#o-mne`, `#sluzby`, `#faq`, `#kontakt`.
- `/auth` – login (jen email + heslo, bez registrace).
- `/_authenticated/admin/settings` – jednoduchá stránka pro globální nastavení, které se špatně edituje inline: URL externí rezervace, telefon, email, adresa, Google Maps embed.

## Obrázky
Vygeneruji AI placeholdery v duchu předlohy:
- Hero – usměvavá žena 30-40 let, zelený svetr, světlá útulná místnost, přirozené světlo.
- Portrét do „O mně" – stejná osoba, neutrální pozadí.
- 4 ikony pro služby (mozek, jiskra, srdce, ceník) – jako jemné line illustrace v sage barvě.
Vše vyměnitelné v adminu.

## Co ode mě po schválení plánu ještě budete potřebovat
1. Email + heslo pro admin účet (nebo email a já vám vygeneruju heslo k první změně).
2. Externí URL na rezervační systém / Calendly – pokud zatím nemáte, dám `mailto:` placeholder a změníte v adminu.
3. Reálné kontakty (telefon, email, adresa ordinace) až je budete chtít vyměnit za placeholdery – jde i později přímo v editaci.

## Co bude v dalším kroku (mimo tento plán)
- Plný rezervační systém (kalendář, dostupné termíny, potvrzovací emaily) – až po doladění onepageru.

## Technické poznámky
- Stack zůstává TanStack Start + Lovable Cloud (Supabase pod kapotou).
- Texty/obrázky se načítají v rootu přes TanStack Query (`ensureQueryData`) – první render nemá flash.
- Update z `EditableText` přes `createServerFn` s `requireSupabaseAuth` + kontrola role admin; po úspěchu invaliduje query.
- Upload obrázků: přes `supabase.storage` z prohlížeče (admin session), zapíše se `storage_path` do `site_images`.
- Login routa `/auth` mimo `_authenticated/`, admin UI uvnitř (managed gate).

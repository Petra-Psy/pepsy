## Oprava ikon služeb

Potvrdil jsem skutečnou příčinu: všechny čtyři adresy ikon pod `pepsy.lovable.app/__l5e/assets-v1/...` vracejí **403 Forbidden**. Nejde tedy o cache ani admin rozhraní; obrázky jsou v kódu správně napojené, ale publikovaný web k nim nemá přístup.

1. Stáhnu existující čtyři správné ilustrace z funkčního náhledu.
2. Převedu je na optimalizované lokální obrazové soubory zahrnuté přímo do výsledného buildu, bez závislosti na problematické CDN cestě.
3. Zachovám jejich současný vzhled, rozměry i texty karet; změním pouze způsob načítání.
4. Ověřím každou ikonu v náhledu a následně i její výslednou cestu v produkčním buildu, včetně režimu admina.
5. Po novém publikování budou ikony součástí webového balíčku, takže je přihlášení, editace obsahu ani vyčištění cache nemůže odstranit.
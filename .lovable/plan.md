## Stav

- **Ikony služeb**: v pořádku, jsou zapojené jako statické `.webp` importy v `src/assets/` a nejsou napojené na admin ani databázi, takže je žádná akce na webu nemůže přepsat.
- **Zmizelé texty a sekce (ceník atd.)**: už opraveno v minulém kole — CZ a EN se ukládají nezávisle, prázdné hodnoty padají zpět na defaulty z kódu, a poškozené řádky v databázi byly obnoveny.

## Návrh

Žádnou další změnu nedělat. Pokud během používání znovu zmizí konkrétní text nebo sekce, pošli mi:
1. který text/sekci (např. „ceník — cena prvního sezení"),
2. v jaké jazykové verzi (CZ/EN),
3. co jsi předtím upravoval,

a cíleně to dohledám v databázi a opravím.

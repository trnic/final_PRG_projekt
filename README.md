# Football Training Analyzer

Jednoduchá webová aplikace pro analýzu fotbalového tréninku.

## Spuštění

1. Nainstaluj závislosti: `npm install`
2. Přelož TypeScript do JavaScriptu: `npm run build`
3. Otevři projekt přes **Live Server** ve VS Code (nebo jiný lokální server)

Při úpravách kódu piš vždy jen do `.ts` souborů a pak spusť `npm run build`.
Soubory `.js` se generují automaticky, needituj je ručně.

Poznámka: kvůli `import`/`export` v TypeScriptu nestačí dvojklik na `index.html`.
Stránku je potřeba otevřít přes server (např. Live Server).

Pro automatický překlad při každé změně můžeš použít: `npm run watch`

## Soubory

- `index.html` - struktura stránky
- `style.css` - vzhled aplikace
- `data.ts` - typy tréninku a ukázková data (zdrojový kód)
- `main.ts` - logika aplikace (zdrojový kód)
- `data.js` a `main.js` - vygenerované soubory pro prohlížeč

## Funkce

- analýza tréninku podle typu, délky, intenzity a hodnoty
- rychlé ukázky s okamžitým výsledkem
- historie tréninků (ukládá se do prohlížeče)
- kliknutí na položku v historii znovu zobrazí výsledek
- tlačítko pro smazání historie

import { VysledekTreninku } from "../modely/VysledekTreninku.js";

/**
 * Třída se stará o historii tréninků.
 */
export class HistorieTreninku {

    constructor() {
        this.historie = [];
        this.klicProLocalStorage = "training-history";
    }

    ziskejHistorii() {
        return this.historie;
    }

    pridejDoHistorie(vysledek) {
        this.historie.unshift(vysledek);
        this.ulozHistorii();
    }

    ulozHistorii() {
        localStorage.setItem(this.klicProLocalStorage, JSON.stringify(this.historie));
    }

    nactiHistorii() {
        const ulozenaHistorie = localStorage.getItem(this.klicProLocalStorage);

        if (!ulozenaHistorie) {
            return;
        }

        try {
            const data = JSON.parse(ulozenaHistorie);
            this.historie = [];

            for (const polozka of data) {
                // --- OPRAVA: Odolnost proti starým (anglickým) datům z minulé verze ---
                // Pokud z paměti vytáhneme něco, co nemá vlastnost "typ", vyhodíme chybu.
                // Kód tak automaticky přeskočí do "catch" bloku dole a stará data smaže.
                if (!polozka.typ || !polozka.minuty) {
                    throw new Error("Nalezena nekompatibilní data z předchozí verze.");
                }

                const vysledek = new VysledekTreninku(
                    polozka.typ,
                    polozka.minuty,
                    polozka.intenzita,
                    polozka.hodnota,
                    polozka.skore,
                    polozka.kalorie,
                    polozka.uroven,
                    polozka.tridaUrovne,
                    polozka.doporuceni
                );

                this.historie.push(vysledek);
            }
        } catch {
            // Pokud nastane chyba, smažeme paměť, abychom aplikaci neblokovali
            localStorage.removeItem(this.klicProLocalStorage);
        }
    }

    vymazHistorii() {
        this.historie = [];
        localStorage.removeItem(this.klicProLocalStorage);
    }
}
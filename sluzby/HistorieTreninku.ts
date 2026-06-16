import { VysledekTreninku } from "../modely/VysledekTreninku.js";

/**
 * Třída se stará o historii tréninků.
 */
export class HistorieTreninku {

    historie: VysledekTreninku[];
    klicProLocalStorage: string;

    constructor() {
        this.historie = [];
        this.klicProLocalStorage = "training-history";
    }

    ziskejHistorii(): VysledekTreninku[] {
        return this.historie;
    }

    pridejDoHistorie(vysledek: VysledekTreninku): void {
        this.historie.unshift(vysledek);
        this.ulozHistorii();
    }

    ulozHistorii(): void {
        localStorage.setItem(this.klicProLocalStorage, JSON.stringify(this.historie));
    }

    nactiHistorii(): void {
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

    vymazHistorii(): void {
        this.historie = [];
        localStorage.removeItem(this.klicProLocalStorage);
    }
}
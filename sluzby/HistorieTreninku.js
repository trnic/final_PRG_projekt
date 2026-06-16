import { VysledekTreninku } from "../modely/VysledekTreninku.js";

/**
 * Třída se stará o historii tréninků.
 */
export class HistorieTreninku {

    /**
     * Vytvoří prázdnou historii.
     */
    constructor() {

        this.historie = [];

        this.klicProLocalStorage = "training-history";
    }

    /**
     * Vrátí historii tréninků.
     */
    ziskejHistorii() {

        return this.historie;
    }

    /**
     * Přidá nový výsledek do historie.
     */
    pridejDoHistorie(vysledek) {

        this.historie.unshift(vysledek);

        this.ulozHistorii();
    }

    /**
     * Uloží historii do localStorage.
     */
    ulozHistorii() {

        localStorage.setItem(
            this.klicProLocalStorage,
            JSON.stringify(this.historie)
        );
    }

    /**
     * Načte historii z localStorage.
     */
    nactiHistorii() {

        const ulozenaHistorie = localStorage.getItem(
            this.klicProLocalStorage
        );

        if (!ulozenaHistorie) {
            return;
        }

        try {

            const data = JSON.parse(ulozenaHistorie);

            this.historie = [];

            for (const polozka of data) {

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

            localStorage.removeItem(
                this.klicProLocalStorage
            );
        }
    }

    /**
     * Vymaže celou historii.
     */
    vymazHistorii() {

        this.historie = [];

        localStorage.removeItem(
            this.klicProLocalStorage
        );
    }

}
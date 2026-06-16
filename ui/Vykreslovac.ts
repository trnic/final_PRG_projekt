import { VysledekTreninku } from "../modely/VysledekTreninku.js";
import { nastaveniTypuTreninku } from "../data/NastaveniTypuTreninku.js";

/**
 * Třída se stará o zobrazování výsledků a historie.
 */
export class Vykreslovac {

    output: HTMLElement | null;
    seznamHistorie: HTMLElement | null;

    /**
     * Najde potřebné HTML prvky.
     */
    constructor() {

        this.output = document.querySelector("#output");

        this.seznamHistorie = document.querySelector("#history-list");
    }

    /**
     * Zobrazí chybovou hlášku.
     */
    zobrazChybu(zprava: string): void {

        if (!this.output) {
            return;
        }

        this.output.innerHTML = `
            <p class="error">${zprava}</p>
        `;
    }

    /**
     * Vrátí text s hodnotou podle typu tréninku.
     */
    vytvorTextHodnoty(vysledek: VysledekTreninku): string {

        const nastaveni = nastaveniTypuTreninku[vysledek.typ as keyof typeof nastaveniTypuTreninku];

        if (vysledek.typ === "technika") {
            return `${vysledek.hodnota}${nastaveni.jednotka}`;
        }

        return `${vysledek.hodnota} ${nastaveni.jednotka}`;
    }

    /**
     * Zobrazí výsledek tréninku.
     */
    zobrazVysledek(vysledek: VysledekTreninku): void {

        if (!this.output) {
            return;
        }

        const nastaveni = nastaveniTypuTreninku[vysledek.typ as keyof typeof nastaveniTypuTreninku];

        this.output.innerHTML = `
            <article class="result">

                <div>
                    <p class="result-label">
                        ${nastaveni.nazev}
                    </p>

                    <h2>
                        ${vysledek.skore}/100
                    </h2>
                </div>

                <dl>

                    <div>
                        <dt>Délka</dt>
                        <dd>${vysledek.minuty} min</dd>
                    </div>

                    <div>
                        <dt>Intenzita</dt>
                        <dd>${vysledek.intenzita}/10</dd>
                    </div>

                    <div>
                        <dt>${nastaveni.popisekHodnoty}</dt>
                        <dd>${this.vytvorTextHodnoty(vysledek)}</dd>
                    </div>

                    <div>
                        <dt>Kalorie</dt>
                        <dd>${vysledek.kalorie} kcal</dd>
                    </div>

                </dl>

                <p class="badge badge-${vysledek.tridaUrovne}">
                    ${vysledek.uroven}
                </p>

                <p>
                    ${vysledek.doporuceni}
                </p>

            </article>
        `;
    }

    /**
     * Zobrazí historii tréninků.
     */
    zobrazHistorii(
        historie: VysledekTreninku[],
        poKliknuti: (index: number) => void
    ): void {

        if (!this.seznamHistorie) {
            return;
        }

        if (historie.length === 0) {

            this.seznamHistorie.innerHTML =
                `<li class="empty">Zatím žádný trénink.</li>`;

            return;
        }

        let html = "";

        for (let i = 0; i < historie.length; i++) {

            const polozka = historie[i];

            const nastaveni =
                nastaveniTypuTreninku[polozka.typ as keyof typeof nastaveniTypuTreninku];

            html += `
                <li data-index="${i}">
                    <span>
                        ${i + 1}. ${nastaveni.nazev}
                    </span>

                    <strong>
                        ${polozka.skore}/100
                    </strong>
                </li>
            `;
        }

        this.seznamHistorie.innerHTML = html;

        const polozky =
            this.seznamHistorie.querySelectorAll("li[data-index]");

        polozky.forEach((polozka) => {

            polozka.addEventListener("click", () => {

                const index =
                    Number(polozka.getAttribute("data-index"));

                poKliknuti(index);

            });

        });

    }

}
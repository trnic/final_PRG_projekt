import { Trenink } from "../modely/Trenink.js";
import { ValidatorTreninku } from "../sluzby/ValidatorTreninku.js";
import { AnalyzatorTreninku } from "../sluzby/AnalyzatorTreninku.js";
import { HistorieTreninku } from "../sluzby/HistorieTreninku.js";
import { Vykreslovac } from "./Vykreslovac.js";
import { prikladoveTreninky } from "../data/PrikladoveTreninky.js";
import { nastaveniTypuTreninku } from "../data/NastaveniTypuTreninku.js";

/**
 * Třída se stará o formulář a komunikaci s HTML.
 */
export class SpravceFormulare {

    validator: ValidatorTreninku;
    analyzator: AnalyzatorTreninku;
    historie: HistorieTreninku;
    vykreslovac: Vykreslovac;

    formular: HTMLFormElement | null;
    typInput: HTMLSelectElement | null;
    minutyInput: HTMLInputElement | null;
    intenzitaInput: HTMLInputElement | null;
    hodnotaInput: HTMLInputElement | null;
    popisekHodnoty: HTMLElement | null;
    jednotka: HTMLElement | null;
    tlacitkoVymazat: HTMLButtonElement | null;
    tlacitkaUkazek: NodeListOf<HTMLButtonElement>;

    constructor(
        validator: ValidatorTreninku,
        analyzator: AnalyzatorTreninku,
        historie: HistorieTreninku,
        vykreslovac: Vykreslovac
    ) {

        this.validator = validator;
        this.analyzator = analyzator;
        this.historie = historie;
        this.vykreslovac = vykreslovac;

        this.formular = document.querySelector("#training-form");
        this.typInput = document.querySelector("#type");
        this.minutyInput = document.querySelector("#minutes");
        this.intenzitaInput = document.querySelector("#intensity");
        this.hodnotaInput = document.querySelector("#value");
        this.popisekHodnoty = document.querySelector("#value-label");
        this.jednotka = document.querySelector("#value-unit");

        this.tlacitkoVymazat =
            document.querySelector("#clear-history");

        this.tlacitkaUkazek =
            document.querySelectorAll("[data-example]");
    }

    /**
     * Vrátí číslo z inputu.
     */
    prectiCislo(input: HTMLInputElement | null): number {

        return Number(input?.value || 0);
    }

    /**
     * Aktualizuje text u hodnoty.
     */
    aktualizujPole(): void {

        const typ = this.typInput?.value || "sprint";

        const nastaveni =
            nastaveniTypuTreninku[typ as keyof typeof nastaveniTypuTreninku];

        if (this.popisekHodnoty) {
            this.popisekHodnoty.textContent =
                nastaveni.popisekHodnoty;
        }

        if (this.jednotka) {
            this.jednotka.textContent =
                nastaveni.jednotka;
        }
    }

    /**
     * Vyplní ukázkový trénink.
     */
    vyplnUkazku(index: number): void {

        const trenink = prikladoveTreninky[index];

        if (!trenink) {
            return;
        }

        if (this.typInput) {
            this.typInput.value = trenink.typ;
        }

        if (this.minutyInput) {
            this.minutyInput.value =
                String(trenink.minuty);
        }

        if (this.intenzitaInput) {
            this.intenzitaInput.value =
                String(trenink.intenzita);
        }

        if (this.hodnotaInput) {
            this.hodnotaInput.value =
                String(trenink.hodnota);
        }

        this.aktualizujPole();

        const vysledek =
            this.analyzator.analyzujTrenink(trenink);

        this.vykreslovac.zobrazVysledek(vysledek);
    }

    /**
     * Spustí aplikaci.
     */
    spustAplikaci(): void {

        this.historie.nactiHistorii();

        this.vykreslovac.zobrazHistorii(
            this.historie.ziskejHistorii(),
            (index) => {

                const vysledek =
                    this.historie.ziskejHistorii()[index];

                this.vykreslovac.zobrazVysledek(vysledek);

            }
        );

        this.formular?.addEventListener(
            "submit",
            (udalost) => {

                udalost.preventDefault();

                const trenink = new Trenink(
                    this.typInput?.value || "sprint",
                    this.prectiCislo(this.minutyInput),
                    this.prectiCislo(this.intenzitaInput),
                    this.prectiCislo(this.hodnotaInput)
                );

                const chyba =
                    this.validator.zkontrolujTrenink(trenink);

                if (chyba) {

                    this.vykreslovac.zobrazChybu(chyba);

                    return;
                }

                const vysledek =
                    this.analyzator.analyzujTrenink(trenink);

                this.historie.pridejDoHistorie(vysledek);

                this.vykreslovac.zobrazVysledek(vysledek);

                this.vykreslovac.zobrazHistorii(
                    this.historie.ziskejHistorii(),
                    (index) => {

                        const vysledek =
                            this.historie.ziskejHistorii()[index];

                        this.vykreslovac.zobrazVysledek(vysledek);

                    }
                );

            }
        );

        this.typInput?.addEventListener(
            "change",
            () => this.aktualizujPole()
        );

        this.tlacitkoVymazat?.addEventListener(
            "click",
            () => {

                this.historie.vymazHistorii();

                this.vykreslovac.zobrazHistorii(
                    [],
                    () => {}
                );

            }
        );

        this.tlacitkaUkazek.forEach((tlacitko) => {

            tlacitko.addEventListener(
                "click",
                () => {

                    const index =
                        Number(tlacitko.dataset.example);

                    this.vyplnUkazku(index);

                }
            );

        });

        this.vyplnUkazku(0);

    }

}
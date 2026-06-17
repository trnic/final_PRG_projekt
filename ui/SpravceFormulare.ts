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

    private validator: ValidatorTreninku;
    private analyzator: AnalyzatorTreninku;
    private historie: HistorieTreninku;
    private vykreslovac: Vykreslovac;

    private formular: HTMLFormElement | null;
    private typInput: HTMLSelectElement | null;
    private minutyInput: HTMLInputElement | null;
    private intenzitaInput: HTMLInputElement | null;
    private hodnotaInput: HTMLInputElement | null;
    private popisekHodnoty: HTMLElement | null;
    private jednotka: HTMLElement | null;
    private tlacitkoVymazat: HTMLButtonElement | null;
    private tlacitkaUkazek: NodeListOf<HTMLButtonElement>;

    public constructor(
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
    private prectiCislo(input: HTMLInputElement | null): number {
        return Number(input?.value || 0);
    }

    /**
     * Aktualizuje text u hodnoty.
     */
    private aktualizujPole(): void {
        const typ = this.typInput?.value || "sprint";
        const nastaveni =
            nastaveniTypuTreninku[typ as keyof typeof nastaveniTypuTreninku];

        if (this.popisekHodnoty) {
            this.popisekHodnoty.textContent = nastaveni.popisekHodnoty;
        }

        if (this.jednotka) {
            this.jednotka.textContent = nastaveni.jednotka;
        }

        // --- OPRAVA: Dynamická změna zástupného textu (placeholder) a maxima (UX) ---
        if (this.hodnotaInput) {
            this.hodnotaInput.placeholder = typ === "technika" ? "např. 8" : "např. 120";
            this.hodnotaInput.max = typ === "technika" ? "10" : "";
        }
    }

    /**
     * Vyplní ukázkový trénink.
     */
    private vyplnUkazku(index: number): void {
        const trenink = prikladoveTreninky[index];

        if (!trenink) {
            return;
        }

        if (this.typInput) {
            this.typInput.value = trenink.typ;
        }

        if (this.minutyInput) {
            this.minutyInput.value = String(trenink.minuty);
        }

        if (this.intenzitaInput) {
            this.intenzitaInput.value = String(trenink.intenzita);
        }

        if (this.hodnotaInput) {
            this.hodnotaInput.value = String(trenink.hodnota);
        }

        this.aktualizujPole();

        const vysledek =
            this.analyzator.analyzujTrenink(trenink);

        this.vykreslovac.zobrazVysledek(vysledek);
    }

    /**
     * Spustí aplikaci.
     */
    public spustAplikaci(): void {
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

                // --- OPRAVA: Vymazání starého výsledku z obrazovky ---
                this.vykreslovac.vymazVysledekZpravou("Historie byla smazána. Zadej nový trénink.");
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

        // --- OPRAVA: Zamezení přepisování historie po startu aplikace ---
        if (this.historie.ziskejHistorii().length > 0) {
            // Pokud máme uloženou historii, ukážeme nejnovější výsledek z ní
            this.vykreslovac.zobrazVysledek(this.historie.ziskejHistorii()[0]);
        } else {
            // Pokud je historie prázdná, předvyplníme první trénink (Sprint)
            this.vyplnUkazku(0);
        }
    }

}
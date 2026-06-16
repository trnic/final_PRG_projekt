import { Trenink } from "./Trenink.js";

/**
 * Třída představuje vyhodnocený trénink.
 */
export class VysledekTreninku extends Trenink {

    /**
     * Vytvoří nový výsledek tréninku.
     */
    constructor(
        typ,
        minuty,
        intenzita,
        hodnota,
        skore,
        kalorie,
        uroven,
        tridaUrovne,
        doporuceni
    ) {

        super(
            typ,
            minuty,
            intenzita,
            hodnota
        );

        this.skore = skore;
        this.kalorie = kalorie;
        this.uroven = uroven;
        this.tridaUrovne = tridaUrovne;
        this.doporuceni = doporuceni;
    }

}
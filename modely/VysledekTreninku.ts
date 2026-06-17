import { Trenink } from "./Trenink.js";

/**
 * Třída představuje vyhodnocený trénink.
 */
export class VysledekTreninku extends Trenink {

    public skore: number;
    public kalorie: number;
    public uroven: string;
    public tridaUrovne: string;
    public doporuceni: string;

    /**
     * Vytvoří nový výsledek tréninku.
     */
    public constructor(
        typ: string,
        minuty: number,
        intenzita: number,
        hodnota: number,
        skore: number,
        kalorie: number,
        uroven: string,
        tridaUrovne: string,
        doporuceni: string
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
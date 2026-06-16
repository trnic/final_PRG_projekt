/**
 * Třída představuje jeden trénink.
 */
export class Trenink {

    typ: string;
    minuty: number;
    intenzita: number;
    hodnota: number;

    /**
     * Vytvoří nový trénink.
     */
    constructor(
        typ: string,
        minuty: number,
        intenzita: number,
        hodnota: number
    ) {
        this.typ = typ;
        this.minuty = minuty;
        this.intenzita = intenzita;
        this.hodnota = hodnota;
    }

}
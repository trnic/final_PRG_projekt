/**
 * Třída představuje jeden trénink.
 */
export class Trenink {

    /**
     * Vytvoří nový trénink.
     */
    constructor(
        typ,
        minuty,
        intenzita,
        hodnota
    ) {
        this.typ = typ;
        this.minuty = minuty;
        this.intenzita = intenzita;
        this.hodnota = hodnota;
    }

}
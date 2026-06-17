/**
 * Třída představuje jeden trénink.
 */
export class Trenink {

    public typ: string;
    public minuty: number;
    public intenzita: number;
    public hodnota: number;

    /**
     * Vytvoří nový trénink.
     */
    public constructor(
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
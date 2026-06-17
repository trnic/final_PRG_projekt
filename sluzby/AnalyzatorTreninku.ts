import { Trenink } from "../modely/Trenink.js";
import { VysledekTreninku } from "../modely/VysledekTreninku.js";

/**
 * Třída slouží k vyhodnocení tréninku.
 */
export class AnalyzatorTreninku {

    /**
     * Spočítá výsledné skóre.
     */
    private spocitejSkore(trenink: Trenink): number {

        const zaklad = trenink.minuty * 0.7 + trenink.intenzita * 6;

        const bonusy = {
            sprint: trenink.hodnota / 18,
            vytrvalost: trenink.hodnota / 4,
            strelba: trenink.hodnota / 3,
            technika: trenink.hodnota * 5
        };

        const skore = zaklad + bonusy[trenink.typ as keyof typeof bonusy];

        return Math.min(Math.round(skore), 100);
    }

    /**
     * Vrátí náročnost tréninku.
     */
    private ziskejUroven(skore: number): { uroven: string, tridaUrovne: string } {

        if (skore < 40) {
            return {
                uroven: "lehký",
                tridaUrovne: "lehky"
            };
        }

        if (skore < 75) {
            return {
                uroven: "střední",
                tridaUrovne: "stredni"
            };
        }

        return {
            uroven: "náročný",
            tridaUrovne: "narocny"
        };
    }

    /**
     * Vrátí doporučení podle náročnosti.
     */
    private ziskejDoporuceni(uroven: string): string {

        if (uroven === "lehký") {
            return "Dobrý lehčí trénink. Příště můžeš mírně zvednout intenzitu.";
        }

        if (uroven === "střední") {
            return "Vyrovnaný trénink. Tohle je dobrá úroveň pro pravidelné zlepšování.";
        }

        return "Náročný trénink. Dej pozor na regeneraci a další den zvol lehčí zátěž.";
    }

    /**
     * Vyhodnotí celý trénink.
     */
    public analyzujTrenink(trenink: Trenink): VysledekTreninku {

        const skore = this.spocitejSkore(trenink);

        const kalorie = Math.round(
            trenink.minuty * trenink.intenzita * 1.2
        );

        const informaceOUrovni = this.ziskejUroven(skore);

        const doporuceni = this.ziskejDoporuceni(
            informaceOUrovni.uroven
        );

        return new VysledekTreninku(
            trenink.typ,
            trenink.minuty,
            trenink.intenzita,
            trenink.hodnota,
            skore,
            kalorie,
            informaceOUrovni.uroven,
            informaceOUrovni.tridaUrovne,
            doporuceni
        );
    }

}
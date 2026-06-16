import { Trenink } from "../modely/Trenink.js";

/**
 * Třída slouží ke kontrole zadaného tréninku.
 */
export class ValidatorTreninku {

    /**
     * Zkontroluje, jestli jsou všechny hodnoty správné.
     */
    zkontrolujTrenink(trenink: Trenink): string | null {

        if (trenink.minuty <= 0) {
            return "Délka tréninku musí být větší než 0 minut.";
        }

        if (trenink.intenzita < 1 || trenink.intenzita > 10) {
            return "Intenzita musí být mezi 1 a 10.";
        }

        if (trenink.hodnota <= 0) {
            return "Doplň hodnotu podle zvoleného typu tréninku.";
        }

        if (trenink.typ === "technika" && trenink.hodnota > 10) {
            return "Technika se hodnotí od 1 do 10.";
        }

        return null;
    }

}
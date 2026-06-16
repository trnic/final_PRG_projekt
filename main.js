import { ValidatorTreninku } from "./sluzby/ValidatorTreninku.js";
import { AnalyzatorTreninku } from "./sluzby/AnalyzatorTreninku.js";
import { HistorieTreninku } from "./sluzby/HistorieTreninku.js";
import { Vykreslovac } from "./ui/Vykreslovac.js";
import { SpravceFormulare } from "./ui/SpravceFormulare.js";

/**
 * Vytvoří objekt pro kontrolu tréninku.
 */
const validator = new ValidatorTreninku();

/**
 * Vytvoří objekt pro analýzu tréninku.
 */
const analyzator = new AnalyzatorTreninku();

/**
 * Vytvoří objekt pro práci s historií.
 */
const historie = new HistorieTreninku();

/**
 * Vytvoří objekt pro zobrazování výsledků.
 */
const vykreslovac = new Vykreslovac();

/**
 * Vytvoří objekt, který se stará o formulář.
 */
const spravceFormulare = new SpravceFormulare(
    validator,
    analyzator,
    historie,
    vykreslovac
);

/**
 * Spustí aplikaci.
 */
spravceFormulare.spustAplikaci();
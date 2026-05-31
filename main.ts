import { rawTrainings, ITrainingData } from './data';


abstract class Training {
    protected _duration: number;
    protected _intensity: number;

    constructor(duration: number, intensity: number) {
        // Základní kontrola, aby neprošly nesmyslné hodnoty
        if (duration <= 0) throw new Error("Délka trvání musí být kladná.");
        if (intensity < 1 || intensity > 10) throw new Error("Intenzita musí být mezi 1 a 10.");
        
        this._duration = duration;
        this._intensity = intensity;
    }

    /** Každý typ tréninku si dopočítá kalorie a zátěž po svém */
    abstract calculateCalories(): number;
    abstract calculateLoad(): number;

    /** Společný textový výpis pro všechny typy tréninku */
    public getSummary(): string {
        return `Trénink: trvání ${this._duration} min, intenzita ${this._intensity}/10`;
    }
}


class SprintTraining extends Training {
    private distance: number;

    constructor(duration: number, intensity: number, distance: number) {
        super(duration, intensity);
        // Sprint potřebuje kladnou vzdálenost
        if (distance <= 0) throw new Error("Vzdálenost musí být kladná.");
        this.distance = distance;
    }

    calculateCalories(): number {
        // Jednoduchý odhad kalorií pro sprint
        return this._duration * this._intensity * 1.5;
    }

    calculateLoad(): number {
        return (this.distance / this._duration) * this._intensity;
    }
}


class EnduranceTraining extends Training {
    private averageHeartRate: number;

    constructor(duration: number, intensity: number, avgHeartRate: number) {
        super(duration, intensity);
        // U vytrvalosti hlídáme tepovou frekvenci
        if (avgHeartRate <= 0) throw new Error("Tepová frekvence musí být kladná.");
        this.averageHeartRate = avgHeartRate;
    }

    calculateCalories(): number {
        // Jednoduchý odhad kalorií pro vytrvalost
        return this._duration * (this.averageHeartRate / 10);
    }

    calculateLoad(): number {
        return this._duration * this._intensity;
    }
}


class ShootingTraining extends Training {
    private shots: number;
    private accuracy: number;

    constructor(duration: number, intensity: number, shots: number, accuracy: number) {
        super(duration, intensity);
        // Střelba používá počet pokusů a přesnost
        this.shots = shots;
        this.accuracy = accuracy;
    }

    calculateCalories(): number {
        // Střelba má menší energetickou náročnost
        return this._duration * 5;
    }

    calculateLoad(): number {
        return this.shots * this.accuracy;
    }
}

const trainingInstances: Training[] = rawTrainings.map(data => {
    switch (data.type) {
        case 'sprint':
            return new SprintTraining(data.duration, data.intensity, data.distance || 0);
        case 'endurance':
            return new EnduranceTraining(data.duration, data.intensity, data.averageHeartRate || 0);
        case 'shooting':
            return new ShootingTraining(data.duration, data.intensity, data.shots || 0, data.accuracy || 0);
        default:
            throw new Error("Neznámý typ tréninku");
    }
});


console.log("--- ANALÝZA FOTBALOVÝCH TRÉNINKŮ ---");
trainingInstances.forEach((training, index) => {
    console.log(`Záznam č. ${index + 1}:`);
    console.log(training.getSummary());
    console.log(`Vypočtené kalorie: ${training.calculateCalories().toFixed(0)} kcal`);
    console.log(`Vypočtené zatížení: ${training.calculateLoad().toFixed(1)} j.`);
    console.log("------------------------------------");
});
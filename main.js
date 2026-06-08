import { rawTrainings } from './data.js';
class Training {
    _duration;
    _intensity;
    constructor(duration, intensity) {
        // Validace dat v konstruktoru
        if (duration <= 0)
            throw new Error("Délka trvání musí být kladná.");
        if (intensity < 1 || intensity > 10)
            throw new Error("Intenzita musí být mezi 1 a 10.");
        this._duration = duration;
        this._intensity = intensity;
    }
    /** Společná metoda pro výpis informací */
    getSummary() {
        return `Trénink: trvání ${this._duration} min, intenzita ${this._intensity}/10`;
    }
}
class SprintTraining extends Training {
    distance;
    constructor(duration, intensity, distance) {
        super(duration, intensity);
        if (distance <= 0)
            throw new Error("Vzdálenost musí být kladná.");
        this.distance = distance;
    }
    calculateCalories() {
        // Primitivní výpočet pro sprint
        return this._duration * this._intensity * 1.5;
    }
    calculateLoad() {
        return (this.distance / this._duration) * this._intensity;
    }
}
class EnduranceTraining extends Training {
    averageHeartRate;
    constructor(duration, intensity, avgHeartRate) {
        super(duration, intensity);
        if (avgHeartRate <= 0)
            throw new Error("Tepová frekvence musí být kladná.");
        this.averageHeartRate = avgHeartRate;
    }
    calculateCalories() {
        // Primitivní výpočet pro vytrvalost
        return this._duration * (this.averageHeartRate / 10);
    }
    calculateLoad() {
        return this._duration * this._intensity;
    }
}
class ShootingTraining extends Training {
    shots;
    accuracy;
    constructor(duration, intensity, shots, accuracy) {
        super(duration, intensity);
        this.shots = shots;
        this.accuracy = accuracy;
    }
    calculateCalories() {
        return this._duration * 5; // Střelba pálí méně kalorií
    }
    calculateLoad() {
        return this.shots * this.accuracy;
    }
}
class SkillsTraining extends Training {
    technique;
    ballControl;
    constructor(duration, intensity, technique, ballControl) {
        super(duration, intensity);
        if (technique < 0 || technique > 10)
            throw new Error("Technika musí být mezi 0 a 10.");
        if (ballControl < 0 || ballControl > 10)
            throw new Error("Kontrola míče musí být mezi 0 a 10.");
        this.technique = technique;
        this.ballControl = ballControl;
    }
    calculateCalories() {
        return this._duration * (this._intensity + this.technique + this.ballControl) * 0.6;
    }
    calculateLoad() {
        return (this.technique + this.ballControl) * this._intensity;
    }
}
const trainingInstances = rawTrainings.map(data => {
    switch (data.type) {
        case 'sprint':
            return new SprintTraining(data.duration, data.intensity, data.distance || 0);
        case 'endurance':
            return new EnduranceTraining(data.duration, data.intensity, data.averageHeartRate || 0);
        case 'shooting':
            return new ShootingTraining(data.duration, data.intensity, data.shots || 0, data.accuracy || 0);
        case 'skills':
            return new SkillsTraining(data.duration, data.intensity, data.technique || 0, data.ballControl || 0);
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

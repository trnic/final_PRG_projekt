export type TrainingType = "sprint" | "vytrvalost" | "strelba" | "technika";

export type TrainingExample = {
    type: TrainingType;
    minutes: number;
    intensity: number;
    value: number;
};

export const trainingTypes: Record<TrainingType, { title: string; valueLabel: string; unit: string }> = {
    sprint: {
        title: "Sprint",
        valueLabel: "Vzdálenost",
        unit: "m",
    },
    vytrvalost: {
        title: "Vytrvalost",
        valueLabel: "Průměrný tep",
        unit: "bpm",
    },
    strelba: {
        title: "Střelba",
        valueLabel: "Počet střel",
        unit: "střel",
    },
    technika: {
        title: "Technika",
        valueLabel: "Hodnocení techniky",
        unit: "/10",
    },
};

export const exampleTrainings: TrainingExample[] = [
    { type: "sprint", minutes: 30, intensity: 9, value: 420 },
    { type: "vytrvalost", minutes: 55, intensity: 6, value: 148 },
    { type: "strelba", minutes: 40, intensity: 7, value: 65 },
    { type: "technika", minutes: 25, intensity: 5, value: 8 },
];

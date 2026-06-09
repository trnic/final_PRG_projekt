type TrainingType = "sprint" | "vytrvalost" | "strelba" | "technika";

type TrainingExample = {
    type: TrainingType;
    minutes: number;
    intensity: number;
    value: number;
};

const trainingTypes: Record<TrainingType, { title: string; valueLabel: string; unit: string }> = {
    sprint: {
        title: "Sprint",
        valueLabel: "Vzdalenost",
        unit: "m",
    },
    vytrvalost: {
        title: "Vytrvalost",
        valueLabel: "Prumerny tep",
        unit: "bpm",
    },
    strelba: {
        title: "Strelba",
        valueLabel: "Pocet strel",
        unit: "strel",
    },
    technika: {
        title: "Technika",
        valueLabel: "Hodnoceni techniky",
        unit: "/10",
    },
};

const exampleTrainings: TrainingExample[] = [
    { type: "sprint", minutes: 30, intensity: 9, value: 420 },
    { type: "vytrvalost", minutes: 55, intensity: 6, value: 148 },
    { type: "strelba", minutes: 40, intensity: 7, value: 65 },
    { type: "technika", minutes: 25, intensity: 5, value: 8 },
];

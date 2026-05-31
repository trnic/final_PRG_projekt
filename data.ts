
export interface ITrainingData {
    type: 'sprint' | 'endurance' | 'shooting';
    duration: number;
    intensity: number;
    // Parametry podle typu tréninku
    distance?: number;
    averageHeartRate?: number;
    shots?: number;
    accuracy?: number;
}


export const rawTrainings: ITrainingData[] = [
    // Ukázková data pro sprint
    { type: 'sprint', duration: 30, intensity: 9, distance: 400 },
    // Ukázková data pro vytrvalost
    { type: 'endurance', duration: 60, intensity: 6, averageHeartRate: 145 },
    // Ukázková data pro střelbu
    { type: 'shooting', duration: 45, intensity: 5, shots: 50, accuracy: 0.8 },
    // Další sprint pro porovnání výstupu
    { type: 'sprint', duration: 20, intensity: 10, distance: 200 }
];
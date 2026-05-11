
export interface ITrainingData {
    type: 'sprint' | 'endurance' | 'shooting';
    duration: number;
    intensity: number;
    // Specifické parametry
    distance?: number;
    averageHeartRate?: number;
    shots?: number;
    accuracy?: number;
}


export const rawTrainings: ITrainingData[] = [
    { type: 'sprint', duration: 30, intensity: 9, distance: 400 },
    { type: 'endurance', duration: 60, intensity: 6, averageHeartRate: 145 },
    { type: 'shooting', duration: 45, intensity: 5, shots: 50, accuracy: 0.8 },
    { type: 'sprint', duration: 20, intensity: 10, distance: 200 }
];
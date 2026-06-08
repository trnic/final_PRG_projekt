
export type TrainingType = 'sprint' | 'endurance' | 'shooting' | 'skills';

interface BaseTrainingData {
    type: TrainingType;
    duration: number;
    intensity: number;
}

export interface SprintTrainingData extends BaseTrainingData {
    type: 'sprint';
    distance: number;
}

export interface EnduranceTrainingData extends BaseTrainingData {
    type: 'endurance';
    averageHeartRate: number;
}

export interface ShootingTrainingData extends BaseTrainingData {
    type: 'shooting';
    shots: number;
    accuracy: number;
}

export interface SkillsTrainingData extends BaseTrainingData {
    type: 'skills';
    technique: number;
    ballControl: number;
}

export type ITrainingData =
    | SprintTrainingData
    | EnduranceTrainingData
    | ShootingTrainingData
    | SkillsTrainingData;


export const rawTrainings: ITrainingData[] = [
    // Ukázková data pro sprint
    { type: 'sprint', duration: 30, intensity: 9, distance: 400 },
    // Ukázková data pro vytrvalost
    { type: 'endurance', duration: 60, intensity: 6, averageHeartRate: 145 },
    // Ukázková data pro střelbu
    { type: 'shooting', duration: 45, intensity: 5, shots: 50, accuracy: 0.8 },
    // Ukázková data pro skills
    { type: 'skills', duration: 20, intensity: 10, technique: 7, ballControl: 8 }
];
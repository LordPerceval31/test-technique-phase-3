import { LabData, LabOutput, Priority, Sample,} from "./types";



const Priority_score: Record<Priority, number> = {
    'STAT': 1,
    'URGENT': 2,
    'ROUTINE': 3
};

// Fonction pour définir les priorités des échantillons et leurs heures de traintement
export const sortSamples = (samples: Sample[]): Sample[] => {
    
    return [...samples].sort((a, b)=> {
        const priorityDiff = Priority_score[a.priority] - Priority_score[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return a.arrivalTime.localeCompare(b.arrivalTime)
    })
}


export const planifyLab = (data: LabData): LabOutput => {
    
    const sortedSamples = sortSamples(data.samples)

    return {
        schedule: [],
        metrics: {
            totalTime: 0,
            efficiency: 0,
            conflicts: 0
        }
    };
}

// 1. Les Unions Types
export type SampleType = 'BLOOD' | 'URINE' | 'TISSUE';
export type Priority = 'STAT' | 'URGENT' | 'ROUTINE';

// Le technicien peut tout faire (GENERAL) ou être spécialisé
export type TechSpeciality = SampleType | 'GENERAL';

// 2. Les Interfaces (Structure des données brutes du JSON)
export interface Sample {
    id: string;
    type: SampleType;
    priority: Priority;
    analysisTime: number; // Durée en minutes
    arrivalTime: string;  // Format "HH:MM"
    patientId: string;
}

export interface Technician {
    id: string;
    name: string;
    speciality: TechSpeciality;
    startTime: string; // Format "HH:MM"
    endTime: string;   // Format "HH:MM"
}

export interface Equipment {
    id: string;
    name?: string;
    type: SampleType;
    available: boolean;
}

// 3. Structure globale du fichier JSON d'entrée
export interface LabData {
    samples: Sample[];
    technicians: Technician[];
    equipment: Equipment[];
}
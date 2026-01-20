// 1. Les Unions Types
export type SampleType = 'BLOOD' | 'URINE' | 'TISSUE';
export type Priority = 'STAT' | 'URGENT' | 'ROUTINE';

// Le technicien est spécialisé
export type TechSpecialty = 'BLOOD' | 'CHEMISTRY' | 'MICROBIOLOGY' | 'IMMUNOLOGY' | 'GENETICS';

// 2. Les Interfaces (Structure des données brutes du JSON)

export interface PatientInfo {
    age: number;
    service: string;
    diagnosis: string;
}

export interface Sample {
    id: string;
    type: SampleType;
    priority: Priority;
    analysisType: string;
    analysisTime: number; // Durée en minutes
    arrivalTime: string;  // Format "HH:MM"
    patientInfo: PatientInfo;
}

export interface Technician {
    id: string;
    name: string;
    specialty: TechSpecialty[];
    efficiency: number;
    startTime: string; // Format "HH:MM"
    endTime: string;   // Format "HH:MM"
    lunchBreak: string; // Format "HH:MM-HH:MM"
}

export interface Equipment {
    id: string;
    name: string;
    type: TechSpecialty;
    compatibleTypes: string[];
    capacity: number;
    maintenanceWindow: string; // Format "HH:MM-HH:MM"
    cleaningTime: number;
}

// 3. Structure globale du fichier JSON d'entrée
export interface LabData {
    samples: Sample[];
    technicians: Technician[];
    equipment: Equipment[];
}

// --- RESULTATS (OUTPUT) ---

export interface ScheduleEntry {
    sampleId: string;
    priority: string;
    technicianId: string;
    equipmentId: string;
    startTime: string; // "HH:MM"
    endTime: string;   // "HH:MM"
    duration: number;
    analysisType: string;
    efficiency: number;
}

export interface LabMetrics {
    totalTime: number;
    efficiency: number;
    conflicts: number;
}

export interface LabOutput {
    schedule: ScheduleEntry[];
    metrics: LabMetrics;
}
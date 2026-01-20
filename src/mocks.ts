import { LabData } from './types';

// ---------------------------------------------------------
// CAS 1 : SIMPLE (1 Sample, 1 Tech, 1 Equipement)
// Objectif : Valider que le code tourne et calcule les heures.
// ---------------------------------------------------------
export const TEST_CASE_1: LabData = {
    samples: [
        {
            id: "S001",
            type: "BLOOD",
            priority: "URGENT",
            analysisTime: 30,
            arrivalTime: "09:00",
            patientId: "P001"
        }
    ],
    technicians: [
        {
            id: "T001",
            name: "Alice Martin",
            speciality: "BLOOD",
            startTime: "08:00",
            endTime: "17:00"
        }
    ],
    equipment: [
        {
            id: "E001",
            name: "Analyseur Sang A",
            type: "BLOOD",
            available: true
        }
    ]
};

// ---------------------------------------------------------
// CAS 2 : PRIORITÉS (STAT vs URGENT)
// Objectif : Valider que STAT passe devant même s'il arrive après.
// ---------------------------------------------------------
export const TEST_CASE_2: LabData = {
    samples: [
        {
            id: "S001",
            type: "BLOOD",
            priority: "URGENT",
            analysisTime: 45,
            arrivalTime: "09:00",
            patientId: "P001"
        },
        {
            id: "S002",
            type: "BLOOD",
            priority: "STAT",
            analysisTime: 30,
            arrivalTime: "09:30",
            patientId: "P002"
        }
    ],
    technicians: [
        {
            id: "T001",
            name: "Alice Martin",
            speciality: "BLOOD",
            startTime: "08:00",
            endTime: "17:00"
        }
    ],
    equipment: [
        {
            id: "E001",
            name: "Analyseur Sang A",
            type: "BLOOD",
            available: true
        }
    ]
};

// ---------------------------------------------------------
// CAS 3 : RESSOURCES & CONFLITS
// Objectif : Gérer les techniciens occupés et le type GENERAL.
// ---------------------------------------------------------
export const TEST_CASE_3: LabData = {
    samples: [
        {
            id: "S001",
            type: "BLOOD",
            priority: "URGENT",
            analysisTime: 60,
            arrivalTime: "09:00",
            patientId: "P001"
        },
        {
            id: "S002",
            type: "URINE",
            priority: "URGENT",
            analysisTime: 30,
            arrivalTime: "09:15",
            patientId: "P002"
        },
        {
            id: "S003",
            type: "BLOOD",
            priority: "ROUTINE",
            analysisTime: 45,
            arrivalTime: "09:00",
            patientId: "P003"
        }
    ],
    technicians: [
        {
            id: "T001",
            name: "Alice Blood",
            speciality: "BLOOD",
            startTime: "08:00",
            endTime: "17:00"
        },
        {
            id: "T002",
            name: "Bob General",
            speciality: "GENERAL",
            startTime: "08:00",
            endTime: "17:00"
        }
    ],
    equipment: [
        {
            id: "E001",
            name: "Analyz-O-Matic 3000",
            type: "BLOOD",
            available: true
        },
        {
            id: "E002",
            name: "Pee-O-Tron",
            type: "URINE",
            available: true
        }
    ]
};
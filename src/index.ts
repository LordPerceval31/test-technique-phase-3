import { minutesToTime, timeToMinutes } from "./dateUtils";
import { LabData, LabOutput, ScheduleEntry, Technician, TechSpecialty } from "./types";

// 1. définir les analyseType des samples avec la spécialité des techniciens
const ANALYSIS_REQUIREMENTS: Record<string, TechSpecialty> = {
    "Numération complète": "BLOOD",
    "Bilan hépatique": "CHEMISTRY",
    "Bilan lipidique": "CHEMISTRY",
    "Hémogramme standard": "BLOOD",
    "Coagulation": "BLOOD",
    "Vaccination contrôle": "IMMUNOLOGY",
    "Conseil génétique": "GENETICS",
    "Troponine": "CHEMISTRY",
    "ECBU": "MICROBIOLOGY",
    "Prélèvement gorge": "MICROBIOLOGY",
    "Caryotype urgent": "GENETICS",
    "Hémoculture urgente": "MICROBIOLOGY",
    "HbA1c": "CHEMISTRY",
    "Sérologie HIV": "IMMUNOLOGY",
    "Vitesse sédimentation": "BLOOD",
    "Frottis sanguin": "BLOOD",
    "Allergènes critiques": "IMMUNOLOGY",
    "Électrolytes": "CHEMISTRY",
    "Pharmacogénétique": "GENETICS",
    "Parasitologie": "MICROBIOLOGY"
};

// définir la priorité des échantillons
const PRIORITY_SCORE: Record<string, number> = {
    'STAT': 1,
    'URGENT': 2,
    'ROUTINE': 3
};

// Fonction de tri des échantillons
export const sortSamples = (samples: any[]) => {
    return [...samples].sort((a, b) => {
        const priorityDiff = PRIORITY_SCORE[a.priority] - PRIORITY_SCORE[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return a.arrivalTime.localeCompare(b.arrivalTime);
    });
};

export const planifyLab = (data: LabData): LabOutput => {
    const { samples, technicians, equipment } = data;
    const sortedSamples = sortSamples(samples);
    const schedule: ScheduleEntry[] = [];
    const agenda: Record<string, number> = {};

    // Boucle sur chaque type d'échantillons
    sortedSamples.forEach(sample => {

        // Récupérer la spécialité requise
        const requiredSpecialty = ANALYSIS_REQUIREMENTS[sample.analysisType];

        // Filtrer les techniciens compatibles
        const compatibleTechnicians = technicians.filter(tech => 
            tech.specialty.includes(requiredSpecialty)
        );

        // Trouver l'équipement compatible
        const availableEquipment = equipment.find(equip =>
            equip.type === requiredSpecialty
        );

        // Conversion de l'heure d'arrivé d'un échantillons en minutes
        const sampleArrivedTime = timeToMinutes(sample.arrivalTime);

        // Si ressources disponibles, on cherche le meilleur créneau
        if (compatibleTechnicians.length > 0 && availableEquipment) {
         
            let bestTech: Technician | null = null;
            let bestStartTime = Infinity;
            let bestEndTime = Infinity;
            let finalDuration = 0;

            // Choix entre les techniciens compatibles
            compatibleTechnicians.forEach(tech => {

                // La durée réelle que mettra un technicien pour analyser un échantillon
                const realDuration = Math.round(sample.analysisTime / tech.efficiency);
                
                // On récupère la disponibilité (s'il n'est pas dans l'agenda, prenons l'heure d'embauche)
                const techAvailableAt = agenda[tech.id] || timeToMinutes(tech.startTime);

                // On récupère la disponibilité (s'il n'est pas dans l'agenda, on considère 00:00 car l'équipement n'est pas encore utilisé)
                const equipAvailableAt = agenda[availableEquipment.id] || 0;
                
                // Le début réel d'une analyse (l'heure d'arrivé de l'échantillon, la disponibilité d'un technicien et la disponibilité d'un équipement)
                // Math.max parce que c'est le plus grand nombre des trois valeurs qui déterminera quand ça commence
                const possibleStart = Math.max(sampleArrivedTime, techAvailableAt, equipAvailableAt);

                // La fin réel d'une analyse (le début réel + la durée réelle)
                const possibleEnd = possibleStart + realDuration;

                // On cherche celui qui finit le plus tôt
                if (possibleEnd < bestEndTime) {
                    // Le technicien choisi
                    bestTech = tech;
                    // A quelle heure il peut commencer l'analyse
                    bestStartTime = possibleStart;
                    // A quelle heure il aura fini l'analyse
                    bestEndTime = possibleEnd;
                    // combien de temps dure l'analyse
                    finalDuration = realDuration;
                }
            });

            // 5. Enregistrement du technicien sélectionné
            if (bestTech) {

                const selectedTechnician = bestTech as Technician;

                // A chaque boucle, on met la dernière heure effective d'un technicien dans l'agenda
                agenda[selectedTechnician.id] = bestEndTime;
                // A chaque boucle, on mets la fin de "service" d'un équipement en rajoutant le temps de nettoyage
                agenda[availableEquipment.id] = bestEndTime + availableEquipment.cleaningTime;

                // Ajout au planning
                schedule.push({
                    sampleId: sample.id,
                    priority: sample.priority,
                    technicianId: selectedTechnician.id,
                    equipmentId: availableEquipment.id,
                    startTime: minutesToTime(bestStartTime),
                    endTime: minutesToTime(bestEndTime),
                    duration: finalDuration,
                    analysisType: sample.analysisType,
                    efficiency: selectedTechnician.efficiency
                });
            }
        }
    });

    return {
        schedule: schedule,
        metrics: { totalTime: 0, efficiency: 0, conflicts: 0 }
    };
};
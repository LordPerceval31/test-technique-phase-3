import { LabData, LabOutput, Priority, ScheduleEntry } from "./types";
import { minutesToTime, timeToMinutes } from "./dateUtils";



const Priority_score: Record<Priority, number> = {
    'STAT': 1,
    'URGENT': 2,
    'ROUTINE': 3
};

export const planifyLab = (data: LabData): LabOutput => {
    const { samples, technicians, equipment } = data;

    samples.sort((a, b) => {
        return Priority_score[a.priority] - Priority_score[b.priority];
    });

    const schedule: ScheduleEntry[] = [];
    const agenda: Record<string, number> = {};

    samples.forEach((sample => {

        // Trouver un technicien
        const compatileTechnicians = technicians.find(tech =>
            tech.speciality === sample.type || tech.speciality === 'GENERAL'
        );

        // Trouver un équipement
        const availableEquipment = equipment.find(equip =>
            equip.type === sample.type && equip.available
        );

        // Si on a les deux, on planifie
        if (compatileTechnicians && availableEquipment) {

            // Calcul des temps (conversion d'heure d'arrivée en minutes)
            const startMinutes = timeToMinutes(sample.arrivalTime);

            // Vérifier la disponibilité
            const endTaskTechnician = agenda[compatileTechnicians.id] || timeToMinutes(compatileTechnicians.startTime);
            const endTaskEquipment = agenda[availableEquipment.id] || 0;

            // Le vrai début d'une tache est le max entre l'arrivée, la dispo du technicien et la dispo de l'équipement
            const actualStart = Math.max(startMinutes, endTaskTechnician, endTaskEquipment);
            const actualEnd = actualStart + sample.analysisTime;

            // On note la nouvelle heure de fin dans l'agenda
            agenda[compatileTechnicians.id] = actualEnd;
            agenda[availableEquipment.id] = actualEnd;

            // Ajouter une entrée au planning
            schedule.push({
                sampleId: sample.id,
                technicianId: compatileTechnicians.id,
                equipmentId: availableEquipment.id,
                startTime: minutesToTime(actualStart),
                endTime: minutesToTime(actualEnd),
                priority: sample.priority
            });
        }
    }));
    return {
        schedule: schedule,
        metrics: { totalTime: 0, efficiency: 0, conflicts: 0 }
    };
}



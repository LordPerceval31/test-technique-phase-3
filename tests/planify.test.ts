import { planifyLab, sortSamples } from "../src/index";
import { Sample, Priority, LabData } from "../src/types";

// Factory de création d'échantillons pour les tests unitaires de tri
const createMockSample = (id: string, priority: Priority, arrivalTime: string): Sample => ({
    id,
    priority,
    arrivalTime,
    type: 'BLOOD',
    analysisType: 'Numération complète',
    analysisTime: 30,
    patientInfo: { age: 0, service: '', diagnosis: '' }
});

describe('Phase 1 : Algorithme de tri prioritaire', () => {
    test('Doit respecter la hiérarchie STAT > URGENT > ROUTINE puis l\'ordre chronologique', () => {
        const input: Sample[] = [
            createMockSample("S1", "ROUTINE", "10:00"),
            createMockSample("S2", "URGENT", "09:00"),
            createMockSample("S3", "STAT", "12:00"),
            createMockSample("S4", "STAT", "08:00"), 
        ];

        const result = sortSamples(input);

        // Validation de la priorité absolue
        expect(result[0].priority).toBe('STAT');
        // Validation du tri chronologique secondaire (08:00 avant 12:00)
        expect(result[0].id).toBe('S4');
        
        // Validation de l'ordre séquentiel complet
        const expectedIds = ["S4", "S3", "S2", "S1"];
        const actualIds = result.map(s => s.id);
        expect(actualIds).toEqual(expectedIds);
    });
});

describe('Phase 2 : Moteur de planification et gestion des contraintes', () => {

    // Configuration de l'environnement de test (Mocking)
    const createMockData = (
        sampleParams: { arrival: string, duration: number, type?: string },
        techParams: { efficiency: number, lunch: string },
        equipParams: { cleaning: number, maintenance: string }
    ): LabData => ({
        samples: [{
            id: "S1", priority: "ROUTINE", type: "BLOOD", 
            analysisType: "Numération complète",
            analysisTime: sampleParams.duration, arrivalTime: sampleParams.arrival,
            patientInfo: { age: 0, service: '', diagnosis: '' }
        }],
        technicians: [{
            id: "T1", name: "Tech", specialty: ["BLOOD"],
            efficiency: techParams.efficiency, 
            startTime: "08:00",
            endTime: "18:00",
            lunchBreak: techParams.lunch
        }],
        equipment: [{
            id: "E1", name: "Equip", type: "BLOOD", compatibleTypes: ["Numération complète"],
            capacity: 1, maintenanceWindow: equipParams.maintenance,
            cleaningTime: equipParams.cleaning
        }]
    });

    test('Coefficient d\'efficacité : Application du facteur de réduction (1.2)', () => {
        // Durée nominale 60min / Coeff 1.2 = 50min attendus
        const data = createMockData(
            { arrival: "09:00", duration: 60 },
            { efficiency: 1.2, lunch: "" },
            { cleaning: 0, maintenance: "" }
        );
        const result = planifyLab(data);
        expect(result.schedule[0].duration).toBe(50);
    });

    test('Coefficient d\'efficacité : Application du facteur de majoration (0.8)', () => {
        // Durée nominale 40min / Coeff 0.8 = 50min attendus
        const data = createMockData(
            { arrival: "09:00", duration: 40 },
            { efficiency: 0.8, lunch: "" },
            { cleaning: 0, maintenance: "" }
        );
        const result = planifyLab(data);
        expect(result.schedule[0].duration).toBe(50);
    });

    test('Contrainte RH : Report d\'analyse en cas de conflit avec la pause déjeuner', () => {
        // Conflit détecté : Arrivée 11:50 + Durée 30min chevauche Pause 12:00-13:00
        const data = createMockData(
            { arrival: "11:50", duration: 30 },
            { efficiency: 1.0, lunch: "12:00-13:00" },
            { cleaning: 0, maintenance: "" }
        );
        const result = planifyLab(data);
        // Résultat attendu : Début reprogrammé à la fin de la pause
        expect(result.schedule[0].startTime).toBe("13:00");
    });

    test('Contrainte Matérielle : Indisponibilité durant la fenêtre de maintenance', () => {
        // Scénario : Maintenance critique de 08:00 à 09:00 bloquant le démarrage
        const data = createMockData(
            { arrival: "08:00", duration: 30 },
            { efficiency: 1.0, lunch: "" },
            { cleaning: 0, maintenance: "08:00-09:00" }
        );

        const result = planifyLab(data);
        // Résultat attendu : Démarrage reporté à la réouverture de l'équipement
        expect(result.schedule[0].startTime).toBe("09:00");
    });

    test('Contrainte Sanitaire : Application du délai de décontamination', () => {
        const data = createMockData(
            { arrival: "09:00", duration: 30 },
            { efficiency: 1.0, lunch: "" },
            { cleaning: 10, maintenance: "" } // Temps de nettoyage imposé
        );
        // Injection d'un second échantillon séquentiel
        data.samples.push({ ...data.samples[0], id: "S2" });

        const result = planifyLab(data);
        
        // Calcul : Fin S1 (09:30) + Nettoyage (10min) = Dispo S2 (09:40)
        const s2 = result.schedule.find(s => s.sampleId === "S2");
        expect(s2?.startTime).toBe("09:40");
    });
});
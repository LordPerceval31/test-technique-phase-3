import { sortSamples } from "../src/index";
import { Sample, Priority } from "../src/types";

// Helper
const createMockSample = (id: string, priority: Priority, arrivalTime: string): Sample => ({
    id,
    priority,
    arrivalTime,
    type: 'BLOOD',
    analysisType: 'Test',
    analysisTime: 30,
    patientInfo: { age: 0, service: '', diagnosis: '' }
});


describe('Phase 1: Tri des échantillons', () => {

    test('Doit trier correctement STAT > URGENT > ROUTINE', () => {
        // 1. Préparation (Arrange)
        const input: Sample[] = [
            createMockSample("S1", "ROUTINE", "10:00"),
            createMockSample("S2", "URGENT", "09:00"),
            createMockSample("S3", "STAT", "12:00"),
            createMockSample("S4", "STAT", "08:00"), 
        ];

        // 2. Action (Act)
        const result = sortSamples(input);

        // 3. Vérification (Assert)
        
        // Vérif 1: Le premier doit être STAT
        expect(result[0].priority).toBe('STAT');
        
        // Vérif 2: Le premier doit être S4 (08h00) pas S3 (12h00)
        expect(result[0].id).toBe('S4');

        // Vérif 3: L'ordre exact des IDs
        const expectedIds = ["S4", "S3", "S2", "S1"];
        const actualIds = result.map(s => s.id);
        
        expect(actualIds).toEqual(expectedIds);
    });

});
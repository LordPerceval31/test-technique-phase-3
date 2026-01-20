import { planifyLab } from '../src/index';
import { TEST_CASE_2, TEST_CASE_3 } from '../src/mocks';

describe('Algorithme de Planification', () => {
    
    test('DOIT trier les priorités : STAT passe avant URGENT', () => {
        // On vérifie l'état avant (Juste pour être sûr)
        // Dans le mock, S001 (URGENT) est à l'index 0
        expect(TEST_CASE_2.samples[0].priority).toBe('URGENT');

        // On lance la fonction
        planifyLab(TEST_CASE_2);

        // On vérifie le résultat
        // Maintenant, S002 (STAT) doit être passé à l'index 0
        expect(TEST_CASE_2.samples[0].priority).toBe('STAT');
        expect(TEST_CASE_2.samples[0].id).toBe('S002');
        
        // Et S001 doit être descendu à l'index 1
        expect(TEST_CASE_2.samples[1].id).toBe('S001');
    });

    test('DOIT gérer le temps : S003 doit attendre que Alice (T001) finisse S001', () => {
        // On lance la planification
        const result = planifyLab(TEST_CASE_3);

        // On cherche la ligne du planning pour S003
        const s003Entry = result.schedule.find(entry => entry.sampleId === 'S003');

        // Alice commence S001 à 09:00 pour 60min -> Elle finit à 10:00.
        // S003 arrive à 09:00, mais il DOIT attendre 10:00.
        expect(s003Entry?.startTime).toBe('10:00');
    });

});
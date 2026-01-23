import request from 'supertest';
import { AppDataSource } from '../data-source';
import app from '../../server';

describe('Analytics E2E Tests', () => {
    // Avant les tests, on s'assure que la BDD est connectée
    beforeAll(async () => {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
    });

    // Après les tests, on ferme la connexion pour ne pas bloquer Jest
    afterAll(async () => {
        await AppDataSource.destroy();
    });

    describe('GET /api/analytics/department-costs', () => {
    
    it('should return 200 and valid department aggregation', async () => {
        const response = await request(app).get('/api/analytics/department-costs');

        expect(response.status).toBe(200);
        
        // Vérification de la structure globale
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('summary');

        // Vérification d'un élément data (ex: Engineering)
        if (response.body.data.length > 0) {
            const dept = response.body.data[0];
            expect(dept).toHaveProperty('department');
            expect(dept).toHaveProperty('total_cost');
            expect(dept).toHaveProperty('cost_percentage');
            expect(typeof dept.total_cost).toBe('number');
        }

        // Vérification du résumé (Summary)
        expect(response.body.summary).toMatchObject({
            total_company_cost: expect.any(Number),
            departments_count: expect.any(Number),
            most_expensive_department: expect.any(String)
        });
    });

    it('should have percentages that sum approximately to 100%', async () => {
        const response = await request(app).get('/api/analytics/department-costs');
        
        const data = response.body.data;
        if (data.length > 0) {
            const totalPercentage = data.reduce((acc: number, dept: any) => acc + dept.cost_percentage, 0);
            
            // Tolérance de 0.1% comme demandé dans tes précisions
            expect(totalPercentage).toBeGreaterThanOrEqual(99.9);
            expect(totalPercentage).toBeLessThanOrEqual(100.1);
        }
    });
});

    describe('GET /api/analytics/expensive-tools', () => {
        it('should return 200 and the correct data structure', async () => {
            const response = await request(app)
                .get('/api/analytics/expensive-tools')
                .query({ limit: 5, min_cost: 0 });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body).toHaveProperty('analysis');
            expect(Array.isArray(response.body.data)).toBe(true);
            
            // On vérifie que la limite est respectée
            expect(response.body.data.length).toBeLessThanOrEqual(5);
        });

        it('should filter by min_cost correctly', async () => {
            const response = await request(app)
                .get('/api/analytics/expensive-tools')
                .query({ min_cost: 10000 }); // Un prix trop haut pour tout le monde

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(0); // On doit avoir une liste vide
        });
    });
});
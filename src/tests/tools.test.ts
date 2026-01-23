import request from 'supertest';
import { AppDataSource } from '../data-source';
import app from '../../server';

/**
 * Suite de tests d'intégration pour l'API Tools.
 * Vérifie le cycle complet requête/réponse et l'interaction BDD.
 */
describe('API Tools Integration Tests', () => {

    // Initialisation de la connexion BDD avant l'exécution des tests
    beforeAll(async () => {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
    });

    /**
     * Test de disponibilité (Health Check)
     */
    // Vérification de la disponibilité de l'API sur la route racine
    it('GET / - Should return 200 OK with welcome message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('API Internal Tools');
    });

    /**
     * Scénario de création nominal (POST)
     */
    // Validation de la création d'un outil et de sa persistance en BDD
    it('POST /api/tools - Should successfully create a new tool resource', async () => {
        const payload = {
            name: `Integration Test Tool ${Date.now()}`,
            description: "Automated test description",
            vendor: "Test Vendor Inc.",
            website_url: "https://test-vendor.com",
            category_id: 1,
            monthly_cost: 10.50,
            owner_department: "Engineering"
        };

        const res = await request(app)
            .post('/api/tools')
            .send(payload);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toEqual(payload.name);
    });

    /**
     * Scénario de récupération de liste (GET)
     */
    // Vérification du format de réponse (Tableau de données + Pagination)
    it('GET /api/tools - Should return paginated list and metadata', async () => {
        const res = await request(app).get('/api/tools');
        
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body).toHaveProperty('total');
    });

    // Fermeture propre de la connexion après les tests
    afterAll(async () => {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    });
});
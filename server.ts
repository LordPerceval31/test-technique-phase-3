import "reflect-metadata";
import dotenv from 'dotenv';
import express from 'express';
import { AppDataSource } from "./src/data-source";
import { ToolController } from "./src/controllers/toolController";
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './src/swagger';
import { AnalyticController } from "./src/controllers/analyticController";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware pour transformer le json du client en javascript
app.use(express.json());

const toolController = new ToolController();
const analyticController = new AnalyticController();

// Route de test
app.get('/', (req, res) => {
    res.send('👋 API Internal Tools (Architecture Pro)');
});

// Route pour récupérer tous les outils
app.get('/api/tools', toolController.getAll)
// Route pour récupérer un outil en particulier
app.get('/api/tools/:id', toolController.getOne)
// Route pour afficher les coûts des départements
app.get('/api/analytics/department-costs', analyticController.getDepartmentCosts);

// Route pour identifie les outils les plus chers par utilisateur et calculer les économies potentielles
app.get('/api/analytics/expensive-tools', analyticController.getExpensiveTools)

// Route pour créer un nouvel outil
app.post('/api/tools', toolController.create)

// Route pour supprimer un outil
app.delete('/api/tools/:id', toolController.delete)

// Route pour mettre à jour un outil
app.put('/api/tools/:id', toolController.update)

// Route de la documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


console.log("Tentative de connexion à la Base de Données...");

AppDataSource.initialize()
    .then(() => {
        console.log("📦 Data Source connectée !");
        if (process.env.NODE_ENV !== 'test') {
            app.listen(port, () => {
                console.log(`🚀 SERVEUR PRÊT : http://localhost:${port}`);
            });
        }
    })
    .catch((err) => {
        console.error("❌ CRASH BDD", err);
    });

export default app;
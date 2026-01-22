import "reflect-metadata";
import dotenv from 'dotenv';
import express from 'express';
import { AppDataSource } from "./src/data-source";
import { ToolController } from "./src/controllers/toolController";

dotenv.config();

const app = express();
const port = 3000;

// Middleware pour transformer le json du client en javascript
app.use(express.json());

const toolController = new ToolController();

// Route de test
app.get('/', (req, res) => {
    res.send('👋 API Internal Tools (Architecture Pro)');
});

// Route pour récupérer tous les outils
app.get('/api/tools', toolController.getAll)

// Route pour créer un nouvel outil
app.post('/api/tools', toolController.create)


console.log("Tentative de connexion à la Base de Données...");

AppDataSource.initialize()
    .then(() => {
        console.log("📦 Data Source connectée !");
        app.listen(port, () => {
            console.log(`🚀 SERVEUR PRÊT : http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error("❌ CRASH BDD", err);
    });
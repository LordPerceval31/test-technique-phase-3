
import { AnalyticService } from "../services/analyticService";
import { Request, Response } from "express";

/**
 * @swagger
 * components:
 * schemas:
 * DepartmentAnalytics:
 * type: object
 * properties:
 * data:
 * type: array
 * items:
 * type: object
 * properties:
 * department: { type: string }
 * total_cost: { type: number }
 * tools_count: { type: integer }
 * total_users: { type: integer }
 * average_cost_per_tool: { type: number }
 * cost_percentage: { type: number }
 * summary:
 * type: object
 * properties:
 * total_company_cost: { type: number }
 * departments_count: { type: integer }
 * most_expensive_department: { type: string }
 */

export class AnalyticController {

    private analyticService = new AnalyticService();

    /**
     * @swagger
     * /api/analytics/department-costs:
     * get:
     * summary: Analyse des coûts par département
     * tags: [Analytics]
     * responses:
     * 200:
     * description: Succès
     * content:
     * application/json:
     * schema:
     * $ref: '#/components/schemas/DepartmentAnalytics'
     * 500:
     * description: Erreur serveur
     */

    getDepartmentCosts = async (req: Request, res: Response) => {
    try {
            // Appel du service (on attend la promesse avec await)
            const analyticsData = await this.analyticService.getDepartmentCosts();

            // Envoi de la réponse JSON au client
            return res.status(200).json(analyticsData);

        } catch (error) {
            // Gestion d'erreur si la BDD crash
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    /**
     * @swagger
     * /api/analytics/expensive-tools:
     * get:
     * summary: Top outils les plus coûteux
     * tags: [Analytics]
     * parameters:
     * - in: query
     * name: limit
     * schema: { type: integer, default: 10 }
     * - in: query
     * name: min_cost
     * schema: { type: number, default: 0 }
     * responses:
     * 200:
     * description: Analyse récupérée avec succès
     * 500:
     * description: Erreur serveur
     */

    getExpensiveTools = async (req: Request, res: Response) => {
    try {
            // Extraction de l'URL, on utilise query pour ce qui est après le ?
            // On défini des valeurs par défaut au cas ou il n'y en a pas dans l'URL
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const minCost = req.query.min_cost ? parseFloat(req.query.min_cost as string) : 0;

            // On vérifie qu'on mets bien une valeur entre 1 et 100
            if (isNaN(limit) || limit < 1 || limit > 100) {
            return res.status(400).json({
                error: "Invalid analytics parameter",
                details: {
                    limit: "Must be positive integer between 1 and 100"
                }
            });
        }

            // Appel du service avec les limit et minCost en paramètre à lui donner
            const analyticsData = await this.analyticService.getExpensiveTools(limit, minCost);

            return res.status(200).json(analyticsData);

        } catch (error) {
            // Gestion d'erreur si la BDD crash
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

}
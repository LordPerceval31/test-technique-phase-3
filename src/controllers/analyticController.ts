
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
}
import { Request, Response } from "express";
import { ToolService } from "../services/toolService";

/**
 * @swagger
 * components:
 *   schemas:
 *     Tool:
 *       type: object
 *       required:
 *         - name
 *         - categoryId
 *         - monthlyCost
 *         - ownerDepartment
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-généré de l'outil
 *         name:
 *           type: string
 *           description: Nom de l'outil
 *         description:
 *           type: string
 *           description: Description de l'outil
 *         vendor:
 *           type: string
 *           description: Fournisseur de l'outil
 *         websiteUrl:
 *           type: string
 *           description: URL du site web de l'outil
 *         categoryId:
 *           type: integer
 *           description: ID de la catégorie
 *         monthlyCost:
 *           type: number
 *           format: decimal
 *           description: Coût mensuel de l'outil
 *         activeUsersCount:
 *           type: integer
 *           description: Nombre d'utilisateurs actifs
 *         ownerDepartment:
 *           type: string
 *           description: Département propriétaire
 *         status:
 *           type: string
 *           enum: [active, deprecated, trial]
 *           description: Statut de l'outil
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de dernière mise à jour
 *       example:
 *         id: 1
 *         name: "Slack"
 *         description: "Outil de communication d'équipe"
 *         vendor: "Slack Technologies"
 *         websiteUrl: "https://slack.com"
 *         categoryId: 1
 *         monthlyCost: 150.00
 *         activeUsersCount: 50
 *         ownerDepartment: "IT"
 *         status: "active"
 */

export class ToolController {

    // Initialisation du service pour accéder à la logique métier
    private toolService = new ToolService();

    /**
     * @swagger
     * /api/tools:
     *   get:
     *     summary: Récupère tous les outils
     *     description: Retourne la liste de tous les outils, avec possibilité de filtrer par département
     *     tags: [Tools]
     *     parameters:
     *       - in: query
     *         name: department
     *         schema:
     *           type: string
     *         description: Filtrer par département (optionnel)
     *         example: "IT"
     *     responses:
     *       200:
     *         description: Liste des outils récupérée avec succès
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Tool'
     *       500:
     *         description: Erreur serveur
     */
    getAll = async (req: Request, res: Response) => {
        try {
            // On récupère le paramêtre dans l'URL
            const department = req.query.department as string;

            // La délégation se fait : Controller -> Service
            const tools = await this.toolService.getAllTools(department);
            
            // Le Controller reprend la main pour répondre au client au format json
            res.json(tools);
        } catch (error) {
            console.error("Erreur dans getAll:", error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    /**
     * @swagger
     * /api/tools/{id}:
     *   get:
     *     summary: Récupère un outil par son ID
     *     description: Retourne les détails d'un outil spécifique
     *     tags: [Tools]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID de l'outil
     *     responses:
     *       200:
     *         description: Outil trouvé
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Tool'
     *       404:
     *         description: Outil non trouvé
     *       500:
     *         description: Erreur serveur
     */
    getOne = async (req: Request, res: Response) => {
        try {
            const toolId = parseInt(req.params.id as string, 10);
            const tool = await this.toolService.getOneTool(toolId);

            // Si tool est null, c'est qu'il n'existe pas
            if (!tool) {
                return res.status(404).json({ error: "Outil non trouvé" });
            }
            res.json(tool);
            
        } catch (error) {
            console.error("Erreur getOne:", error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    /**
     * @swagger
     * /api/tools:
     *   post:
     *     summary: Crée un nouvel outil
     *     description: Ajoute un nouvel outil à la base de données
     *     tags: [Tools]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - categoryId
     *               - monthlyCost
     *               - ownerDepartment
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *               vendor:
     *                 type: string
     *               websiteUrl:
     *                 type: string
     *               categoryId:
     *                 type: integer
     *               monthlyCost:
     *                 type: number
     *               activeUsersCount:
     *                 type: integer
     *               ownerDepartment:
     *                 type: string
     *               status:
     *                 type: string
     *                 enum: [active, deprecated, trial]
     *             example:
     *               name: "Notion"
     *               description: "Outil de prise de notes collaboratif"
     *               vendor: "Notion Labs"
     *               websiteUrl: "https://notion.so"
     *               categoryId: 2
     *               monthlyCost: 200.00
     *               activeUsersCount: 30
     *               ownerDepartment: "Marketing"
     *               status: "active"
     *     responses:
     *       201:
     *         description: Outil créé avec succès
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Tool'
     *       500:
     *         description: Impossible de créer l'outil
     */
    create = async (req: Request, res: Response) => {
        try {
            // Récupération des datas dans le corp de la requête
            const newTool = await this.toolService.create(req.body)

            // Confirmation de la réponse positive et création du newTool
            res.status(201).json(newTool)
        } catch (error) {
         console.error("Erreur create:", error);
            res.status(500).json({ error: "Impossible de créer l'outil" });
        }
    }

    /**
     * @swagger
     * /api/tools/{id}:
     *   delete:
     *     summary: Supprime un outil
     *     description: Supprime un outil de la base de données
     *     tags: [Tools]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID de l'outil à supprimer
     *     responses:
     *       204:
     *         description: Outil supprimé avec succès
     *       404:
     *         description: Outil non trouvé
     *       500:
     *         description: Impossible de supprimer l'outil
     */
    delete = async (req: Request, res: Response) => {
        try {
            const toolId = parseInt(req.params.id as string, 10);

            // On récupère le résultat de la suppression
            const result = await this.toolService.delete(toolId);

            // result.affected contient le nombre de lignes supprimées
            // Si c'est 0, c'est que l'outil n'existait pas
            if (result.affected === 0) {
                return res.status(404).json({ error: "Outil non trouvé" });
            }

            // Si c'est bon -> 204
            res.status(204).send(); 

        } catch (error) {
            console.error("Erreur delete:", error);
            res.status(500).json({ error: "Impossible de supprimer l'outil" });
        }
    }

    /**
     * @swagger
     * /api/tools/{id}:
     *   put:
     *     summary: Met à jour un outil
     *     description: Modifie les informations d'un outil existant
     *     tags: [Tools]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID de l'outil à modifier
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *               vendor:
     *                 type: string
     *               websiteUrl:
     *                 type: string
     *               categoryId:
     *                 type: integer
     *               monthlyCost:
     *                 type: number
     *               activeUsersCount:
     *                 type: integer
     *               ownerDepartment:
     *                 type: string
     *               status:
     *                 type: string
     *                 enum: [active, deprecated, trial]
     *             example:
     *               name: "Slack Pro"
     *               monthlyCost: 250.00
     *               activeUsersCount: 75
     *     responses:
     *       200:
     *         description: Outil mis à jour avec succès
     *       404:
     *         description: Outil non trouvé
     *       500:
     *         description: Impossible de mettre à jour l'outil
     */
    update  = async (req: Request, res: Response) => {

         try {
            const toolId = parseInt(req.params.id as string, 10);
            const toolBody = req.body
            const result = await this.toolService.update(toolId, toolBody);

             if (result.affected === 0) {
                return res.status(404).json({ error: "Outil non trouvé" });
            }
            res.status(200).send();
          } catch (error) {
             console.error("Erreur update", error);
            res.status(500).json({ error: "Impossible de mettre à jour l'outil" });
        }

         }
}
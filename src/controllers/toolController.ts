import { Request, Response } from "express";
import { Between, FindOptionsWhere } from "typeorm";
import { AppDataSource } from "../data-source";
import { Tool } from "../entity/Tool";

/**
 * @swagger
 * components:
 * schemas:
 * Tool:
 * type: object
 * required:
 * - name
 * - categoryId
 * - monthlyCost
 * - ownerDepartment
 * properties:
 * id:
 * type: integer
 * description: ID auto-généré de l'outil
 * name:
 * type: string
 * description: Nom de l'outil
 * description:
 * type: string
 * description: Description de l'outil
 * vendor:
 * type: string
 * description: Fournisseur de l'outil
 * websiteUrl:
 * type: string
 * description: URL du site web de l'outil
 * categoryId:
 * type: integer
 * description: ID de la catégorie
 * monthlyCost:
 * type: number
 * format: decimal
 * description: Coût mensuel de l'outil
 * activeUsersCount:
 * type: integer
 * description: Nombre d'utilisateurs actifs
 * ownerDepartment:
 * type: string
 * description: Département propriétaire
 * status:
 * type: string
 * enum: [active, deprecated, trial]
 * description: Statut de l'outil
 * createdAt:
 * type: string
 * format: date-time
 * description: Date de création
 * updatedAt:
 * type: string
 * format: date-time
 * description: Date de dernière mise à jour
 * example:
 * id: 1
 * name: "Slack"
 * description: "Outil de communication d'équipe"
 * vendor: "Slack Technologies"
 * websiteUrl: "https://slack.com"
 * categoryId: 1
 * monthlyCost: 150.00
 * activeUsersCount: 50
 * ownerDepartment: "IT"
 * status: "active"
 */
export class ToolController {

    // Initialisation du service pour accéder à la logique métier
    private toolRepository = AppDataSource.getRepository(Tool);

    /**
     * @swagger
     * /api/tools:
     * get:
     * summary: Récupère tous les outils
     * description: Retourne la liste de tous les outils, avec possibilité de filtrer par département
     * tags: [Tools]
     * parameters:
     * - in: query
     * name: department
     * schema:
     * type: string
     * description: Filtrer par département (optionnel)
     * example: "IT"
     * responses:
     * 200:
     * description: Liste des outils récupérée avec succès
     * content:
     * application/json:
     * schema:
     * type: array
     * items:
     * $ref: '#/components/schemas/Tool'
     * 500:
     * description: Erreur serveur
     */
    getAll = async (req: Request, res: Response) => {
        try {
            // On récupère le paramêtre dans l'URL
            const { department, status, min_cost, max_cost, page = 1, limit = 10 } = req.query;

            // la boite à filtre (vide si pas de filtre)
            const where: FindOptionsWhere<Tool> = {};

            // Filtre par département
            if (department) {
                where.ownerDepartment = department as string;
            }
            // Filtre par status (active, deprecated, trial)
            if (status) {
                where.status = status as string;
            }
            // Filtre de prix (si min ou max est présent)
            if (min_cost || max_cost) {
                where.monthlyCost = Between(
                    Number(min_cost) || 0,
                    Number(max_cost) || 999999
                );
            }

            // Pagination
            const pageNum = Number(page);
            const limitNum = Number(limit);
            const skip = (pageNum - 1) * limitNum;

            // Requête BDD
            const [tools, total] = await this.toolRepository.findAndCount({
                where,
                skip,
                take: limitNum,
                order: { createdAt: 'DESC' }
            });

            // Réponse formatée
            return res.json({
                data: tools,
                total,
                filtered: tools.length,
                filters_applied: { department, status, min_cost, max_cost },
                pagination: {
                    current_page: pageNum,
                    per_page: limitNum,
                    total_pages: Math.ceil(total / limitNum)
                }
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error", message: "Database connection failed" });
        }
    };

    /**
     * @swagger
     * /api/tools/{id}:
     * get:
     * summary: Récupère un outil par son ID
     * description: Retourne les détails d'un outil spécifique
     * tags: [Tools]
     * parameters:
     * - in: path
     * name: id
     * required: true
     * schema:
     * type: integer
     * description: ID de l'outil
     * responses:
     * 200:
     * description: Outil trouvé
     * content:
     * application/json:
     * schema:
     * $ref: '#/components/schemas/Tool'
     * 404:
     * description: Outil non trouvé
     * 500:
     * description: Erreur serveur
     */
    getOne = async (req: Request, res: Response) => {
        try {

            // Conversion de l'ID (string) en nombre (integer)
            const id = parseInt(req.params.id as string);
            // Recherche d'un outil par son Id
            const tool = await this.toolRepository.findOneBy({ id });

            if (!tool) {
                return res.status(404).json({ error: "Tool not found", message: `Tool with ID ${id} does not exist` });
            }

            // Simulation des métriques d'usage (on créé nous même un tool avec des données aléatoire)
            const responseWithMetrics = {
                ...tool,
                // Calcul du coût total mensuel
                total_monthly_cost: tool.monthlyCost * (tool.activeUsersCount || 1), 
                usage_metrics: {
                    last_30_days: {
                        total_sessions: Math.floor(Math.random() * 200),
                        avg_session_minutes: 45
                    }
                }
            };
            // On renvoi l'objet json du métrique
            return res.json(responseWithMetrics);

        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    };

/**
     * @swagger
     * /api/tools:
     * post:
     * summary: Crée un nouvel outil
     * tags: [Tools]
     * requestBody:
     * required: true
     * content:
     * application/json:
     * schema:
     * type: object
     * required:
     * - name
     * - category_id
     * - monthly_cost
     * - owner_department
     * properties:
     * name:
     * type: string
     * description:
     * type: string
     * vendor:
     * type: string
     * website_url:
     * type: string
     * category_id:
     * type: integer
     * monthly_cost:
     * type: number
     * owner_department:
     * type: string
     * responses:
     * 201:
     * description: Créé
     */
    create = async (req: Request, res: Response) => {
        try {
            // Tous les champs requis à remplir
            const { name, description, monthly_cost, owner_department, vendor, website_url, category_id, status } = req.body;

            const errors: any = {};
            if (!name || name.length < 2 || name.length > 100) errors.name = "Name required (2-100 chars)";
            if (monthly_cost < 0) errors.monthly_cost = "Must be positive";
            
            const validDepts = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Design'];
            if (!validDepts.includes(owner_department)) errors.owner_department = `Must be one of: ${validDepts.join(', ')}`;
            
            if (!category_id) errors.category_id = "Category ID is required";

            // Si il y a un erreur parmi les name, monthly-cost... alors on arrête tout
            if (Object.keys(errors).length > 0) {
                return res.status(400).json({ error: "Validation failed", details: errors });
            }

            // On cherche s'il n'y a pas déjà un outil avec ce nom
            const existing = await this.toolRepository.findOneBy({ name });
            if (existing) {
                return res.status(400).json({ error: "Validation failed", details: { name: "Tool name must be unique" } });
            }

            // création de l'outil (Snake_case du JSON -> camelCase de l'entité)
            const tool = this.toolRepository.create({
                name,
                description: description, 
                monthlyCost: monthly_cost, 
                ownerDepartment: owner_department, 
                vendor,
                websiteUrl: website_url, 
                categoryId: category_id,
                status: status || 'active',
                activeUsersCount: 0
            });

            // Sauvegarde de l'outil
            await this.toolRepository.save(tool);
            return res.status(201).json(tool);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    };

    /**
     * @swagger
     * /api/tools/{id}:
     * put:
     * summary: Met à jour un outil
     * description: Modifie les informations d'un outil existant
     * tags: [Tools]
     * parameters:
     * - in: path
     * name: id
     * required: true
     * schema:
     * type: integer
     * description: ID de l'outil à modifier
     * requestBody:
     * required: true
     * content:
     * application/json:
     * schema:
     * type: object
     * properties:
     * name:
     * type: string
     * description:
     * type: string
     * vendor:
     * type: string
     * websiteUrl:
     * type: string
     * categoryId:
     * type: integer
     * monthlyCost:
     * type: number
     * activeUsersCount:
     * type: integer
     * ownerDepartment:
     * type: string
     * status:
     * type: string
     * enum: [active, deprecated, trial]
     * example:
     * name: "Slack Pro"
     * monthlyCost: 250.00
     * activeUsersCount: 75
     * responses:
     * 200:
     * description: Outil mis à jour avec succès
     * 404:
     * description: Outil non trouvé
     * 500:
     * description: Impossible de mettre à jour l'outil
     */
    update = async (req: Request, res: Response) => {
        try {

            // Conversion de l'ID (string) en nombre (integer)
            const id = parseInt(req.params.id as string);
            // Recherche d'un outil par son Id
            const tool = await this.toolRepository.findOneBy({ id });

            if (!tool) {
                return res.status(404).json({ error: "Tool not found" });
            }

            // Fusion des nouvelles données
            this.toolRepository.merge(tool, req.body);
            
            // On s'assure que le status de l'outils est bien active, deprecated ou trial
            const validStatus = ['active', 'deprecated', 'trial'];
            if (req.body.status && !validStatus.includes(req.body.status)) {
                 return res.status(400).json({ error: "Validation failed", details: { status: "Invalid status enum" } });
            }

            // Sauvegarde du résultat
            const result = await this.toolRepository.save(tool);
            return res.json(result);
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    };

    /**
     * @swagger
     * /api/tools/{id}:
     * delete:
     * summary: Supprime un outil
     * description: Supprime un outil de la base de données
     * tags: [Tools]
     * parameters:
     * - in: path
     * name: id
     * required: true
     * schema:
     * type: integer
     * description: ID de l'outil à supprimer
     * responses:
     * 204:
     * description: Outil supprimé avec succès
     * 404:
     * description: Outil non trouvé
     * 500:
     * description: Impossible de supprimer l'outil
     */
    delete = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id as string);
            const result = await this.toolRepository.delete(id);

            if (result.affected === 0) {
                return res.status(404).json({ error: "Tool not found" });
            }

            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    };
}
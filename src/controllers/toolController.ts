import { Request, Response } from "express";
import { ToolService } from "../services/toolService";

export class ToolController {

    // Initialisation du service pour accéder à la logique métier
    private toolService = new ToolService();

    // Route GET
    // On reçoit la requête (req) et on demande au SERVICE de récupérer les données
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
    // Route POST
    create = async (req: Request, res: Response) => {
        try {
            // Récupération des data dans le corp de la requête
            const newTool = await this.toolService.create(req.body)

            // Confirmation de la réponse positive et création du newTool
            res.status(201).json(newTool)
        } catch (error) {
         console.error("Erreur create:", error);
            res.status(500).json({ error: "Impossible de créer l'outil" });
        }
    }

    // Route DELETE
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
}
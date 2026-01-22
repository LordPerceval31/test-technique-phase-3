import { Request, Response } from "express";
import { ToolService } from "../services/toolService";

export class ToolController {

    // Initialisation du service pour accéder à la logique métier
    private toolService = new ToolService();

    // On reçoit la requête (req) et on demande au SERVICE de récupérer les données
    getAll = async (req: Request, res: Response) => {
        try {
            // la délégation se fait : Controller -> Service
            const tools = await this.toolService.getAllTools();
            
            // Le Controller reprend la main pour répondre au client au format json
            res.json(tools);
        } catch (error) {
            console.error("Erreur dans getAll:", error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }
}
import { AppDataSource } from "../data-source";
import { Tool } from "../entities/Tool";


export class ToolService {
    private toolRepository = AppDataSource.getRepository(Tool);

    async getAllTools(departmentFiltrer?: string) { 
        
        return await this.toolRepository.find({
            // soit on veut filtrer par département, soit on récupère tout
            where: departmentFiltrer ? {ownerDepartment: departmentFiltrer} : {},

            // l'ordre d'affichage du json
            order: {
                // ordre alphabétique
                name: "ASC"
            }
        });
    }
    async create(toolData: any) {

        // Création des datas du nouvel outil
        const newTool = this.toolRepository.create(toolData);

        // On sauvegarde le nouvel outil dans la BDD
        return await this.toolRepository.save(newTool)
    }
}
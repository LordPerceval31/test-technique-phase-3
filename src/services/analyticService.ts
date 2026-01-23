import { AppDataSource } from "../data-source";
import { Tool } from "../entity/Tool";


export class AnalyticService {
    private analyticRepository = AppDataSource.getRepository(Tool)
    
async getDepartmentCosts() {
        
        // Récupération des données brutes avec le Query Builder
        const results = await this.analyticRepository
            .createQueryBuilder("tool")
            
            // Sélection du département
            .select("tool.owner_department", "department") 
  
            // Métriques
            .addSelect("COUNT(tool.id)", "tools_count")
            .addSelect("SUM(tool.active_users_count)", "total_users")
            .addSelect("SUM(tool.monthly_cost)", "total_cost")
            .addSelect("AVG(tool.monthly_cost)", "average_cost_per_tool")
  
            // Filtre de statut
            .where("tool.status = :status", { status: 'active' })
  
            // Groupement et Tri
            .groupBy("tool.owner_department")
            .orderBy("total_cost", "DESC")
            
            .getRawMany();

        // Calcul du coût total de l'entreprise
        const totalCompanyCost = results.reduce((acc, curr) => acc + parseFloat(curr.total_cost), 0);

        // Formatage final des données avec calcul du pourcentage
        const data = results.map(department => {
            // On récupère le cout total du département en transformant son texte en nombre
            const totalDepartmentCost = parseFloat(department.total_cost);
            return {
                department: department.department,
                total_cost: Math.round(totalDepartmentCost * 100) / 100,
                tools_count: parseInt(department.tools_count),
                total_users: parseInt(department.total_users),
                average_cost_per_tool: Math.round(parseFloat(department.average_cost_per_tool) * 100) / 100,
                // On affiche le coût en pourcentage
                // Si on divise par 0 ça plante, alors on affiche 0 si l'entreprise ne dépense rien
                cost_percentage: totalCompanyCost > 0 
                    ? Math.round((totalDepartmentCost / totalCompanyCost * 100) * 10) / 10 
                    : 0
            };
        });

        // 4. Construction de l'objet de réponse complet
        return {
            data,
            summary: {
                total_company_cost: Math.round(totalCompanyCost * 100) / 100,
                // le nombre total de départements
                departments_count: data.length,
                // le département qui coûte le plus cher
                most_expensive_department: data.length > 0 ? data[0].department : "N/A"
            }
        };
    }
}
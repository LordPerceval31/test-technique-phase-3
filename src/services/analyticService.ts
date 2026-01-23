import { AppDataSource } from "../data-source";
import { Tool } from "../entity/Tool";


export class AnalyticService {
    private analyticRepository = AppDataSource.getRepository(Tool)
    
    async getDepartmentCosts(sortBy: string = 'total_cost', order: 'ASC' | 'DESC' = 'DESC') {
        
        // Récupération des données brutes avec le Query Builder
        const query = this.analyticRepository
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
  
            // Groupement
            .groupBy("tool.owner_department")
            
            // Gestion du tri dynamique et cas d'égalité
            if (sortBy === 'total_cost') {
                // Si égalité : ordre alphabétique du nom département
                query.orderBy("total_cost", order).addOrderBy("tool.owner_department", "ASC");
            } else {
                query.orderBy("tool.owner_department", order);
            }

        const results = await query.getRawMany();

        // Calcul du coût total de l'entreprise
        const totalCompanyCost = results.reduce((acc, curr) => acc + parseFloat(curr.total_cost), 0);

        // Formatage final des données avec calcul du pourcentage
        const data = results.map(department => {
            // On convertit le coût total en nombre (le SQL renvoie souvent du texte)
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

        // Cas avec une DB vide
        if (data.length === 0) {
            return {
            data: [],
            message: "No analytics data available - ensure tools data exists",
            summary: { total_company_cost: 0 }
            };
        }

        // Construction de l'objet de réponse complet
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

    async getExpensiveTools(limit: number = 10, minCost: number = 0) {

        const tools = await this.analyticRepository 
        .createQueryBuilder("tool")
        // On veut que les status actifs
        .where("tool.status = :status", { status: 'active' })
        // On affichera le résultat avec les coûts, même ce à 0
        .andWhere("tool.monthly_cost >= :minCost", { minCost })
        // Trier du plus gros coût au plus petit
        .orderBy("tool.monthly_cost", "DESC")
        // Applique la limite de résultats demandée (par défaut 10)
        .limit(limit)
        .getMany();
    
        // On récupère tous les outils actifs pour le calcul global
        const allActiveTools = await this.analyticRepository.find({
            where: { status: 'active' }
        });

        // Exclure les outils à 0 utilisateur du calcul de la moyenne globale
        const toolsWithUsers = allActiveTools.filter(t => t.activeUsersCount > 0);

        // Le coût total de tous les outils actifs
        const totalCost = toolsWithUsers.reduce((acc, t) => acc + Number(t.monthlyCost), 0);
        
        // Si on voit un outils avec 0 user, on en tient pas compte afin d'éviter une division par 0
        const totalUsers = toolsWithUsers.reduce((acc, t) => acc + t.activeUsersCount, 0);

        // Si des outils sont utilisé par des users, on afficher le résultat moyen, sinon on affiche 0
        const avgCompanyCostPerUser = totalUsers > 0 ? totalCost / totalUsers : 0;

        const data = tools.map(tool => {
            const costPerUser = tool.activeUsersCount > 0
            ? Number(tool.monthlyCost) / tool.activeUsersCount
            : Number(tool.monthlyCost);

            // Suivant le coût par utilisateur, on défini un status
            let rating: string;
            if (costPerUser < avgCompanyCostPerUser * 0.5) {
                rating = "excellent";
            } else if (costPerUser < avgCompanyCostPerUser * 0.8) {
                rating = "good";
            } else if (costPerUser <= avgCompanyCostPerUser * 1.2) {
                rating = "average";
            } else {
                rating = "low";
            }

            // le nouvel objet data avec toutes nos valeurs
            return {
                id: tool.id,
                name: tool.name,
                monthly_cost: Math.round(Number(tool.monthlyCost) * 100) / 100,
                active_users_count: tool.activeUsersCount,
                cost_per_user: Math.round(costPerUser * 100) / 100,
                department: tool.ownerDepartment,
                vendor: tool.vendor,
                efficiency_rating: rating
            };
        });

        // On calcule le total des coûts des outils qui ont un coefficient bas qu'on pourrai sauver
        const potentialSavings = allActiveTools.reduce((acc, tool) => {
        
        // Calcul du coût par utilisateur pour un outil
        const costPerUser = tool.activeUsersCount > 0 
        ? Number(tool.monthlyCost) / tool.activeUsersCount 
        : Number(tool.monthlyCost);

        // Est-ce qu'il est "low" ?
        const isLow = costPerUser > (avgCompanyCostPerUser * 1.2);

        // Si c'est low, on ajoute son coût au total des économies
        return isLow ? acc + Number(tool.monthlyCost) : acc;
        }, 0);

        return {
        data,
        analysis: {
            total_tools_analyzed: allActiveTools.length,
            avg_cost_per_user_company: Math.round(avgCompanyCostPerUser * 100) / 100,
            potential_savings_identified: Math.round(potentialSavings * 100) / 100
            }
        };
    }

    async getToolsByCategory(sortBy: string = 'total_cost', order: 'ASC' | 'DESC' = 'DESC') {

        // On récupère tous les coût des outils de l'entreprise avec le status actif
        const Stats = await this.analyticRepository
            .createQueryBuilder("tool")
            .select("SUM(tool.monthly_cost)", "total")
            .where("tool.status = :status", { status: 'active' })
            .getRawOne();

        
        const totalCompanyCost = parseFloat(Stats?.total) || 0;

        const query = this.analyticRepository
            .createQueryBuilder("tool")
            // On join la table catégorie
            .innerJoin("tool.category", "cat")
            .select("cat.name", "category_name")
            .addSelect("COUNT(tool.id)", "tools_count")
            .addSelect("SUM(tool.monthly_cost)", "total_cost")
            .addSelect("SUM(tool.active_users_count)", "total_users")
            .where("tool.status = :status", { status: 'active' })
            .groupBy("cat.name")
             
            if (sortBy === 'total_cost') {
                // Si égalité de coût : ordre alphabétique de la catégorie
                query.orderBy("total_cost", order).addOrderBy("cat.name", "ASC");
            } else {
                // Tri par défaut sur le nom de la catégorie
                query.orderBy("cat.name", order);
            }

        const results = await query.getRawMany();

        const data = results.map(category => {

            // On met les valeurs en number
            const totalCost = parseFloat(category.total_cost);
            const toolsCount = parseInt(category.tools_count);
            const totalUsers = parseInt(category.total_users);

            // Calcul du coût par catégorie
            const costPercentage = totalCompanyCost > 0 ? 
            Math.round((totalCost / totalCompanyCost * 100) * 10) / 10 
            : 0

            // Calcul du coût moyen par utilisateur
            const avgCostPerUser = totalUsers > 0 ?
            Math.round((totalCost / totalUsers) * 100) / 100
            : 0

        return {
                category_name: category.category_name,
                tools_count: toolsCount,
                total_cost: Math.round(totalCost * 100) / 100,
                total_users: totalUsers,
                percentage_of_budget: costPercentage,
                average_cost_per_user: avgCostPerUser
            };
        })

        // La catégory la plus chère
        const maxCost = Math.max(...data.map(d => d.total_cost));
        const expensiveTool = data.find(d => d.total_cost === maxCost);
        const mostExpensive = expensiveTool ? expensiveTool.category_name : "N/A";

        // On filtre pour garder uniquement les catégories ayant des utilisateurs actifs
        const categoryHasUsers = data.filter(t => t.total_users > 0)

        const efficientList = categoryHasUsers.sort((a, b) => {
            // Si les valeurs moyennes sont identiques
            if (a.average_cost_per_user === b.average_cost_per_user) {
            
            // On tri par ordre alphabétique
            return a.category_name.localeCompare(b.category_name);
            }
            // Sinon, trier par prix croissant
            return a.average_cost_per_user - b.average_cost_per_user;
        });

        // Le plus rentable (le moins cher par utilisateur)
        const mostEfficient = efficientList.length > 0 ? efficientList[0].category_name : "N/A";

        return {
            data: data,
            insights: {
                most_expensive_category: mostExpensive,
                most_efficient_category: mostEfficient,
            }
        }
    }
}
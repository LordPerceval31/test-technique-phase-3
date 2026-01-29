import { useState, useEffect, useMemo } from "react";
import KPICard from "../components/KPICard";
import { Building2, Users, Wrench, TrendingUp, Loader2 } from "lucide-react";
import RecentTools from "../components/recentTools";
import { getTools } from "../utils/api";
import type { Tool } from "../utils/interfaces";

interface DashboardProps {
  isDark: boolean;
}

const Dashboard = ({ isDark }: DashboardProps) => {
  // gestion de l'état local pour les données et le chargement
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  // chargement initial des données de l'api au montage du composant
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getTools();
        setTools(data);
      } catch (error) {
        console.error("Erreur chargement dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // calcul mémorisé (usememo) des indicateurs de performance (kpi)
  const kpiData = useMemo(() => {
    if (!tools || tools.length === 0) {
      return { budget: 0, budgetTrend: "0%", costPerUser: 0, costPerUserTrend: "€0", departments: 0, activeTools: 0 };
    }

    // calcul du nombre total d'utilisateurs actifs
    const totalUsers = tools.reduce((acc, tool) => acc + (Number(tool.active_users_count) || 0), 0);

    // calcul du budget mensuel total actuel
    const totalBudget = tools.reduce((acc, tool) => {
      const cost = Number(tool.monthly_cost || 0);
      return acc + (isNaN(cost) ? 0 : cost);
    }, 0);

    // calcul du budget du mois précédent pour la tendance
    const totalPreviousBudget = tools.reduce((acc, tool) => {
      return acc + (Number(tool.previous_month_cost) || 0);
    }, 0);

    // calcul du pourcentage d'évolution budgétaire
    let percentChange = 0;
    
    if (totalPreviousBudget > 0) {
      percentChange = ((totalBudget - totalPreviousBudget) / totalPreviousBudget) * 100;
    } else if (totalBudget > 0) {
      percentChange = 100;
    }

    // formatage de la chaine de tendance (ex: "+12.5%" ou "-5.2%")
    const budgetSign = percentChange > 0 ? "+" : "";
    const budgetTrendString = `${budgetSign}${percentChange.toFixed(1)}%`;

    // coût moyen par utilisateur (actuel vs précédent)
    const currentCostPerUser = totalUsers > 0 ? Math.round(totalBudget / totalUsers) : 0;
    const previousCostPerUser = totalUsers > 0 ? Math.round(totalPreviousBudget / totalUsers) : 0;
    
    const diffCostPerUser = currentCostPerUser - previousCostPerUser;
    const costPerUserSign = diffCostPerUser > 0 ? "+" : "";
    const costPerUserTrendString = `${costPerUserSign}€${diffCostPerUser}`;

    // comptage des départements uniques et outils actifs
    const uniqueDepartments = new Set(
      tools.map(t => t.owner_department).filter(d => d && d.trim() !== "")
    ).size;

    const activeToolsCount = tools.filter(t => t.status === "active").length;

    return {
      budget: totalBudget,
      budgetTrend: budgetTrendString,
      costPerUser: totalUsers > 0 ? Math.round(totalBudget / totalUsers) : 0,
      costPerUserTrend: costPerUserTrendString,
      departments: uniqueDepartments,
      activeTools: activeToolsCount 
    };
  }, [tools]);

  // affichage du loader pendant la récupération des données
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <main className="p-6 md:p-12 flex flex-col min-h-[calc(100vh-6rem)]">
      
      {/* en-tête du tableau de bord */}
      <div className="flex flex-col text-center lg:text-left space-y-2">
        <h1 className={`text-3xl md:text-4xl font-bold tracking-tight transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Internal Tools Dashboard
        </h1>
        <h2 className={`text-base md:text-lg font-normal transition-colors ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Monitor and manage your organization's software tools and expenses
        </h2>
      </div>

      {/* grille des cartes kpi */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
       
       {/* kpi : budget mensuel */}
       <div className="aspect-video">
          <KPICard 
            title="Monthly Budget"
            value={`€${kpiData.budget.toLocaleString()}`}
            subValue="/30k"
            trend={kpiData.budgetTrend}
            icon={TrendingUp}
            color={kpiData.budget > 30000 ? "orange" : "green"} 
            progress={Math.min((kpiData.budget / 30000) * 100, 100)}
          />
        </div>

        {/* kpi : nombre d'outils actifs */}
        <div className="aspect-video">
          <KPICard 
            title="Active Tools"
            value={kpiData.activeTools.toString()} 
            trend="+8"
            icon={Wrench}
            color="blue"
          />
        </div>

        {/* kpi : nombre de départements */}
        <div className="aspect-video">
          <KPICard
            title="Departments"
            value={kpiData.departments.toString()}
            trend="+2"
            icon={Building2}
            color="orange"
          />
        </div>

        {/* kpi : coût moyen par utilisateur */}
        <div className="aspect-video">
          <KPICard 
            title="Cost/User"
            value={`€${kpiData.costPerUser}`}
            trend={kpiData.costPerUserTrend}
            icon={Users}
            color="pink"
          />
        </div>
      </section>

      {/* liste des outils récents */}
      <section className="mt-8 mb-8 flex-1 w-full min-h-250 lg:min-h-0 flex flex-col">
          <RecentTools tools={tools} /> 
      </section>

    </main>
  );
};

export default Dashboard;
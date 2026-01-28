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
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

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

  const kpiData = useMemo(() => {
    if (!tools || tools.length === 0) {
      return { budget: 0, costPerUser: 0, departments: 0, activeTools: 0 };
    }

    // Budget Total
    const totalBudget = tools.reduce((acc, tool) => {
      const cost = Number(tool.monthly_cost || 0);
      return acc + (isNaN(cost) ? 0 : cost);
    }, 0);

    // Total Utilisateurs (pour le calcul du coût moyen)
    const totalUsers = tools.reduce((acc, tool) => {
      const users = Number(tool.active_users_count || 0);
      return acc + (isNaN(users) ? 0 : users);
    }, 0);

    // Départements Uniques
    const uniqueDepartments = new Set(
      tools.map(t => t.owner_department).filter(d => d && d.trim() !== "")
    ).size;

    // Outils Actifs
    const activeToolsCount = tools.filter(t => t.status === "active").length;

    return {
      budget: totalBudget,
      costPerUser: totalUsers > 0 ? Math.round(totalBudget / totalUsers) : 0,
      departments: uniqueDepartments,
      activeTools: activeToolsCount 
    };
  }, [tools]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <main className="p-6 md:p-12 flex flex-col min-h-[calc(100vh-6rem)]">
      
      <div className="flex flex-col text-center lg:text-left space-y-2">
        <h1 className={`text-3xl md:text-4xl font-bold tracking-tight transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Internal Tools Dashboard
        </h1>
        <h2 className={`text-base md:text-lg font-normal transition-colors ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Monitor and manage your organization's software tools and expenses
        </h2>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
       
       {/* Budget du moi */}
       <div className="aspect-video">
          <KPICard 
            title="Monthly Budget"
            value={`€${kpiData.budget.toLocaleString()}`}
            subValue="/30k"
            trend="+12%" 
            icon={TrendingUp}
            color={kpiData.budget > 30000 ? "orange" : "green"}
            progress={Math.min((kpiData.budget / 30000) * 100, 100)}
          />
        </div>

        {/* Outils actif */}
        <div className="aspect-video">
          <KPICard 
            title="Active Tools"
            value={kpiData.activeTools.toString()} 
            trend="+8"
            icon={Wrench}
            color="blue"
          />
        </div>

        {/* Departements */}
        <div className="aspect-video">
          <KPICard
            title="Departments"
            value={kpiData.departments.toString()}
            trend="+2"
            icon={Building2}
            color="orange"
          />
        </div>

        {/* Coût moyen par utilisateur */}
        <div className="aspect-video">
          <KPICard 
            title="Cost/User"
            value={`€${kpiData.costPerUser}`}
            trend="-€12"
            icon={Users}
            color="pink"
          />
        </div>
      </section>

      <section className="mt-8 mb-8 flex-1 w-full min-h-250 lg:min-h-0 flex flex-col">
          <RecentTools tools={tools} /> 
      </section>

    </main>
  );
};

export default Dashboard;
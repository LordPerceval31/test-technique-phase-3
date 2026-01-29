import { useState, useEffect, useMemo, useRef } from "react";
import { TrendingUp, Users, Zap, Target, Loader2 } from "lucide-react";
import KPICard from "../components/KPICard";
import { getTools, getUsers, getUserTools } from "../utils/api"; 
import { type User, type Tool, type UserTool } from "../utils/interfaces";
import type { TimeRange } from "../components/timeRaneSelector";
import TimeRangeSelector from "../components/timeRaneSelector";
import CostEvolutionChart from "../components/charts/costEvolutionChart";
import DepartmentBreakdownChart from "../components/charts/DepartmentBreakdownChart"; 
import TopToolsChart from "../components/charts/topToolsChart";

interface AnalyticsProps {
  isDark: boolean;
}

const Analytics = ({ isDark }: AnalyticsProps) => {

  const [toolsList, setToolsList] = useState<Tool[]>([]);
  const [staffList, setStaffList] = useState<User[]>([]);
  const [assignmentsList, setAssignmentsList] = useState<UserTool[]>([]);
  
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  
  const isFirstRun = useRef(true);

  // Récupération parallèle des 3 sources de vérité
  useEffect(() => {
    const fetchData = async () => {
      if (!isFirstRun.current) setIsRefetching(true);
      try {
        // On attend que les 3 requêtes soient finies
        const [toolsData, staffData, assignmentsData] = await Promise.all([
          getTools(),
          getUsers(),
          getUserTools(),
        ]);

        // Mise à jour des états
        setToolsList(toolsData);
        setStaffList(staffData);
        setAssignmentsList(assignmentsData);

      } catch (err) {
        console.error("Erreur critique chargement Analytics :", err);
      } finally {
        setIsInitialLoading(false);
        setIsRefetching(false);
        isFirstRun.current = false;
      }
    };
    fetchData();
  }, [timeRange]);

  // Préparation des données pour les graphiques
  const chartData = useMemo(() => {
    if (!toolsList.length) return { costData: [], deptData: [], topData: [] };

    const totalCurrent = toolsList.reduce((acc, t) => acc + (Number(t.monthly_cost) || 0), 0);
    const totalPrevious = toolsList.reduce((acc, t) => acc + (Number(t.previous_month_cost) || 0), 0);
    
    const costData = [
      { name: "Previous Month", total: totalPrevious },
      { name: "Current Month", total: totalCurrent },
    ];

    const deptCounts = toolsList.reduce((acc: Record<string, number>, tool) => {
      const dept = tool.owner_department || "Unassigned";
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    const deptData = Object.entries(deptCounts).map(([name, total]) => ({
      name,
      total
    }));

    const topData = [...toolsList]
      .sort((a, b) => (b.monthly_cost || 0) - (a.monthly_cost || 0))
      .slice(0, 8)
      .map(t => ({
        name: t.name,
        total: t.monthly_cost || 0
      }));

    return { costData, deptData, topData };
  }, [toolsList]);

  // 4. Calcul des KPIs avec la VRAIE formule d'adoption
  const stats = useMemo(() => {
    // Si on n'a pas encore chargé les outils ou le staff, on renvoie des zéros
    if (!toolsList.length || !staffList.length) {
        return { budget: 0, budgetTrend: "0%", activeTools: 0, costPerUser: 0, costPerUserTrend: "€0", adoption: 0 };
    }

    // --- Calculs Financiers ---
    const totalBudget = toolsList.reduce((acc, t) => acc + (Number(t.monthly_cost) || 0), 0);
    const totalPrevious = toolsList.reduce((acc, t) => acc + (Number(t.previous_month_cost) || 0), 0);
    
    // Tendance
    const budgetDiff = totalBudget - totalPrevious;
    const budgetTrend = totalPrevious > 0 
      ? `${budgetDiff > 0 ? '+' : ''}${((budgetDiff / totalPrevious) * 100).toFixed(1)}%` 
      : "0%";
    
    // Nombre total d'employés dans l'entreprise (ex: 66)
    const totalEmployeesCount = staffList.length; 
    
    // Nombre total de comptes activés (ex: 873) - On utilise la table de liaison !
    const activeAccountsCount = assignmentsList.length;

    // Capacité maximale : Si tout le monde utilisait tous les outils (66 * 24 = 1584)
    const maxCapacity = totalEmployeesCount * toolsList.length;

    // Taux d'adoption réel
    const realAdoptionRate = maxCapacity > 0 
        ? Math.round((activeAccountsCount / maxCapacity) * 100) 
        : 0;

    // Coût par utilisateur (Budget Total / Nombre d'employés)
    const currentCostPerUser = totalEmployeesCount > 0 ? Math.round(totalBudget / totalEmployeesCount) : 0;
    
    // Pour la tendance coût/user, on estime basé sur le budget précédent
    const previousCostPerUser = totalEmployeesCount > 0 ? Math.round(totalPrevious / totalEmployeesCount) : 0;
    const diffCostPerUser = currentCostPerUser - previousCostPerUser;
    const costPerUserTrend = `${diffCostPerUser > 0 ? '+' : ''}€${diffCostPerUser}`;

    return {
      budget: totalBudget,
      budgetTrend: budgetTrend,
      activeTools: toolsList.filter(t => t.status === "active").length,
      costPerUser: currentCostPerUser,
      costPerUserTrend: costPerUserTrend,
      adoption: Math.min(realAdoptionRate, 100)
    };
  }, [toolsList, staffList, assignmentsList]);

  if (isInitialLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <main className={`p-6 md:p-12 flex flex-col min-h-[calc(100vh-6rem)] transition-opacity duration-300 ${isRefetching ? 'opacity-60' : 'opacity-100'}`}>
      
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-2">
          <h1 className={`text-3xl md:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Analytics & Insights
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Reporting en temps réel basé sur {toolsList.length} outils et {staffList.length} collaborateurs.
          </p>
        </div>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} isDark={isDark} />
      </div>

      {/* Section KPI */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="aspect-video">
          <KPICard 
            title="Total Spend" 
            value={`€${stats.budget.toLocaleString()}`} 
            subValue="/30k"
            trend={stats.budgetTrend} 
            icon={TrendingUp} 
            color={stats.budget > 30000 ? "orange" : "blue"} 
            progress={Math.min((stats.budget / 30000) * 100, 100)}
          />
        </div>
        <div className="aspect-video">
          <KPICard 
            title="Avg. Adoption" 
            value={`${stats.adoption}%`} 
            trend={stats.adoption > 50 ? "Good" : "Low"} 
            icon={Target} 
            color="green" 
          />
        </div>
        <div className="aspect-video">
          <KPICard 
            title="Active Tools" 
            value={stats.activeTools.toString()} 
            trend="Stable" 
            icon={Zap} 
            color="pink" 
          />
        </div>
        <div className="aspect-video">
          <KPICard 
            title="Cost/User" 
            value={`€${stats.costPerUser}`} 
            trend={stats.costPerUserTrend} 
            icon={Users} 
            color="orange" 
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Évolution mensuelle */}
        <div className={`min-h-100 rounded-2xl border ${isDark ? 'bg-black border-white/10 shadow-blue-500/5' : 'bg-white border-gray-200'} p-6 flex flex-col`}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Monthly Spend Evolution</h3>
          <div className="flex-1 h-full w-full">
            <CostEvolutionChart data={chartData.costData} isDark={isDark} />
          </div>
        </div>
        
        {/* Répartition par département */}
        <div className={`min-h-100 rounded-2xl border ${isDark ? 'bg-black border-white/10 shadow-purple-500/5' : 'bg-white border-gray-200'} p-6 flex flex-col`}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Department Cost Breakdown</h3>
          <div className="flex-1 h-full w-full">
            {isRefetching ? (
               <div className="h-full flex items-center justify-center">
                 <Loader2 className="animate-spin text-purple-500" />
               </div>
            ) : (
               <DepartmentBreakdownChart data={chartData.deptData} isDark={isDark}/>
            )}
          </div>
        </div>

        {/* Classement des dépenses */}
        <div className={`lg:col-span-2 min-h-80 rounded-2xl border ${isDark ? 'bg-black border-white/10 shadow-blue-500/5' : 'bg-white border-gray-200'} p-6 flex flex-col`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Top Expensive Tools
            </h3>
            <span className="text-xs text-gray-500">Top 8 by monthly spend</span>
          </div>
          
          <div className="flex-1 h-full w-full">
            {isRefetching ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" />
              </div>
            ) : (
              <TopToolsChart data={chartData.topData} isDark={isDark} />
            )}
          </div>
        </div>

      </div>
    </main>
  );
};

export default Analytics;
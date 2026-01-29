import { useState, useEffect, useMemo, useRef } from "react";
import { TrendingUp, Users, Target, Loader2, Wrench } from "lucide-react";
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

  // Données Brutes (Source de vérité)
  const [toolsList, setToolsList] = useState<Tool[]>([]);
  const [staffList, setStaffList] = useState<User[]>([]);
  const [assignmentsList, setAssignmentsList] = useState<UserTool[]>([]);
  
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  
  const isFirstRun = useRef(true);

  // Chargement API unique (On charge TOUT une fois, ensuite on filtre en local)
  useEffect(() => {
    const fetchData = async () => {
      if (!isFirstRun.current) setIsRefetching(true);
      try {
        const [toolsData, staffData, assignmentsData] = await Promise.all([
          getTools(),
          getUsers(),
          getUserTools(),
        ]);

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
  }, []);

  // Logique de filtrage
  const filteredTools = useMemo(() => {
    // Si la liste est vide, on renvoie vide
    if (!toolsList.length) return [];

    // On calcule la date limite en fonction du sélecteur
    const now = new Date();
    const limitDate = new Date();

    switch (timeRange) {
      case '30d':
        limitDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        limitDate.setDate(now.getDate() - 90);
        break;
      case '12m':
        limitDate.setMonth(now.getMonth() - 12);
        break;
    }

    // Le filtre : On garde l'outil si 'created_at' OU 'updated_at' est dans la période
    return toolsList.filter(tool => {
      const created = tool.created_at ? new Date(tool.created_at) : null;
      const updated = tool.updated_at ? new Date(tool.updated_at) : null;

      const isRecentCreation = created && created >= limitDate;
      const isRecentUpdate = updated && updated >= limitDate;

      // Si aucune date n'existe, l'outil est exclu des vues courtes
      return isRecentCreation || isRecentUpdate;
    });
  }, [toolsList, timeRange]);


  // Préparation des données Charts
  const chartData = useMemo(() => {
    // On travaille sur le sous-ensemble filtré
    const sourceData = filteredTools; 

    if (!sourceData.length) return { costData: [], deptData: [], topData: [] };

    const totalCurrent = sourceData.reduce((acc, t) => acc + (Number(t.monthly_cost) || 0), 0);
    const totalPrevious = sourceData.reduce((acc, t) => acc + (Number(t.previous_month_cost) || 0), 0);
    
    const costData = [
      { name: "Previous", total: totalPrevious },
      { name: "Current", total: totalCurrent },
    ];

    const deptCounts = sourceData.reduce((acc: Record<string, number>, tool) => {
      const dept = tool.owner_department || "Unassigned";
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    const deptData = Object.entries(deptCounts).map(([name, total]) => ({
      name,
      total
    }));

    const topData = [...sourceData]
      .sort((a, b) => (b.monthly_cost || 0) - (a.monthly_cost || 0))
      .slice(0, 8)
      .map(t => ({
        name: t.name,
        total: t.monthly_cost || 0
      }));

    return { costData, deptData, topData };
  }, [filteredTools]);

  // Calcul des KPIs
  const stats = useMemo(() => {
    const sourceData = filteredTools;

    // Protection contre les données vides
    if (!sourceData.length || !staffList.length) {
        return { budget: 0, budgetTrend: "0%", activeTools: 0, costPerUser: 0, costPerUserTrend: "€0", adoption: 0 };
    }

    // Budget des outils 
    const totalBudget = sourceData.reduce((acc, t) => acc + (Number(t.monthly_cost) || 0), 0);
    const totalPrevious = sourceData.reduce((acc, t) => acc + (Number(t.previous_month_cost) || 0), 0);
    
    // Tendance
    const budgetDiff = totalBudget - totalPrevious;
    const budgetTrend = totalPrevious > 0 
      ? `${budgetDiff > 0 ? '+' : ''}${((budgetDiff / totalPrevious) * 100).toFixed(1)}%` 
      : "0%";
    
    // Adoption : On doit filtrer les assignations pour ne compter que celles des outils affichés
    const visibleToolIds = new Set(sourceData.map(t => t.id));
    const relevantAssignments = assignmentsList.filter(a => visibleToolIds.has(a.tool_id));
    
    const totalActiveAccounts = relevantAssignments.length;
    const maxCapacity = staffList.length * sourceData.length;

    const realAdoptionRate = maxCapacity > 0 
        ? Math.round((totalActiveAccounts / maxCapacity) * 100) 
        : 0;

    // Coût par utilisateur (Budget Filtré / Total Employés)
    const currentCostPerUser = staffList.length > 0 ? Math.round(totalBudget / staffList.length) : 0;
    const previousCostPerUser = staffList.length > 0 ? Math.round(totalPrevious / staffList.length) : 0;
    
    const diffCostPerUser = currentCostPerUser - previousCostPerUser;
    const costPerUserTrend = `${diffCostPerUser > 0 ? '+' : ''}€${diffCostPerUser}`;

    return {
      budget: totalBudget,
      budgetTrend: budgetTrend,
      activeTools: sourceData.filter(t => t.status === "active").length,
      costPerUser: currentCostPerUser,
      costPerUserTrend: costPerUserTrend,
      adoption: Math.min(realAdoptionRate, 100)
    };
  }, [filteredTools, staffList, assignmentsList]);

  if (isInitialLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <main className={`p-6 md:p-12 flex flex-col min-h-[calc(100vh-6rem)] transition-opacity duration-300 ${isRefetching ? 'opacity-60' : 'opacity-100'}`}>
      
      {/* En-tête avec Sélecteur Actif */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-2">
          <h1 className={`text-3xl md:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Analytics & Insights
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {/* Feedback utilisateur : on montre combien d'outils correspondent au filtre */}
            Showing analysis for <strong>{filteredTools.length} tools</strong> with data in the last {timeRange}.
          </p>
        </div>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} isDark={isDark} />
      </div>

      {/* État vide : Si aucun outil ne correspond au filtre 30d/90d */}
      {filteredTools.length === 0 ? (
        <div className={`text-center py-20 rounded-2xl border border-dashed ${isDark ? 'border-gray-800 text-gray-500' : 'border-gray-300 text-gray-400'}`}>
            <p className="text-lg font-medium">No activity found for this period.</p>
            <p className="text-sm mt-2">Try selecting a longer range (12m) to see more history.</p>
        </div>
      ) : (
        <>
          {/* Section KPI */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="aspect-video">
              <KPICard 
                title={timeRange === '12m' ? "Total Spend" : "Period Spend"} 
                value={`€${stats.budget.toLocaleString()}`} 
                subValue={timeRange === '12m' ? "/30k" : ""}
                trend={stats.budgetTrend} 
                icon={TrendingUp} 
                color="green" 
                progress={Math.min((stats.budget / 30000) * 100, 100)}
              />
            </div>
            <div className="aspect-video">
              <KPICard 
                title="Adoption Rate" 
                value={`${stats.adoption}%`} 
                trend={stats.adoption > 50 ? "Good" : "Low"} 
                icon={Target} 
                color="orange" 
              />
            </div>
            <div className="aspect-video">
              <KPICard 
                title="Active Tools" 
                value={stats.activeTools.toString()} 
                trend="active" 
                icon={Wrench} 
                color="blue" 
              />
            </div>
            <div className="aspect-video">
              <KPICard 
                title="Cost/User" 
                value={`€${stats.costPerUser}`} 
                trend={stats.costPerUserTrend} 
                icon={Users} 
                color="pink" 
              />
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Évolution mensuelle */}
            <div className={`min-h-75 rounded-2xl border ${isDark ? 'bg-black border-white/10 shadow-blue-500/5' : 'bg-white border-gray-200'} p-6 flex flex-col`}>
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Monthly Spend Evolution</h3>
              <div className="flex-1 h-full w-full">
                <CostEvolutionChart data={chartData.costData} isDark={isDark} />
              </div>
            </div>
            
            {/* Répartition par département */}
            <div className={`min-h-75 rounded-2xl border ${isDark ? 'bg-black border-white/10 shadow-purple-500/5' : 'bg-white border-gray-200'} p-6 flex flex-col`}>
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
            <div className={`lg:col-span-2 min-h-75 rounded-2xl border ${isDark ? 'bg-black border-white/10 shadow-blue-500/5' : 'bg-white border-gray-200'} p-6 flex flex-col`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Top Expensive Tools (In Period)
                </h3>
                <span className="text-xs text-gray-500">Filtered by {timeRange} activity</span>
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
        </>
      )}
    </main>
  );
};

export default Analytics;
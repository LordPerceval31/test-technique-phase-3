import { useState, useEffect, useMemo, useRef } from "react";
import { TrendingUp, Users, Target, Loader2, Wrench, Download } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Hook de navigation pour le drill-down
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
  const navigate = useNavigate();

  // 1. Définition des états (Sources de vérité)
  const [toolsList, setToolsList] = useState<Tool[]>([]);           // Liste des outils
  const [staffList, setStaffList] = useState<User[]>([]);           // Liste des collaborateurs
  const [assignmentsList, setAssignmentsList] = useState<UserTool[]>([]); // Table de liaison Users <-> Tools
  
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  
  const isFirstRun = useRef(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!isFirstRun.current) setIsRefetching(true);
      try {
        // Chargement parallèle des 3 sources de données critiques
        const [toolsData, staffData, assignmentsData] = await Promise.all([
          getTools(),
          getUsers(),
          getUserTools(),
        ]);

        setToolsList(toolsData);
        setStaffList(staffData);
        setAssignmentsList(assignmentsData);

      } catch (err) {
        console.error("Erreur critique lors du chargement Analytics :", err);
      } finally {
        setIsInitialLoading(false);
        setIsRefetching(false);
        isFirstRun.current = false;
      }
    };
    fetchData();
  }, []); 

  const handleDepartmentClick = (deptName: string) => {
    navigate(`/tools?department=${encodeURIComponent(deptName)}`);
  };

  const filteredTools = useMemo(() => {
    if (!toolsList.length) return [];

    const now = new Date();
    const limitDate = new Date();

    // Configuration de la fenêtre temporelle
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

    // Application du filtre sur les dates système
    return toolsList.filter(tool => {
      const created = tool.created_at ? new Date(tool.created_at) : null;
      const updated = tool.updated_at ? new Date(tool.updated_at) : null;

      const isRecentCreation = created && created >= limitDate;
      const isRecentUpdate = updated && updated >= limitDate;

      // Note : Si les dates sont manquantes (Legacy Data), l'outil est exclu des vues courtes par sécurité
      return isRecentCreation || isRecentUpdate;
    });
  }, [toolsList, timeRange]);

  const handleExportCSV = () => {
    if (!filteredTools.length) return;

    // 1. Définition des en-têtes du CSV
    const headers = ["ID", "Name", "Category", "Department", "Monthly Cost", "Status", "Last Updated"];
    
    // 2. Construction du contenu ligne par ligne
    const csvContent = [
      headers.join(","), // Première ligne : les titres
      ...filteredTools.map(tool => [
        tool.id,
        `"${tool.name}"`, // Guillemets pour gérer les espaces ou virgules dans les noms
        `"${tool.category}"`,
        `"${tool.owner_department}"`,
        tool.monthly_cost || 0,
        `"${tool.status}"`,
        `"${tool.updated_at || ''}"`
      ].join(","))
    ].join("\n");

    // 3. Création du Blob et déclenchement du téléchargement
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    // Nom du fichier dynamique incluant la date et le filtre
    link.setAttribute("download", `analytics_export_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartData = useMemo(() => {
    const sourceData = filteredTools; 

    if (!sourceData.length) return { costData: [], deptData: [], topData: [] };

    // Agrégation des coûts pour l'évolution
    const totalCurrent = sourceData.reduce((acc, t) => acc + (Number(t.monthly_cost) || 0), 0);
    const totalPrevious = sourceData.reduce((acc, t) => acc + (Number(t.previous_month_cost) || 0), 0);
    
    const costData = [
      { name: "Previous", total: totalPrevious },
      { name: "Current", total: totalCurrent },
    ];

    // Agrégation par département
    const deptCounts = sourceData.reduce((acc: Record<string, number>, tool) => {
      const dept = tool.owner_department || "Unassigned";
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    const deptData = Object.entries(deptCounts).map(([name, total]) => ({
      name,
      total
    }));

    // Top 8 des outils les plus coûteux sur la période
    const topData = [...sourceData]
      .sort((a, b) => (b.monthly_cost || 0) - (a.monthly_cost || 0))
      .slice(0, 8)
      .map(t => ({
        name: t.name,
        total: t.monthly_cost || 0
      }));

    return { costData, deptData, topData };
  }, [filteredTools]);


  const stats = useMemo(() => {
    const sourceData = filteredTools;

    // Protection contre les jeux de données vides ou partiels
    if (!sourceData.length || !staffList.length) {
        return { budget: 0, budgetTrend: "0%", activeTools: 0, costPerUser: 0, costPerUserTrend: "€0", adoption: 0 };
    }

    // 1. Calculs Financiers (Budget filtré)
    const totalBudget = sourceData.reduce((acc, t) => acc + (Number(t.monthly_cost) || 0), 0);
    const totalPrevious = sourceData.reduce((acc, t) => acc + (Number(t.previous_month_cost) || 0), 0);
    
    // Tendance budgétaire
    const budgetDiff = totalBudget - totalPrevious;
    const budgetTrend = totalPrevious > 0 
      ? `${budgetDiff > 0 ? '+' : ''}${((budgetDiff / totalPrevious) * 100).toFixed(1)}%` 
      : "0%";
    
    // Calcul d'Adoption (Précision : Liaisons réelles / Capacité théorique)
    // On isole les IDs des outils visibles pour ne compter que leurs assignations
    const visibleToolIds = new Set(sourceData.map(t => t.id));
    const relevantAssignments = assignmentsList.filter(a => visibleToolIds.has(a.tool_id));
    
    const totalActiveAccounts = relevantAssignments.length;
    const maxCapacity = staffList.length * sourceData.length; // Staff total * Outils filtrés

    const realAdoptionRate = maxCapacity > 0 
        ? Math.round((totalActiveAccounts / maxCapacity) * 100) 
        : 0;

    // Coût par Collaborateur (Headcount)
    // Formule : Budget Filtré / Nombre total d'employés
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

  // Affichage du loader pendant le montage initial
  if (isInitialLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <main className={`p-6 md:p-12 flex flex-col min-h-[calc(100vh-6rem)] transition-opacity duration-300 ${isRefetching ? 'opacity-60' : 'opacity-100'}`}>
      
      {/* En-tête : Titre et Sélecteur de Période */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-2">
          <h1 className={`text-3xl md:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Analytics & Insights
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {/* Feedback utilisateur sur le volume de données analysées */}
            Showing analysis for <strong>{filteredTools.length} tools</strong> with data in the last {timeRange}.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} isDark={isDark} />
            <button
              onClick={handleExportCSV}
              disabled={filteredTools.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all shadow-lg cursor-pointer hover:-translate-y-0.5 ${
              isDark 
                ? 'bg-white/10 hover:bg-white/20 text-white disabled:opacity-50 disabled:hover:translate-y-0' 
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 disabled:opacity-50 disabled:hover:translate-y-0'
              }`}
              title="Download CSV report"
            >
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
            </button>
            
        </div>
      </div>

      {/* État vide : Feedback si aucun outil ne correspond au filtre temporel */}
      {filteredTools.length === 0 ? (
        <div className={`text-center py-20 rounded-2xl border border-dashed ${isDark ? 'border-gray-800 text-gray-500' : 'border-gray-300 text-gray-400'}`}>
            <p className="text-lg font-medium">No activity found for this period.</p>
            <p className="text-sm mt-2">Try selecting a longer range (12m) to see more history.</p>
        </div>
      ) : (
        <>
          {/* Section KPI : Indicateurs de performance */}
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

          {/* Grille des Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Évolution des dépenses mensuelles */}
            <div className={`min-h-75 rounded-2xl border ${isDark ? 'bg-black border-white/10 shadow-blue-500/5' : 'bg-white border-gray-200'} p-6 flex flex-col`}>
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Monthly Spend Evolution</h3>
              <div className="flex-1 h-full w-full">
                <CostEvolutionChart data={chartData.costData} isDark={isDark} />
              </div>
            </div>
            
            {/* Répartition des coûts par département  */}
            <div className={`min-h-75 rounded-2xl border ${isDark ? 'bg-black border-white/10 shadow-purple-500/5' : 'bg-white border-gray-200'} p-6 flex flex-col`}>
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Department Cost Breakdown</h3>
              <div className="flex-1 h-full w-full">
                {isRefetching ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="animate-spin text-purple-500" />
                  </div>
                ) : (
                  <DepartmentBreakdownChart 
                    data={chartData.deptData} 
                    isDark={isDark}
                    onDepartmentClick={handleDepartmentClick} 
                  />
                )}
              </div>
            </div>

            {/* Classement des outils les plus coûteux */}
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
import * as React from "react";
import { Loader2, AlertCircle, Plus } from "lucide-react";
import type { Tool } from "../utils/interfaces";
import { getTools, createTool, updateTool, deleteTool, type NewToolPayload } from "../utils/api";
import ToolFilters from "../components/toolFilter";
import RecentTools from "../components/recentTools";
import { useMemo, useState, useEffect } from "react";
import ToolCard from "../components/toolCard";
import ToolEditModal from "../components/toolEditModal";
import ToolViewModal from "../components/toolViewModal";

interface ToolsProps {
  isDark: boolean;
}

const Tools: React.FC<ToolsProps> = ({ isDark }) => {

  // Etat des données
  // Stockage de la liste brute venant de l'API et états de chargement
  const [toolsData, setToolsData] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Etat des modales
  // Gestion de l'ouverture/fermeture et de l'outil en cours d'édition
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [viewingTool, setViewingTool] = useState<Tool | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Etat des filtres
  // Critères pour trier et filtrer la liste affichée
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<Tool["status"] | "All">("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [minCost, setMinCost] = useState<number | "">("");
  const [maxCost, setMaxCost] = useState<number | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Chargement des donénes
  const refreshData = React.useCallback(() => {
    getTools()
      .then((data) => {
        setToolsData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setError("Impossible de charger les outils.");
        setLoading(false);
      });
  }, []);

  // Appel initial au montage du composant
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  
  // Création : On reçoit le payload du formulaire et on l'envoie à l'API
  const handleCreate = async (toolData: NewToolPayload | Partial<Tool>) => {
    await createTool(toolData as NewToolPayload);
    refreshData(); // On rafraîchit la liste pour voir le nouvel outil
  };

  // Mise à jour : On utilise l'ID de l'outil en cours d'édition
  const handleUpdate = async (toolData: NewToolPayload | Partial<Tool>) => {
    if (editingTool) {
      await updateTool(editingTool.id, toolData);
      refreshData();
    }
  };

  // Suppression : Avec confirmation navigateur simple
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this tool?")) {
      await deleteTool(id);
      refreshData();
    }
  };

  const handleToggleStatus = async (tool: Tool) => {
    // Si c'est 'unused', on repasse en 'active'. Sinon (active/expiring), on passe en 'unused'.
    const newStatus: Tool["status"] = tool.status === 'unused' ? 'active' : 'unused';
    
    // On met à jour via l'API (patch)
    await updateTool(tool.id, { status: newStatus });
    
    // On rafraichit l'affichage
    refreshData();
  };
  
  // Ouvre la modale en mode création
  const openCreateModal = () => {
    setEditingTool(null);
    setIsModalOpen(true);
  };

  // Ouvre la modale en mode édition
  const openEditModal = (tool: Tool) => {
    setEditingTool(tool);
    setIsModalOpen(true);
  };

  // Ouvre la modale en mode view
  const openViewModal = (tool: Tool) => {
    setViewingTool(tool);
    setIsViewModalOpen(true);
};

  // Utilisation de useMemo pour ne recalculer que si les données ou filtres changent
  const filteredTools: Tool[] = useMemo(() => {
    return toolsData
      .filter((tool: Tool) => {
        // Filtre par recherche texte
        const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase());
        // Filtre par département
        const matchesDept = selectedDept === "All" || tool.owner_department === selectedDept;
        // Filtre par statut
        const matchesStatus = selectedStatus === "All" || tool.status === selectedStatus;
        // Filtre par catégorie
        const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;

        // Filtre par fourchette de prix
        const cost = tool.monthly_cost || 0;
        const matchesMin = minCost === "" || cost >= minCost;
        const matchesMax = maxCost === "" || cost <= maxCost;

        return matchesSearch && matchesDept && matchesStatus && matchesCategory && matchesMin && matchesMax;
      })
      .sort((a: Tool, b: Tool) => {
        // Tri par coût mensuel
        const costA = a.monthly_cost || 0;
        const costB = b.monthly_cost || 0;
        return sortOrder === "asc" ? costA - costB : costB - costA;
      });
  }, [toolsData, searchTerm, selectedDept, selectedStatus, selectedCategory, sortOrder, minCost, maxCost]);

  // Affichage des états de chargement ou erreur
  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500 gap-2"><AlertCircle /> {error}</div>;

  return (
    <main className="p-6 md:p-12 flex flex-col min-h-[calc(100vh-6rem)]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="flex flex-col text-center lg:text-left space-y-2">
          <h2 className={`text-3xl md:text-4xl font-bold tracking-tight transition-colors cursor-default ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Tools Catalog
          </h2>
          <h2 className={`text-base md:text-lg font-normal transition-colors cursor-default ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage and discover {filteredTools.length} tools across your organization
          </h2>
        </div>

        <button 
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-linear-to-br from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus size={20} />
          Add Tool
        </button>
      </div>

      {/* barre de filtre */}
      <ToolFilters 
        isDark={isDark}
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        selectedDept={selectedDept} setSelectedDept={setSelectedDept}
        selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}
        selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
        minCost={minCost} setMinCost={setMinCost}
        maxCost={maxCost} setMaxCost={setMaxCost}

        sortOrder={sortOrder} setSortOrder={setSortOrder}
        viewMode={viewMode} setViewMode={setViewMode}
      />

      {/* affichage grille ou liste */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard 
              key={tool.id} 
              tool={tool} 
              isDark={isDark} 
              onEdit={openEditModal} 
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              onView={openViewModal}
            />
          ))}
        </div>
      ) : (
        <div className={`rounded-xl border ${isDark ? "border-white/10 bg-black" : "border-gray-200 bg-white"}`}>
            <RecentTools tools={filteredTools} showHeader={false} />
        </div>
      )}

      {/* La modale d'édition ou de création */}
      <ToolEditModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingTool ? handleUpdate : handleCreate}
        initialData={editingTool}
        isDark={isDark}
      />
      {/* La modale pour voir un outil */}
      <ToolViewModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        tool={viewingTool}
        isDark={isDark}
    />
    </main>
  );
};

export default Tools;
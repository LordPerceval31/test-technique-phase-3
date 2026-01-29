import * as React from "react";
import { Loader2, AlertCircle, Plus, Trash2, Power, CheckCircle } from "lucide-react";
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

  // état des donnees
  const [toolsData, setToolsData] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // état des modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [viewingTool, setViewingTool] = useState<Tool | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // état des filtres
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<Tool["status"] | "All">("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [minCost, setMinCost] = useState<number | "">("");
  const [maxCost, setMaxCost] = useState<number | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // état des actions de masse (bulk)
  const [selectedToolIds, setSelectedToolIds] = useState<number[]>([]);

  // chargement des donnees depuis l'api
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

  // appel initial au montage du composant
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  
  // creation d'un outil : reception du payload et envoi a l'api
  const handleCreate = async (toolData: NewToolPayload | Partial<Tool>) => {
    await createTool(toolData as NewToolPayload);
    refreshData(); // rafraichissement pour inclure le nouvel outil
  };

  // mise a jour d'un outil existant via son identifiant
  const handleUpdate = async (toolData: NewToolPayload | Partial<Tool>) => {
    if (editingTool) {
      await updateTool(editingTool.id, toolData);
      refreshData();
    }
  };

  // suppression unitaire avec confirmation utilisateur
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this tool?")) {
      await deleteTool(id);
      refreshData();
    }
  };

  // bascule rapide du statut (active <-> unused)
  const handleToggleStatus = async (tool: Tool) => {
    const newStatus: Tool["status"] = tool.status === 'unused' ? 'active' : 'unused';
    await updateTool(tool.id, { status: newStatus });
    refreshData();
  };
  
  // ouverture de la modale en mode creation 
  const openCreateModal = () => {
    setEditingTool(null);
    setIsModalOpen(true);
  };

  // ouverture de la modale en mode edition 
  const openEditModal = (tool: Tool) => {
    setEditingTool(tool);
    setIsModalOpen(true);
  };

  // ouverture de la modale de visualisation details
  const openViewModal = (tool: Tool) => {
    setViewingTool(tool);
    setIsViewModalOpen(true);
  };

  // filtrage et tri des outils : recalcul uniquement si les dependances changent (useMemo)
  const filteredTools: Tool[] = useMemo(() => {
    return toolsData
      .filter((tool: Tool) => {
        const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = selectedDept === "All" || tool.owner_department === selectedDept;
        const matchesStatus = selectedStatus === "All" || tool.status === selectedStatus;
        const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;

        const cost = tool.monthly_cost || 0;
        const matchesMin = minCost === "" || cost >= minCost;
        const matchesMax = maxCost === "" || cost <= maxCost;

        return matchesSearch && matchesDept && matchesStatus && matchesCategory && matchesMin && matchesMax;
      })
      .sort((a: Tool, b: Tool) => {
        const costA = a.monthly_cost || 0;
        const costB = b.monthly_cost || 0;
        return sortOrder === "asc" ? costA - costB : costB - costA;
      });
  }, [toolsData, searchTerm, selectedDept, selectedStatus, selectedCategory, sortOrder, minCost, maxCost]);

  // gestion de la selection unitaire pour les actions de masse
  const handleSelectTool = (id: number) => {
    setSelectedToolIds(prev => 
      prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
    );
  };

  // selection globale ou deselection de tous les elements visibles
   const handleSelectAll = () => {
     if (selectedToolIds.length === filteredTools.length && filteredTools.length > 0) {
       setSelectedToolIds([]); 
     } else {
       setSelectedToolIds(filteredTools.map(t => t.id));
     }
   };

  // simulation de suppression de masse (pas d'appel api reel pour la securite ici)
  const handleBulkDelete = () => {
    if (window.confirm(`SIMULATION: Delete ${selectedToolIds.length} tools?\n(This will not affect the database)`)) {
      alert(`✅ Success (Simulation): ${selectedToolIds.length} tools deleted.`);
      setSelectedToolIds([]);
    }
  };

  // mise a jour de statut en masse via promesses paralleles
  const handleBulkStatus = async (newStatus: Tool["status"]) => {
      try {
          const promises = selectedToolIds.map(id => updateTool(id, { status: newStatus }));
          await Promise.all(promises);

          refreshData();
          setSelectedToolIds([]); 
      } catch (err) {
          console.error("Bulk update error", err);
          alert("Error updating some tools.");
      }
  };

  // affichage conditionnel : chargement ou erreur
  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500 gap-2"><AlertCircle /> {error}</div>;

  const allSelected = filteredTools.length > 0 && selectedToolIds.length === filteredTools.length;

  return (
    <main className="p-6 md:p-12 flex flex-col min-h-[calc(100vh-6rem)]">
      
      {/* en-tete de page avec titre et bouton d'ajout */}
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

      {/* barre de filtres et controles d'affichage */}
      <ToolFilters 
        isDark={isDark}
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        selectedDept={selectedDept} setSelectedDept={setSelectedDept}
        selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}
        selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
        minCost={minCost} setMinCost={setMinCost}
        maxCost={maxCost} setMaxCost={setMaxCost}
        onSelectAll={handleSelectAll}
        allSelected={allSelected}
        sortOrder={sortOrder} setSortOrder={setSortOrder}
        viewMode={viewMode} setViewMode={setViewMode}
      />

      {/* affichage principal : mode grille ou mode liste */}
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
              onSelect={handleSelectTool}
              isSelected={selectedToolIds.includes(tool.id)}
            />
          ))}
        </div>
      ) : (
        <div className={`rounded-xl border ${isDark ? "border-white/10 bg-black" : "border-gray-200 bg-white"}`}>
            <RecentTools 
              tools={filteredTools} 
              showHeader={false}
              showActions={true} 
              onSelect={handleSelectTool}
              selectedIds={selectedToolIds}
              onToggleStatus={handleToggleStatus}
              onEdit={openEditModal}
              onDelete={handleDelete}/>
        </div>
      )}

      {/* modales pour l'edition et la visualisation */}
      <ToolEditModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingTool ? handleUpdate : handleCreate}
        initialData={editingTool}
        isDark={isDark}
      />
      <ToolViewModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        tool={viewingTool}
        isDark={isDark}
    />

    {/* barre d'action flottante pour les operations de masse */}
    {selectedToolIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div className={`flex items-center gap-4 pl-6 pr-2 py-2 rounded-full shadow-2xl border ${isDark ? "bg-[#18181b] border-white/10 text-white" : "bg-white border-gray-200 text-gray-900"}`}>
                
                {/* compteur de selection */}
                <div className="flex items-center gap-2 font-medium whitespace-nowrap">
                    <span className="bg-linear-to-br from-blue-600 to-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        {selectedToolIds.length}
                    </span>
                    <span className="text-sm">selected</span>
                </div>

                <div className={`h-6 w-px ${isDark ? "bg-white/10" : "bg-gray-200"}`}></div>

                {/* boutons d'action rapide sur la selection */}
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setSelectedToolIds([])} 
                        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer ${isDark ? "hover:bg-white/10 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => handleBulkStatus('active')}
                        className="px-3 py-1.5 text-xs font-bold rounded-full bg-linear-to-br from-green-500 to-emerald-800 text-white shadow-emerald-500/20 hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
                    >
                        <CheckCircle size={12} />
                        Active
                    </button>
                    <button 
                        onClick={() => handleBulkStatus('unused')}
                        className="px-3 py-1.5 text-xs font-bold rounded-full bg-linear-to-br from-red-500 to-red-800 text-white hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
                    >
                        <Power size={12} />
                        Unused
                    </button>
                    <button 
                        onClick={handleBulkDelete}
                        className="px-4 py-1.5 text-sm font-medium rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-2 cursor-pointer shadow-red-500/20 shadow-lg"
                    >
                        <Trash2 size={14} />
                        Delete
                    </button>
                </div>
            </div>
        </div>
      )}

    </main>
  );
};
export default Tools;
import * as React from "react";
import { Search, ArrowUpDown, LayoutGrid, List, ChevronDown, CheckSquare, Square } from "lucide-react";
import type { Tool } from "../utils/interfaces";
import type { ChangeEvent } from "react";

type ToolStatus = Tool["status"] | "All";


interface ToolFiltersProps {
  isDark: boolean;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedDept: string;
  setSelectedDept: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedStatus: ToolStatus;
  setSelectedStatus: (val: ToolStatus) => void;
  minCost: number | "";
  setMinCost: (val: number | "") => void;
  maxCost: number | "";
  setMaxCost: (val: number | "") => void;
  onSelectAll: () => void;
  allSelected: boolean;
  sortOrder: "asc" | "desc";
  setSortOrder: (val: "asc" | "desc") => void;
  viewMode: "grid" | "list";
  setViewMode: (val: "grid" | "list") => void;
}


const FocusGradient: React.FC = () => (
  <div className="absolute -inset-0.5 rounded-lg bg-linear-to-br from-blue-600 to-purple-600 opacity-0 group-focus-within:opacity-100 transition-all duration-300 z-0 blur-[1px]"></div>
);

const ToolFilters: React.FC<ToolFiltersProps> = ({
  isDark,
  searchTerm,
  setSearchTerm,
  selectedDept,
  setSelectedDept,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  minCost,
  setMinCost,
  maxCost,
  setMaxCost,
  sortOrder,
  setSortOrder,
  viewMode,
  setViewMode,
  onSelectAll,
  allSelected
}) => {
  
  // listes statiques pour les options de filtrage
  const departments: string[] = ["All", "Engineering", "Design", "Marketing", "Communication", "Operations", "HR"];
  const categories: string[] = ["All", "Development", "Design", "Communication", "Productivity", "Project Management", "Security", "Finance", "Sales & Marketing", "HR", "Analytics"];
  const statuses: ToolStatus[] = ["All", "active", "expiring", "unused"];


  const baseInputStyles: string = `h-10 px-3 rounded-lg border transition-all outline-none relative z-10 ${
    isDark 
      ? "bg-black border-white/10 text-white placeholder-gray-500 focus:border-transparent" 
      : "bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-transparent"
  }`;

  return (
    <div className={`flex flex-col xl:flex-row gap-4 items-center justify-between p-5 rounded-xl border mb-8 transition-colors ${
      isDark ? "bg-black/40 border-white/10 shadow-2xl" : "bg-white border-gray-200 shadow-sm"
    }`}>
      
      {/* section gauche : recherche textuelle et selection globale */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
        
        {/* champ de recherche avec icône */}
        <div className="relative w-full xl:w-64 group">
            <FocusGradient />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-20 group-focus-within:text-blue-500 transition-colors" />
            <input
            type="text"
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className={`${baseInputStyles} w-full pl-10`}
            />
        </div>
        
        {/* bouton de selection/deselection de masse */}
        <button 
                onClick={onSelectAll}
                className={`flex items-center gap-2 h-10 px-3 text-sm font-medium transition-all cursor-pointer whitespace-nowrap w-full sm:w-auto justify-center
                ${isDark 
                    ? " text-gray-300" 
                    : " text-gray-700"
                }`}
            >
                {allSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                {allSelected ? "Deselect All" : "Select All"}
            </button>
        </div>

      {/* section droite : filtres avancés et tris */}
      <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-end">
        
        {/* filtre par fourchette de prix (min/max) */}
        <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold tracking-widest text-gray-500">Cost range</span>
            <div className="relative group w-24">
                <FocusGradient />
                <input
                    type="number"
                    placeholder="Min €"
                    value={minCost}
                    onChange={(e) => setMinCost(e.target.value === "" ? "" : Number(e.target.value))}
                    className={`${baseInputStyles} w-full text-sm`}
                    min="0"
                />
            </div>
            <span className="text-gray-400">-</span>
            <div className="relative group w-24">
                <FocusGradient />
                <input
                    type="number"
                    placeholder="Max €"
                    value={maxCost}
                    onChange={(e) => setMaxCost(e.target.value === "" ? "" : Number(e.target.value))}
                    className={`${baseInputStyles} w-full text-sm`}
                    min="0"
                />
            </div>
        </div>

        {/* filtre par département */}
        <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest text-gray-500">Department</span>

            <div className="relative group">
            <FocusGradient />
            <select
                value={selectedDept}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedDept(e.target.value)}
                className={`${baseInputStyles} text-sm cursor-pointer pl-3 pr-10 appearance-none`}
            >
                {departments.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
            </select>
            <ChevronDown 
                size={14} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-20 group-focus-within:text-blue-500 transition-colors" 
            />
            </div>
        </div>

         {/* filtre par catégorie */}
        <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest text-gray-500">Category</span>

            <div className="relative group">
            <FocusGradient />
            <select
                value={selectedCategory}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
                className={`${baseInputStyles} text-sm cursor-pointer pl-3 pr-10 appearance-none`}
            >
                {categories.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
            </select>
            <ChevronDown 
                size={14} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-20 group-focus-within:text-blue-500 transition-colors" 
            />
            </div>
        </div>

        {/* filtre par statut (actif, expirant, inutilisé) */}
        <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold tracking-widest text-gray-500">Status</span>
        <div className="relative group">
            <FocusGradient />
            
            <select
            value={selectedStatus}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value as ToolStatus)}
            className={`${baseInputStyles} text-sm cursor-pointer pl-3 pr-10 appearance-none capitalize`}
            >
            {statuses.map((status) => (
                <option key={status} value={status}>
                {status}
                </option>
            ))}
            </select>
            <ChevronDown 
            size={14} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-20 group-focus-within:text-blue-500 transition-colors" 
            />
        </div>
        </div>

        {/* bouton de tri par prix (ascendant/descendant) */}
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className={`flex items-center gap-2 h-10 px-4 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
            isDark ? "border-white/10 hover:bg-white/5 text-gray-300" : "border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm"
          }`}
        >
          <ArrowUpDown size={16} className={`transition-transform duration-300 ${sortOrder === "desc" ? "rotate-180" : ""}`} />
          Price
        </button>

        {/* bascule du mode d'affichage (grille vs liste) */}
        <div className={`flex p-1 rounded-lg border ${isDark ? "bg-white/5 border-white/5" : "bg-gray-100 border-gray-200"}`}>
          <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md transition-all cursor-pointer ${viewMode === "grid" ? (isDark ? "bg-white/10 text-white shadow-inner" : "bg-white text-blue-600 shadow-sm") : "text-gray-400"}`}>
            <LayoutGrid size={18} />
          </button>
          <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-all cursor-pointer ${viewMode === "list" ? (isDark ? "bg-white/10 text-white shadow-inner" : "bg-white text-blue-600 shadow-sm") : "text-gray-400"}`}>
            <List size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolFilters;
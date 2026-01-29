import { useState } from "react";
import { Calendar, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Check, ExternalLink, Edit, Power, Play, Trash2 } from "lucide-react";
import type { Tool } from "../utils/interfaces";
import { getStatusStyles } from "../styles/statusColors";

const ITEMS_PER_PAGE = 10;

interface RecentToolsProps {
  tools?: Tool[];
  showHeader?: boolean;
  showActions?: boolean;
  
  // props pour la gestion de la sélection multiple
  selectedIds?: number[];
  onSelect?: (id: number) => void;

  // props pour les interactions unitaires (édition, suppression, statut)
  onEdit?: (tool: Tool) => void;
  onDelete?: (id: number) => void;
  onToggleStatus?: (tool: Tool) => void;
}

const RecentTools = ({ 
  tools = [], 
  showHeader = true, 
  showActions = false,
  selectedIds = [],
  onSelect,
  onEdit,
  onDelete,
  onToggleStatus
}: RecentToolsProps) => {
  
  // gestion de l'état du tri et de la page actuelle
  const [sortConfig, setSortConfig] = useState<{ key: keyof Tool; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const displayData = tools || [];

  // logique de tri déclenchée au clic sur les en-têtes de colonnes
  const handleSort = (key: keyof Tool) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  // application du tri sur les données avant l'affichage
  const sortedTools = [...displayData].sort((a: Tool, b: Tool) => {
    if (!sortConfig) return 0;
    const sortKey = sortConfig.key as keyof Tool;
    const direction = sortConfig.direction;
    if (a[sortKey] < b[sortKey]) return direction === "asc" ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return direction === "asc" ? 1 : -1;
    return 0;
  });

  // calcul des indices pour la pagination stricte par 10 éléments
  const totalPages = Math.ceil(sortedTools.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTools = sortedTools.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // rendu de l'icône de tri dynamique
  const renderSortIcon = (columnKey: keyof Tool) => {
    if (sortConfig?.key !== columnKey) return null;
    return sortConfig.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  // affichage d'un état vide si aucune donnée n'est présente
  if (displayData.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-white/10">
        No tools data available.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4 bg-white dark:bg-black pt-8 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-300">
      
      {showHeader && (
        <div className="flex items-center justify-between px-1 shrink-0 w-[95%] mx-auto">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white">Recent Tools</h2>
          <button className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2">
             <Calendar size={16} className="opacity-70" /> 
             Last 30 days
          </button>
        </div>
      )}

      <div className="flex-1 rounded-xl bg-white dark:bg-black overflow-hidden flex flex-col w-[95%] mx-auto cursor-default">
        <div className="overflow-x-auto h-full">
            <table className="w-full min-w-200 text-left text-sm h-full border-collapse table-fixed">
                <thead className="text-gray-500 dark:text-gray-400 sticky top-0 z-10 bg-white dark:bg-black">
                <tr>
                    {/* affichage conditionnel de la colonne de sélection */}
                    {onSelect && (
                        <th className="w-12.5 px-6 pt-10 pb-6 border-b border-gray-100 dark:border-white/5"></th>
                    )}

                    <th className="w-[25%] px-6 pt-10 pb-6 font-medium border-b border-gray-100 dark:border-white/5 select-none cursor-pointer" onClick={() => handleSort("name")}>
                        <div className="flex items-center gap-2">Tool {renderSortIcon("name")}</div>
                    </th>
                    <th className="w-[15%] px-6 pt-10 pb-6 font-medium border-b border-gray-100 dark:border-white/5 select-none cursor-pointer" onClick={() => handleSort("owner_department")}>
                        <div className="flex items-center gap-2">Department {renderSortIcon("owner_department")}</div>
                    </th>
                    <th className="w-[15%] px-6 pt-10 pb-6 font-medium border-b border-gray-100 dark:border-white/5 select-none cursor-pointer" onClick={() => handleSort("active_users_count")}>
                        <div className="flex items-center gap-2">Users {renderSortIcon("active_users_count")}</div>
                    </th>
                    <th className="w-[15%] px-6 pt-10 pb-6 font-medium border-b border-gray-100 dark:border-white/5 select-none cursor-pointer" onClick={() => handleSort("monthly_cost")}>
                        <div className="flex items-center gap-2">Cost {renderSortIcon("monthly_cost")}</div>
                    </th>
                    <th className="w-[15%] px-6 pt-10 pb-6 font-medium border-b border-gray-100 dark:border-white/5 select-none cursor-pointer" onClick={() => handleSort("status")}>
                        <div className="flex items-center gap-2">Status {renderSortIcon("status")}</div>
                    </th>
                    
                    {/* en-tête des actions visible uniquement en mode catalogue */}
                    {showActions && (
                        <th className="w-40 px-6 pt-10 pb-6 font-medium border-b border-gray-100 dark:border-white/5 text-right">
                            Actions
                        </th>
                    )}
                </tr>
                </thead>
                <tbody>
                {paginatedTools.map((tool) => {
                    const isSelected = selectedIds.includes(tool.id);
                    const isInactive = tool.status === 'unused';

                    return (
                        <tr key={tool.id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0">
                            
                            {/* cellule de la checkbox avec apparition au survol de la ligne */}
                            {onSelect && (
                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                    <div 
                                        onClick={() => onSelect(tool.id)}
                                        className={`w-5 h-5 rounded border cursor-pointer flex items-center justify-center transition-all duration-200
                                            ${isSelected 
                                                ? "bg-linear-to-br from-blue-600 to-purple-600 border-transparent opacity-100 shadow-md" 
                                                : "bg-white dark:bg-black border-gray-300 dark:border-white/20 opacity-0 group-hover:opacity-100 hover:border-blue-500"
                                            }
                                        `}
                                    >
                                        {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                                    </div>
                                </td>
                            )}

                            {/* informations principales de l'outil et icône */}
                            <td className="px-6 py-4 truncate">
                                <div className="flex items-center gap-3">
                                <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-white/5 p-1">
                                    <img 
                                    src={tool.icon_url} 
                                    alt={tool.name} 
                                    className="w-full h-full object-contain"
                                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${tool.name}&background=random&color=fff` }}
                                    />
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white truncate">{tool.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400 truncate">{tool.owner_department}</td>
                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400 truncate">{tool.active_users_count}</td>
                            <td className="px-6 py-4 text-gray-900 dark:text-white font-medium truncate">€{(tool.monthly_cost || 0).toLocaleString()}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs capitalize ${getStatusStyles(tool.status)}`}>
                                {tool.status}
                                </span>
                            </td>

                            {/* section des boutons d'action unitaires */}
                            {showActions && (
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                        
                                        {/* lien vers le site externe de l'outil */}
                                        <a 
                                            href={tool.website_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="p-1.5 rounded-md text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                            title="Visit Website"
                                        >
                                            <ExternalLink size={16} />
                                        </a>

                                        {/* bouton d'édition de la fiche outil */}
                                        {onEdit && (
                                            <button 
                                                onClick={() => onEdit(tool)} 
                                                className="p-1.5 rounded-md text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                        )}

                                        {/* bascule d'activation/désactivation de l'outil */}
                                        {onToggleStatus && (
                                            <button 
                                                onClick={() => onToggleStatus(tool)} 
                                                className={`p-1.5 rounded-md transition-colors ${isInactive ? "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20" : "text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"}`} 
                                                title={isInactive ? "Enable" : "Disable"}
                                            >
                                                {isInactive ? <Play size={16} /> : <Power size={16} />}
                                            </button>
                                        )}

                                        {/* bouton de suppression définitive */}
                                        {onDelete && (
                                            <button 
                                                onClick={() => onDelete(tool.id)} 
                                                className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
        
        {/* contrôles de navigation pour la pagination */}
        <div className="flex items-center justify-center gap-4 py-4 border-t border-gray-100 dark:border-white/5">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30"><ChevronLeft size={18} /></button>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Page <span className="text-gray-900 dark:text-white">{currentPage}</span> of {totalPages || 1}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30"><ChevronRight size={18} /></button>
        </div>
      </div>
    </div>
  );
};

export default RecentTools;
import { useState } from "react";
import { Calendar, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { RECENT_TOOLS } from "../utils/mocks";
import type { Tool } from "../utils/interfaces";

const ITEMS_PER_PAGE = 10;

const getStatusStyles = (status: Tool["status"]) => {
  switch (status) {
    case "active":
      return "bg-gradient-to-br from-green-500 to-emerald-800 text-white shadow-emerald-500/20";
    case "expiring":
      return "bg-gradient-to-br from-orange-400 to-red-800 text-white shadow-orange-500/20";
    case "unused":
      return "bg-gradient-to-br from-red-500 to-red-800 text-white shadow-orange-500/20";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

const RecentTools = () => {
  // Gère l'état du tri (quelle colonne et quelle direction)
  const [sortConfig, setSortConfig] = useState<{ key: keyof Tool; direction: "asc" | "desc" } | null>(null); // il peut être null parce on n'en défini pas par défaut
  const [currentPage, setCurrentPage] = useState(1); // On commence à la page 1

  // Fonction pour changer la configuration de tri
  const handleSort = (key: keyof Tool) => {
    let direction: "asc" | "desc" = "asc";
    // Si on clique sur la même colonne, on change de sens
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    // On sauvegarde la nouvelle configuration
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  // Fonction pour trier le nouveau tableau d'outils
  const sortedTools = [...RECENT_TOOLS].sort((a: Tool, b: Tool) => {
    if (!sortConfig) return 0;
    
    // Le mot clé
    const sortKey = sortConfig.key as keyof Tool;
    // La direction (ASC ou DESC)
    const direction = sortConfig.direction;

    const valueA = a[sortKey];
    const valueB = b[sortKey];

    // Comparaison pour les chaînes de caractères
    if (typeof valueA === "string" && typeof valueB === "string") {
      return direction === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    // Comparaison pour les nombres
    if (valueA < valueB) return direction === "asc" ? -1 : 1;
    if (valueA > valueB) return direction === "asc" ? 1 : -1;
    
    return 0;
  });

  // Calcul pour connaitre le nombre de page
  const totalPages = Math.ceil(sortedTools.length / ITEMS_PER_PAGE);

  // Calcul de l'index de départ pour la currentPage
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  // Le slice sert à découper le tableau pour afficher nos 10 éléments par page
  const paginatedTools = sortedTools.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Fonction pour mettre le bon chevron suivant l'ordre choisi
  const renderSortIcon = (columnKey: keyof Tool) => {
    if (sortConfig?.key !== columnKey) return null;
    return sortConfig.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <div className="h-full flex flex-col gap-4 bg-white dark:bg-black pt-8 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-300">
      
      <div className="flex items-center justify-between px-1 shrink-0 w-[95%] mx-auto">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white cursor-default">Recent Tools</h2>
        <button className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2">
           <Calendar size={16} className="opacity-70" /> 
           Last 30 days
        </button>
      </div>

      <div className="flex-1 rounded-xl bg-white dark:bg-black overflow-hidden flex flex-col w-[95%] mx-auto cursor-default">
        <div className="overflow-x-auto h-full">
          <table className="w-full text-left text-sm h-full border-collapse table-fixed">
            
            <thead className="text-gray-500 dark:text-gray-400 sticky top-0 z-10 bg-white dark:bg-black">
              <tr>
                <th className="w-[30%] px-6 pt-10 pb-6 font-medium border-b border-gray-100 dark:border-white/5 select-none">
                  <div 
                    data-testid="sort-name"
                    className="flex items-center gap-2 cursor-pointer w-fit hover:text-gray-700 dark:hover:text-white transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    Tool 
                    <div className="h-4 w-4 flex items-center justify-center">
                      {renderSortIcon("name")}
                    </div>
                  </div>
                </th>
                <th className="w-[15%] px-6 pt-10 pb-6 font-medium border-b border-gray-100 dark:border-white/5 select-none">
                  <div 
                    data-testid="sort-department"
                    className="flex items-center gap-2 cursor-pointer w-fit hover:text-gray-700 dark:hover:text-white transition-colors"
                    onClick={() => handleSort("owner_department")}
                  >
                     Department 
                     <div className="w-4 h-4 flex items-center justify-center">
                        {renderSortIcon("owner_department")}
                     </div>
                   </div>
                </th>
                <th className="w-[15%] px-6 pt-10 pb-6 font-medium border-b border-gray-100 dark:border-white/5 select-none">
                  <div 
                    data-testid="sort-users"
                    className="flex items-center gap-2 cursor-pointer w-fit hover:text-gray-700 dark:hover:text-white transition-colors"
                    onClick={() => handleSort("active_users_count")}
                  >
                     Users 
                     <div className="w-4 h-4 flex items-center justify-center">
                        {renderSortIcon("active_users_count")}
                     </div>
                   </div>
                </th>
                <th className="w-[15%] px-6 pt-10 pb-6 font-medium border-b border-gray-100 dark:border-white/5 select-none">
                  <div 
                    data-testid="sort-monthly_cost"
                    className="flex items-center gap-2 cursor-pointer w-fit hover:text-gray-700 dark:hover:text-white transition-colors"
                    onClick={() => handleSort("monthly_cost")}
                  >
                     Monthly Cost 
                     <div className="w-4 h-4 flex items-center justify-center">
                        {renderSortIcon("monthly_cost")}
                     </div>
                   </div>
                </th>
                <th className="w-[15%] px-6 pt-10 pb-6 font-medium border-b border-gray-100 dark:border-white/5 select-none">
                  <div 
                    className="flex items-center gap-2 cursor-pointer w-fit hover:text-gray-700 dark:hover:text-white transition-colors"
                    onClick={() => handleSort("status")}
                  >
                     Status 
                     <div className="w-4 h-4 flex items-center justify-center">
                        {renderSortIcon("status")}
                     </div>
                   </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedTools.map((tool) => (
                <tr 
                  key={tool.id} 
                  className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0"
                >
                  <td className="px-6 py-4 truncate">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-white/5 p-1">
                        <img 
                          src={tool.icon_url} 
                          alt={tool.name} 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${tool.name}&background=random&color=fff`
                          }}
                        />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white truncate">
                        {tool.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 truncate">
                    {tool.owner_department}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 truncate">
                    {tool.active_users_count}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium truncate">
                    €{tool.monthly_cost.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs capitalize ${getStatusStyles(tool.status)}`}>
                      {tool.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* BARRE DE PAGINATION */}
        <div className="flex items-center justify-center gap-4 py-4 border-t border-gray-100 dark:border-white/5">
            <button
                data-testid="prev-page"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
            >
                <ChevronLeft size={18} />
            </button>

            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Page <span className="text-gray-900 dark:text-white">{currentPage}</span> of {totalPages}
            </span>

            <button
                data-testid="next-page"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
            >
                <ChevronRight size={18} />
            </button>
        </div>

      </div>
    </div>
  );
}

export default RecentTools;
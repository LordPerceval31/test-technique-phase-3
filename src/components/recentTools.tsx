import { useState } from "react";
import { Calendar, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { Tool } from "../utils/interfaces";
import { getStatusStyles } from "../styles/statusColors";

const ITEMS_PER_PAGE = 10;

interface RecentToolsProps {
  tools?: Tool[];
  showHeader?: boolean;
}

// On ajoute une valeur par défaut : tools = []
const RecentTools = ({ tools = [], showHeader = true }: RecentToolsProps) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Tool; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Sécurité : si tools est undefined, on utilise un tableau vide
  const displayData = tools || [];

  const handleSort = (key: keyof Tool) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const sortedTools = [...displayData].sort((a: Tool, b: Tool) => {
    if (!sortConfig) return 0;
    const sortKey = sortConfig.key as keyof Tool;
    const direction = sortConfig.direction;
    if (a[sortKey] < b[sortKey]) return direction === "asc" ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedTools.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTools = sortedTools.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const renderSortIcon = (columnKey: keyof Tool) => {
    if (sortConfig?.key !== columnKey) return null;
    return sortConfig.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  // Si pas de données, on affiche un message propre au lieu de planter
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
                    <th className="w-[30%] px-6 pt-10 pb-6 font-medium border-b border-gray-100 dark:border-white/5 select-none cursor-pointer" onClick={() => handleSort("name")}>
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
                </tr>
                </thead>
                <tbody>
                {paginatedTools.map((tool) => (
                    <tr key={tool.id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0">
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
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        
        {/* Pagination Controls */}
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

import { Users, ExternalLink, MoreVertical, Edit, Trash2, Power, Play, Calendar } from "lucide-react";
import type { Tool } from "../utils/interfaces";
import { getStatusStyles } from "../styles/statusColors";
import { useEffect, useRef, useState } from "react";

interface ToolCardProps {
  tool: Tool;
  isDark: boolean;
  onEdit: (tool: Tool) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (tool: Tool) => void;
  onView: (tool: Tool) => void;
}

export default function ToolCard({ tool, isDark, onEdit, onDelete, onToggleStatus, onView }: ToolCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isInactive = tool.status === "unused";
  const toggleLabel = isInactive ? "Enable" : "Disable";
  const ToggleIcon = isInactive ? Play : Power;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="aspect-video w-full"> 
      <div 
        // 1. CLICK SUR LA CARTE = VIEW
        onClick={() => onView(tool)}
        className={`relative h-full w-full flex flex-col justify-between rounded-xl border transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1.5 cursor-pointer group/card 
        ${isDark ? "bg-black border-white/10 hover:shadow-blue-500/10" : "bg-white border-gray-200 hover:shadow-gray-200/50"}
        p-4 sm:p-5 md:p-6`}
      >
      
        <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 shrink-0">
                <img 
                  src={tool.icon_url} 
                  alt={tool.name} 
                  className="h-5 w-5 sm:h-6 sm:w-6 object-contain" 
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${tool.name}` }} 
                />
            </div>
            
            <div className="relative" ref={menuRef}>
                <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowMenu(!showMenu)
                      }}
                    className="p-1.5 rounded-md text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                    <MoreVertical size={18} />
                </button>

                {showMenu && (
                    <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/10 rounded-lg shadow-lg z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        <button onClick={(e) => {
                           e.stopPropagation()
                           onEdit(tool); setShowMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
                            <Edit size={14} /> Edit
                        </button>
                         <button 
                            onClick={(e) => { 
                              e.stopPropagation()
                              onToggleStatus(tool); setShowMenu(false); }} 
                            className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer ${isInactive ? "text-green-600" : "text-gray-700 dark:text-gray-300"}`}
                         >
                            <ToggleIcon size={14} /> {toggleLabel}
                        </button>
                        <div className="border-t border-gray-100 dark:border-white/5 my-1"></div>
                        <button onClick={(e) => { 
                          e.stopPropagation()
                          onDelete(tool.id); setShowMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 cursor-pointer">
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                )}
            </div>
        </div>


        <div className="flex flex-col flex-1 min-h-0 min-w-0 mt-3 sm:mt-4">

          <p className="font-medium text-gray-500 dark:text-gray-400 leading-tight truncate text-[10px] sm:text-xs">
            {tool.owner_department} • {tool.category}
          </p>

          <h3 className="font-bold text-gray-900 dark:text-white leading-tight tracking-tight truncate mt-1 text-base sm:text-lg md:text-xl">
            {tool.name}
          </h3>

          <p className="text-gray-400 mt-2 line-clamp-2 leading-relaxed opacity-80 text-[10px] sm:text-xs">
            {tool.description || "No description provided."}
          </p>
        </div>

        <div className="mt-auto flex flex-col gap-3 pt-3 border-t border-gray-100 dark:border-white/5">
            
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-white bg-linear-to-br text-[9px] sm:text-[10px] ${getStatusStyles(tool.status)}`}>
                    {tool.status}
                </span>
                 <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs">
                    <Users size={12} />
                    <span>{tool.active_users_count}</span>
                </div>
            </div>

            <a href={tool.website_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 transition-all">
                <ExternalLink size={14} />
            </a>
          </div>

          <div className="flex items-end justify-between">
            <div className="flex flex-col">
                 <span className="uppercase text-gray-400 font-bold text-[9px] sm:text-[10px]">Monthly Cost</span>
                 <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base md:text-lg">€{(tool.monthly_cost || 0).toLocaleString()}</span>
            </div>
            
            <div className="flex items-center gap-1 text-gray-400 text-[9px] sm:text-[10px] mb-1">
                <Calendar size={10} />
                <span>{formatDate(tool.updated_at)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
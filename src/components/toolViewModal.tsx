
import { X, ExternalLink, Calendar, Users, Building2, Tag, CreditCard, Clock } from "lucide-react";
import type { Tool } from "../utils/interfaces";
import { getStatusStyles } from "../styles/statusColors";

interface ToolViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: Tool | null;
  isDark: boolean;
}

const ToolViewModal = ({ isOpen, onClose, tool, isDark }: ToolViewModalProps) => {
  if (!isOpen || !tool) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('fr-FR', { 
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${isDark ? "bg-[#0A0A0A] border border-white/10 text-white" : "bg-white border border-gray-100 text-gray-900"}`}>
        
        {/* en-tête */}
        <div className="relative h-32 bg-linear-to-r from-blue-600/20 to-purple-600/20 w-full">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors backdrop-blur-md z-10">
                <X size={20} />
            </button>
            <div className="absolute -bottom-10 left-8 p-1 rounded-2xl bg-inherit backdrop-blur-xl border border-white/10 shadow-xl">
                 <div className={`p-4 rounded-xl ${isDark ? "bg-[#121214]" : "bg-white"}`}>
                    <img src={tool.icon_url} alt={tool.name} className="w-12 h-12 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${tool.name}` }} />
                 </div>
            </div>
        </div>

        {/* contenue */}
        <div className="px-8 pt-14 pb-8 overflow-y-auto custom-scrollbar">
            
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-3xl font-bold mb-2">{tool.name}</h2>
                    <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusStyles(tool.status)}`}>
                            {tool.status}
                        </span>
                        <a href={tool.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-blue-500 hover:underline">
                            Visit Website <ExternalLink size={14} />
                        </a>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">Monthly Cost</p>
                    <p className="text-3xl font-bold">€{(tool.monthly_cost || 0).toLocaleString()}</p>
                </div>
            </div>

            {/* détail des grilles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-100"}`}>
                    <div className="flex items-center gap-3 mb-2 text-gray-500">
                        <Building2 size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Department</span>
                    </div>
                    <p className="font-semibold text-lg">{tool.owner_department}</p>
                </div>
                
                <div className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-100"}`}>
                    <div className="flex items-center gap-3 mb-2 text-gray-500">
                        <Tag size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Category</span>
                    </div>
                    <p className="font-semibold text-lg">{tool.category}</p>
                </div>

                <div className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-100"}`}>
                    <div className="flex items-center gap-3 mb-2 text-gray-500">
                        <Users size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Active Users</span>
                    </div>
                    <p className="font-semibold text-lg">{tool.active_users_count}</p>
                </div>

                <div className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-100"}`}>
                    <div className="flex items-center gap-3 mb-2 text-gray-500">
                        <CreditCard size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Cost Previous Month</span>
                    </div>
                    <p className="font-semibold text-lg">€{(tool.previous_month_cost || 0).toLocaleString()}</p>
                </div>
            </div>

            {/* description */}
            <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Description</h3>
                <p className={`leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    {tool.description || "No detailed description available for this tool."}
                </p>
            </div>

            {/* date de création et dernière mise à jour */}
            <div className={`flex flex-col sm:flex-row gap-4 pt-6 border-t ${isDark ? "border-white/10" : "border-gray-100"}`}>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar size={14} />
                    <span>Created: <span className={isDark ? "text-gray-300" : "text-gray-700"}>{formatDate(tool.created_at)}</span></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={14} />
                    <span>Last Update: <span className={isDark ? "text-gray-300" : "text-gray-700"}>{formatDate(tool.updated_at)}</span></span>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

export default ToolViewModal
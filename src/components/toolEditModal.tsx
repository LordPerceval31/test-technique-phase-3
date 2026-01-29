import { X, Save, Loader2, ChevronDown, Box } from "lucide-react"; 
import type { Tool } from "../utils/interfaces";
import type { NewToolPayload } from "../utils/api";
import { useEffect, useState, type FormEvent } from "react";

interface ToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tool: NewToolPayload | Partial<Tool>) => Promise<void>;
  initialData?: Tool | null;
  isDark: boolean;
}

const DEPARTMENTS = ["Engineering", "Design", "Marketing", "Communication", "Operations", "HR"];
const CATEGORIES = ["Development", "Design", "Communication", "Productivity", "Project Management", "Security", "Finance"];
const STATUSES: Tool["status"][] = ["active", "expiring", "unused"];

// composant visuel pour l'effet de halo coloré lors du focus sur un champ
const FocusGradient = () => (
  <div className="absolute -inset-0.5 rounded-lg bg-linear-to-br from-blue-600 to-purple-600 opacity-0 group-focus-within:opacity-100 transition-all duration-300 z-0 blur-[1px]"></div>
);

// état initial pour la création d'un nouvel outil
const INITIAL_FORM_STATE: NewToolPayload = {
  name: "",
  vendor: "",
  category: "Development",
  owner_department: "Engineering",
  monthly_cost: 0,
  previous_month_cost: 0,
  status: "active",
  website_url: "",
  description: "",
  active_users_count: 0,
  icon_url: ""
};

export default function ToolEditModal({ isOpen, onClose, onSubmit, initialData, isDark }: ToolModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<NewToolPayload>(INITIAL_FORM_STATE);

  // synchronisation du formulaire avec les données reçues (mode édition vs création)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        vendor: initialData.vendor,
        category: initialData.category,
        owner_department: initialData.owner_department,
        monthly_cost: initialData.monthly_cost,
        previous_month_cost: initialData.previous_month_cost,
        status: initialData.status,
        website_url: initialData.website_url,
        description: initialData.description,
        active_users_count: initialData.active_users_count,
        icon_url: initialData.icon_url
      });
    } else {
      setFormData(INITIAL_FORM_STATE);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // gestion de la soumission du formulaire vers l'api
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // mise à jour générique d'un champ du formulaire
  const handleChange = (field: keyof NewToolPayload, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // définition des styles de base pour garantir la cohérence visuelle
  const inputBaseClass = `w-full h-11 rounded-xl border transition-all outline-none relative z-10 text-sm ${
    isDark 
      ? "bg-black border-white/10 text-white placeholder-gray-500 focus:border-transparent" 
      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-transparent"
  }`;

  const textInputClass = `${inputBaseClass} px-4`;
  const selectInputClass = `${inputBaseClass} pl-4 pr-10 appearance-none cursor-pointer`;
  const labelClass = "block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2";
  const chevronClass = "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-20 group-focus-within:text-blue-500 transition-colors";

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${isDark ? "bg-[#0A0A0A] border border-white/10" : "bg-white border border-gray-100"}`}>
        
        {/* bandeau d'en-tête avec prévisualisation de l'icône */}
        <div className="relative h-32 bg-linear-to-r from-blue-600/20 to-purple-600/20 w-full shrink-0">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors backdrop-blur-md z-10 cursor-pointer">
                <X size={20} />
            </button>
            
            <div className="absolute -bottom-10 left-8 p-1 rounded-2xl bg-inherit backdrop-blur-xl border border-white/10 shadow-xl z-20">
                 <div className={`p-4 rounded-xl ${isDark ? "bg-black" : "bg-white"} flex items-center justify-center`}>
                    {formData.icon_url ? (
                       <img src={formData.icon_url} alt="Tool Icon" className="w-12 h-12 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${formData.name || 'New'}` }} />
                    ) : (
                       <Box size={32} className="text-gray-400" strokeWidth={1.5} />
                    )}
                 </div>
            </div>
        </div>

        {/* zone de saisie défilante */}
        <div className="px-8 pt-16 pb-8 overflow-y-auto custom-scrollbar flex-1">
            <h2 className={`text-3xl font-bold mb-8 cursor-default ${isDark ? "text-white" : "text-gray-900" }`}>
                {initialData ? `Edit ${initialData.name}` : "Create New Tool"}
            </h2>

          <form id="tool-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* informations d'identité de l'outil */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <label className={labelClass}>Tool Name</label>
                <div className="relative">
                  <FocusGradient />
                  <input required type="text" value={formData.name} onChange={e => handleChange("name", e.target.value)} className={textInputClass} placeholder="Ex: Jira" />
                </div>
              </div>
              <div className="relative group">
                <label className={labelClass}>Vendor / Editor</label>
                <div className="relative">
                  <FocusGradient />
                  <input required type="text" value={formData.vendor} onChange={e => handleChange("vendor", e.target.value)} className={textInputClass} placeholder="Ex: Atlassian" />
                </div>
              </div>
            </div>

            {/* affectation organisationnelle et classification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="relative group">
                <label className={labelClass}>Department</label>
                <div className="relative">
                  <FocusGradient />
                  <select value={formData.owner_department} onChange={e => handleChange("owner_department", e.target.value)} className={selectInputClass}>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown size={16} className={chevronClass} />
                </div>
              </div>
              <div className="relative group">
                <label className={labelClass}>Category</label>
                <div className="relative">
                  <FocusGradient />
                  <select value={formData.category} onChange={e => handleChange("category", e.target.value)} className={selectInputClass}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={16} className={chevronClass} />
                </div>
              </div>
            </div>

            {/* données financières et état opérationnel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <label className={labelClass}>Monthly Cost (€)</label>
                <div className="relative">
                  <FocusGradient />
                  <input required type="number" min="0" value={formData.monthly_cost} onChange={e => handleChange("monthly_cost", Number(e.target.value))} className={textInputClass} placeholder="0.00" />
                </div>
              </div>
              <div className="relative group">
                 <label className={labelClass}>Current Status</label>
                 <div className="relative">
                    <FocusGradient />
                    <select 
                        value={formData.status} 
                        onChange={e => handleChange("status", e.target.value as Tool["status"])} 
                        className={`${selectInputClass} capitalize`}
                    >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={16} className={chevronClass} />
                 </div>
              </div>
            </div>
            
            {/* ressources externes et liens web */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                <label className={labelClass}>Icon URL (Optional)</label>
                <div className="relative">
                    <FocusGradient />
                    <input type="url" value={formData.icon_url} onChange={e => handleChange("icon_url", e.target.value)} className={textInputClass} placeholder="https://example.com/icon.png" />
                </div>
                </div>
                <div className="relative group">
                <label className={labelClass}>Website URL</label>
                <div className="relative">
                    <FocusGradient />
                    <input type="url" value={formData.website_url} onChange={e => handleChange("website_url", e.target.value)} className={textInputClass} placeholder="https://..." />
                </div>
                </div>
            </div>

            {/* zone de texte pour la description détaillée */}
            <div className="relative group">
              <label className={labelClass}>Description</label>
              <div className="relative">
                <FocusGradient />
                <textarea rows={4} value={formData.description} onChange={e => handleChange("description", e.target.value)} className={`${textInputClass} h-auto py-3 resize-none leading-relaxed`} placeholder="Short description of the tool and its usage..." />
              </div>
            </div>

          </form>
        </div>

        {/* pied de modale avec actions de validation */}
        <div className={`px-8 py-6 border-t ${isDark ? "border-white/10" : "border-gray-100"} flex justify-end gap-4 shrink-0`}>
            <button type="button" onClick={onClose} className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${isDark ? "text-gray-300 hover:bg-white/5" : "text-gray-600 hover:bg-gray-100"}`}>
                Cancel
            </button>
            <button type="submit" form="tool-form" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-blue-500/20 cursor-pointer">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {initialData ? "Save Changes" : "Create Tool"}
            </button>
        </div>
      </div>
    </div>
  );
}
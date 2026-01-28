import * as React from "react";
import { X, Save, Loader2, ChevronDown } from "lucide-react";
import type { Tool } from "../utils/interfaces";
import type { NewToolPayload } from "../utils/api";
import { useEffect, useState } from "react";

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

const FocusGradient = () => (
  <div className="absolute -inset-0.5 rounded-lg bg-linear-to-br from-blue-600 to-purple-600 opacity-0 group-focus-within:opacity-100 transition-all duration-300 z-0 blur-[1px]"></div>
);

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

  const handleSubmit = async (e: React.FormEvent) => {
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

  const handleChange = (field: keyof NewToolPayload, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Base styles pour les inputs
  const inputBaseClass = `w-full h-10 rounded-lg border transition-all outline-none relative z-10 ${
    isDark 
      ? "bg-[#121214] border-white/10 text-white placeholder-gray-500 focus:border-transparent" 
      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-transparent"
  }`;

  // Style spécifique pour les inputs texte
  const textInputClass = `${inputBaseClass} px-3`;

  // Style spécifique pour les selects
  const selectInputClass = `${inputBaseClass} pl-3 pr-10 appearance-none cursor-pointer`;

  const labelClass = "block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5";

  // Classe pour le chevron
  const chevronClass = "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-20 group-focus-within:text-blue-500 transition-colors";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${isDark ? "bg-[#0A0A0A] border border-white/10" : "bg-white border border-gray-100"}`}>
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            {initialData ? "Edit Tool" : "Add New Tool"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar space-y-5">
          <form id="tool-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name & Vendor */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <label className={labelClass}>Tool Name</label>
                <div className="relative">
                  <FocusGradient />
                  <input required type="text" value={formData.name} onChange={e => handleChange("name", e.target.value)} className={textInputClass} placeholder="Ex: Jira" />
                </div>
              </div>
              <div className="relative group">
                <label className={labelClass}>Vendor</label>
                <div className="relative">
                  <FocusGradient />
                  <input required type="text" value={formData.vendor} onChange={e => handleChange("vendor", e.target.value)} className={textInputClass} placeholder="Ex: Atlassian" />
                </div>
              </div>
            </div>

            {/* Department & Category */}
            <div className="grid grid-cols-2 gap-4">
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

            {/* Cost & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <label className={labelClass}>Monthly Cost (€)</label>
                <div className="relative">
                  <FocusGradient />
                  <input required type="number" min="0" value={formData.monthly_cost} onChange={e => handleChange("monthly_cost", Number(e.target.value))} className={textInputClass} />
                </div>
              </div>
              <div className="relative group">
                 <label className={labelClass}>Status</label>
                 <div className="relative">
                    <FocusGradient />
                    <select 
                        value={formData.status} 
                        onChange={e => handleChange("status", e.target.value as Tool["status"])} 
                        className={selectInputClass}
                    >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={16} className={chevronClass} />
                 </div>
              </div>
            </div>
            
            {/* Website URL */}
            <div className="relative group">
              <label className={labelClass}>Website URL</label>
              <div className="relative">
                <FocusGradient />
                <input type="url" value={formData.website_url} onChange={e => handleChange("website_url", e.target.value)} className={textInputClass} placeholder="https://..." />
              </div>
            </div>

            {/* Description */}
            <div className="relative group">
              <label className={labelClass}>Description</label>
              <div className="relative">
                <FocusGradient />
                <textarea rows={3} value={formData.description} onChange={e => handleChange("description", e.target.value)} className={`${textInputClass} h-auto py-2 resize-none`} placeholder="Short description..." />
              </div>
            </div>

          </form>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Cancel
            </button>
            <button type="submit" form="tool-form" disabled={loading} className="flex items-center gap-2 px-6 py-2 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {initialData ? "Save Changes" : "Create Tool"}
            </button>
        </div>
      </div>
    </div>
  );
}
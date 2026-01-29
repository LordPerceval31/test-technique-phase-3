import * as React from "react";
import {
  Menu,
  X,
  Search,
  Bell,
  Sun,
  Moon,
  Zap,
  Settings,
  ChevronDown,
  User,
  LogOut,
  ChevronRight
} from "lucide-react";
import { CURRENT_USER } from "../utils/mocks";
import { NavLink } from "react-router-dom";
import { useEffect, useState, useRef, type ChangeEvent } from "react";
import { getTools } from "../utils/api";
import type { Tool } from "../utils/interfaces";
import ToolViewModal from "./toolViewModal";

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const FocusGradient: React.FC = () => (
  <div className="absolute -inset-0.5 rounded-lg bg-linear-to-br from-blue-600 to-purple-600 opacity-0 group-focus-within:opacity-100 transition-all duration-300 z-0 blur-[1px]"></div>
);

const NAV_LINKS = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Tools", href: "/tools" },
  { title: "Analytics", href: "/analytics" },
  { title: "Settings", href: "/settings" },
];

const getInitials = (name: string) => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const Navbar = ({ isDark, toggleTheme }: NavbarProps) => {
  // gestion de l'affichage des menus
  const [openNav, setOpenNav] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  
  // états dédiés à la fonctionnalité de recherche globale
  const [searchTerm, setSearchTerm] = useState("");
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // états pour la modale de visualisation des détails
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const userInitials = getInitials(CURRENT_USER.name);

  // chargement initial des données et gestion du responsive
  useEffect(() => {
    getTools().then((data) => setAllTools(data));
    const handleResize = () => {
      if (window.innerWidth >= 960) setOpenNav(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // fermeture automatique des résultats de recherche lors d'un clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // filtrage dynamique des outils en fonction de la saisie utilisateur
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 0) {
      const results = allTools.filter((tool) =>
        tool.name.toLowerCase().includes(term.toLowerCase()) ||
        tool.category.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredTools(results.slice(0, 5));
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  // sélection d'un outil depuis la recherche et ouverture de la modale
  const handleSelectTool = (tool: Tool) => {
    setSelectedTool(tool);
    setIsViewModalOpen(true);
    setShowResults(false);
    setSearchTerm("");
  };

  return (
    <>
    <header className="w-full px-6 py-3 border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-black backdrop-blur-md sticky top-0 z-50">
      <nav className="relative">
        <div className="flex items-center justify-between">
          
          {/* section gauche : logo et liens de navigation principaux */}
          <div className="flex items-center gap-8">
            <NavLink to="/dashboard" className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-purple-600 text-white">
                <Zap size={18} />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">TechCorp</span>
            </NavLink>

            <div className="hidden lg:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.title}
                  to={link.href}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? "text-black dark:text-white"
                        : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                    }`
                  }
                >
                  {link.title}
                </NavLink>
              ))}
            </div>
          </div>

          {/* section droite : recherche, actions rapides et profil */}
          <div className="flex items-center gap-1 md:gap-2">
            
            {/* barre de recherche avec suggestions */}
            <div className="relative hidden md:block mr-2 group" ref={searchRef}>
              <FocusGradient />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-20 group-focus-within:text-blue-500 transition-colors" />
              
              <input
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={handleSearch}
                onFocus={() => searchTerm.length > 0 && setShowResults(true)}
                className={`h-9 w-64 rounded-lg border transition-all outline-none relative z-10 pl-10 ${
                  isDark
                    ? "bg-black border-white/10 text-white placeholder-gray-500 focus:border-transparent"
                    : "bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-transparent"
                } ${showResults ? "rounded-b-none border-b-0" : ""}`}
              />
              {/* liste déroulante des résultats de recherche */}
              {showResults && (
                <div
                  className={`absolute top-full left-0 w-full rounded-b-lg border border-t-0 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200 z-50 ${
                    isDark ? "bg-[#18181b] border-white/10" : "bg-white border-gray-200"
                  }`}
                >
                  {filteredTools.length > 0 ? (
                    filteredTools.map((tool: Tool) => (
                      <div
                        key={tool.id}
                        onClick={() => handleSelectTool(tool)}
                        className={`flex items-center gap-3 p-3 cursor-pointer transition-colors group/item ${
                          isDark
                            ? "hover:bg-white/5 border-b border-white/5 last:border-0"
                            : "hover:bg-gray-50 border-b border-gray-100 last:border-0"
                        }`}
                      >
                        <div className="h-8 w-8 rounded-md bg-gray-100 dark:bg-white/10 p-1 shrink-0 flex items-center justify-center border border-gray-200 dark:border-white/5">
                          <img
                            src={tool.icon_url}
                            alt=""
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${tool.name}`;
                            }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4
                            className={`text-sm font-medium truncate flex items-center gap-2 ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {tool.name}
                            {tool.status === "unused" && (
                              <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded uppercase font-bold">
                                Unused
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {tool.category} • {tool.owner_department}
                          </p>
                        </div>
                        <ChevronRight
                          size={14}
                          className="text-gray-400 opacity-0 group-hover/item:opacity-100 transition-opacity -translate-x-2 group-hover/item:translate-x-0 duration-200"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No results found.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* boutons d'actions rapides (thème, notifications, paramètres) */}
            <button className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
              <Search size={20} className="text-gray-600 dark:text-gray-300" />
            </button>

            <button
              data-testid="theme-toggle"
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer"
            >
              {isDark ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} className="text-gray-600" />
              )}
            </button>

            <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
              <Bell size={20} className="text-gray-600 dark:text-gray-300" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-black"></span>
            </button>

            <button className="p-2 hidden md:block hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
              <Settings size={20} className="text-gray-600 dark:text-gray-300" />
            </button>

            {/* menu déroulant du profil utilisateur */}
            <div className="relative ml-1 hidden md:block">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="h-9 w-9 rounded-full bg-linear-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs border-2 border-white dark:border-white/10 shadow-sm">
                  {userInitials}
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsProfileOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl shadow-lg shadow-gray-200/50 dark:shadow-black/50 py-1 z-20 overflow-hidden transform origin-top-right transition-all">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {CURRENT_USER.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {CURRENT_USER.email}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400 mt-2">
                        {CURRENT_USER.role}
                      </p>
                    </div>
                    <div className="py-1">
                      <a
                        href="#"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                      >
                        <User size={16} className="text-gray-400" />
                        Voir mon profil
                      </a>
                    </div>
                    <div className="border-t border-gray-100 dark:border-white/5 py-1">
                      <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left">
                        <LogOut size={16} />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* menu burger pour l'affichage mobile */}
            <div className="lg:hidden relative ml-1">
              <button
                onClick={() => setOpenNav(!openNav)}
                className="p-2 text-gray-600 dark:text-gray-300"
              >
                {openNav ? <X size={24} /> : <Menu size={24} />}
              </button>

              {openNav && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setOpenNav(false)}
                  ></div>

                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl shadow-lg z-20 overflow-hidden">
                    {NAV_LINKS.map((link) => (
                      <NavLink
                        key={link.title}
                        to={link.href}
                        onClick={() => setOpenNav(false)}
                        className={({ isActive }) =>
                          `block px-4 py-2.5 text-sm transition-colors ${
                            isActive
                              ? "bg-gray-50 dark:bg-white/5 text-black dark:text-white font-semibold"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                          }`
                        }
                      >
                        {link.title}
                      </NavLink>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
    
    <ToolViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        tool={selectedTool}
        isDark={isDark}
      />
    </>
  );
};

export default Navbar;
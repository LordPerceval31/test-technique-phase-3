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
} from "lucide-react";

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const NAV_LINKS = [
  { title: "Dashboard", href: "#" },
  { title: "Tools", href: "#" },
  { title: "Analytics", href: "#" },
  { title: "Settings", href: "#" },
];

export default function Navbar({ isDark, toggleTheme }: NavbarProps) {
  const [openNav, setOpenNav] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setOpenNav(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="w-full px-6 py-3 border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-black backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
      
      <nav aria-label="Navigation principale">
        <div className="flex items-center justify-between">
          
          {/* GROUPE GAUCHE */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-purple-600 text-white shadow-md">
                <Zap size={18} fill="currentColor" />
              </div>
              <a href="#" className="block py-1 text-lg font-bold text-gray-900 dark:text-white tracking-tight cursor-default">
                TechCorp
              </a>
            </div>

            <div className="hidden lg:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  {link.title}
                </a>
              ))}
            </div>
          </div>

          {/* GROUPE DROITE */}
          <div className="flex items-center gap-1 md:gap-2">
            
            {/* ---  Barre de recherche --- */}
            <div className="relative hidden md:block mr-2 group">

              <div className="absolute -inset-0.5 rounded-lg bg-linear-to-br from-blue-600 to-purple-600 opacity-0 group-focus-within:opacity-100 transition-all duration-300 -z-10 blur-[1px]"></div>

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400 z-10" />
              <input
                type="text"
                placeholder="Search tools..."

                className="h-9 w-64 rounded-lg border border-gray-200 dark:border-white/10 group-focus-within:border-transparent bg-gray-100 dark:bg-[#121214] pl-10 pr-4 text-sm outline-none transition-all text-gray-900 dark:text-white placeholder-gray-500 relative z-0"
              />
            </div>
            
            {/* Loupe mobile  */}
            <button className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
              <Search size={20} className="text-gray-600 dark:text-gray-300" />
            </button>

            {/* toggle button */}
            <button 
              onClick={toggleTheme} 
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer"
            >
              {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
            </button>

            {/* cloche */}
            <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
              <Bell size={20} className="text-gray-600 dark:text-gray-300" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-[#121214]"></span>
            </button>

            {/* settings */}
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
              <Settings size={20} className="text-gray-600 dark:text-gray-300" />
            </button>

            {/* logo profile */}
            <div className="flex items-center gap-1 ml-1 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="h-9 w-9 rounded-full bg-linear-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs border-2 border-white dark:border-white/10 shadow-sm">
                TC
              </div>
              <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
            </div>

            {/* menu burger mobile */}
            <button
              onClick={() => setOpenNav(!openNav)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300 ml-1"
            >
              {openNav ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* menu burger déroulant */}
        {openNav && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex flex-col gap-2">
             {NAV_LINKS.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                  {link.title}
                </a>
              ))}
          </div>
        )}
      </nav>
    </header>
  );
}
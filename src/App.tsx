import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

function App() {
  // On peut initialiser avec la préférence système si on veut être proactif
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      // Astuce : on change aussi le style du body pour éviter les flashs blancs au scroll
      document.body.style.backgroundColor = '#09090b'; 
    } else {
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
    }
  }, [isDark]);

  return (
    /* J'ai retiré le commentaire pour la clarté */
    <div className="min-h-screen grid place-items-center bg-white dark:bg-[#09090b] transition-colors duration-500 text-black dark:text-white">
      
      <div className="p-10 rounded-3xl bg-gray-100 dark:bg-[#121214] border border-gray-200 dark:border-white/5 shadow-2xl text-center transition-colors duration-500">
        
        <h1 className="text-4xl font-black tracking-tight mb-2">
          TechCorp <span className="text-purple-500">v4</span>
        </h1>
        
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto">
          Maintenant que App.css est vide, le fond couvre tout l'écran !
        </p>

        <button 
          onClick={() => setIsDark(!isDark)}
          className="cursor-pointer mx-auto flex items-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold transition-all active:scale-95 hover:opacity-90"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
          {isDark ? 'Mode Clair' : 'Mode Sombre'}
        </button>

      </div>
    </div>
  );
}

export default App;
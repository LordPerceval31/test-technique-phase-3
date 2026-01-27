import { useState, useEffect } from 'react';
import darkWallpaper from './assets/darkWallpaper.webp'; 
import Navbar from "./components/header";
import Dashboard from "./pages/dashboard";

function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      
      {/* Fond Light (Blanc) */}
      <div className="fixed inset-0 bg-white z-0" />

      {/* Fond Dark (Image Wallpaper) */}
      <div 
        className={`fixed inset-0 bg-cover bg-center z-0 transition-opacity duration-300 ${
          isDark ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundImage: `url(${darkWallpaper})` }}
      />
      
      <div className="relative z-10 flex flex-col min-h-screen text-black dark:text-white">
        
        <Navbar 
          isDark={isDark} 
          toggleTheme={() => {
            // LOG 3 : Vérifie si le clic depuis la Navbar remonte bien jusqu'ici
            console.log("%c [App.tsx] Action toggleTheme reçue !", "color: #22c55e; font-weight: bold");
            setIsDark(!isDark);
          }} 
        />

        <main className="flex-1">
          <Dashboard isDark={isDark}/>
        </main>

      </div>
    </div>
  );
}

export default App;
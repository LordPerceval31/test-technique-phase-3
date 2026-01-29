import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from "./components/header";
import Dashboard from "./pages/dashboard";
import Tools from "./pages/tools";
import darkWallpaper from "./assets/darkWallpaper.webp";
import Analytics from './pages/analytics';

function App() {
  // On récupère le thème sauvegardé ou on met Dark par défaut
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    // On applique la classe dark et on sauvegarde le choix dans le localstorage
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', JSON.stringify(isDark));
  }, [isDark]);

  return (
    <BrowserRouter>
      <div className="relative min-h-screen">
        <div className="fixed inset-0 bg-white z-0" />
        <div 
          className={`fixed inset-0 bg-cover bg-center z-0 transition-opacity duration-300 ${
            isDark ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${darkWallpaper})`, transitionDelay: '50ms' }}
        />
        
        <div className="relative z-10 flex flex-col min-h-screen text-black dark:text-white">
          <Navbar isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard isDark={isDark} />} />
              <Route path="/tools" element={<Tools isDark={isDark} />} />
              <Route path="/analytics" element={<Analytics isDark={isDark} />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
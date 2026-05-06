'use client';

import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

export default function GlobalUI() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  };

  return (
    <>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          color: 'inherit',
          border: '1px solid rgba(255,255,255,0.1)',
        }
      }}/>
      
      {/* Marca de agua de fondo */}
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: -1, pointerEvents: 'none', opacity: 0.05, width: '60vw', height: '60vw', maxWidth: '800px', maxHeight: '800px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src="/logo.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'grayscale(100%)' }} />
      </div>

      {/* Elementos globales fijos */}
      <div style={{ position: 'fixed', top: '1.5rem', left: '2rem', zIndex: 50, display: 'flex', alignItems: 'center', gap: '1rem', pointerEvents: 'none' }}>
        <img src="/logo.jpg" alt="Logo Escuela Pucara Alto" style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'contain', pointerEvents: 'auto', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }} />
      </div>

      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 50 }}>
        <button 
          onClick={toggleTheme}
          className="glass-button" 
          style={{ width: '40px', height: '40px', borderRadius: '50%', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </>
  );
}

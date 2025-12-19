
import React from 'react';
import { Language } from '../types';

interface HeaderProps {
  favoritesCount: number;
  onFavoritesClick: () => void;
  language: Language;
  onLanguageToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  favoritesCount, 
  onFavoritesClick, 
  language, 
  onLanguageToggle 
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-solid border-accent-input bg-background-dark/95 backdrop-blur-md">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-10 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 text-white group cursor-pointer" 
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        >
          <div className="size-9 bg-accent-dark border border-accent-border rounded-xl flex items-center justify-center text-primary group-hover:border-primary/50 transition-all shadow-lg shadow-black/20">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          </div>
          <div className="flex flex-col leading-none">
            <h2 className="text-white text-xl font-black tracking-tighter">Babygo</h2>
            <span className="text-[8px] text-primary/60 font-bold uppercase tracking-[0.2em]">Science</span>
          </div>
        </div>
        
        <div className="flex flex-1 justify-end items-center gap-2 sm:gap-4">
          {/* Improved Language Switcher */}
          <button 
            onClick={onLanguageToggle}
            className="flex items-center gap-2.5 h-10 px-2.5 bg-accent-dark/50 hover:bg-accent-input border border-accent-border rounded-xl text-white transition-all group"
            title={language === 'en' ? 'Cambiar a Español' : 'Switch to English'}
          >
            <div className="flex items-center justify-center size-7 rounded-lg bg-background-dark/40 text-slate-400 group-hover:text-primary transition-all group-hover:scale-110 group-hover:bg-primary/5">
              <span className="material-symbols-outlined text-[20px]">translate</span>
            </div>
            <div className="flex flex-col items-start leading-none pr-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Lang</span>
              <span className="text-[11px] font-black uppercase tracking-wider">{language}</span>
            </div>
          </button>

          {/* Improved Favorites Button */}
          <button 
            onClick={onFavoritesClick}
            className="flex items-center gap-2.5 h-10 px-4 bg-accent-dark/50 hover:bg-accent-input border border-accent-border rounded-xl text-white transition-all group relative"
          >
            <span 
              className={`material-symbols-outlined text-[20px] transition-all group-hover:scale-110 ${favoritesCount > 0 ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} 
              style={favoritesCount > 0 ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              favorite
            </span>
            <span className="text-sm font-bold hidden sm:inline tracking-tight">
              {language === 'en' ? 'Favorites' : 'Favoritos'}
            </span>
            {favoritesCount > 0 && (
              <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1.5 bg-primary text-white text-[9px] font-black rounded-full shadow-lg shadow-primary/40 ml-1 transform scale-110 animate-pulse">
                {favoritesCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

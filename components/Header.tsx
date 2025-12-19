
import React from 'react';

interface HeaderProps {
  favoritesCount: number;
  onFavoritesClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ favoritesCount, onFavoritesClick }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-solid border-b-accent-input bg-background-dark/95 backdrop-blur-sm">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 text-white">
          <div className="size-8 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">smart_toy</span>
          </div>
          <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">Babygo</h2>
        </div>
        
        <div className="flex flex-1 justify-end items-center">
          <button 
            onClick={onFavoritesClick}
            className="flex items-center gap-2 px-4 py-2 bg-accent-dark hover:bg-accent-input border border-accent-border rounded-xl text-white transition-all group"
          >
            <span className={`material-symbols-outlined transition-colors ${favoritesCount > 0 ? 'text-primary fill-1' : 'text-slate-400 group-hover:text-primary'}`}>
              favorite
            </span>
            <span className="text-sm font-bold">Favorites</span>
            {favoritesCount > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1 bg-primary text-white text-[10px] font-bold rounded-full shadow-lg shadow-primary/30">
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


import React from 'react';
import { BabyName, Language } from '../types';

interface NameCardProps {
  item: BabyName;
  isFavorite: boolean;
  onToggleFavorite: (item: BabyName) => void;
  language: Language;
}

const NameCard: React.FC<NameCardProps> = ({ item, isFavorite, onToggleFavorite, language }) => {
  const getGenderColor = (gender: string) => {
    if (gender === 'boy') return 'text-blue-400';
    if (gender === 'girl') return 'text-pink-400';
    return 'text-purple-400';
  };

  const labels = {
    en: {
      phoneticFlow: 'Phonetic Flow',
      peak: 'PEAK',
      rising: 'RISING',
      falling: 'FALLING',
      stable: 'STABLE',
      culturalContext: 'Cultural Context',
      favorited: 'Favorited',
      save: 'Save to Favorites'
    },
    es: {
      phoneticFlow: 'Fluidez Fonética',
      peak: 'CIMA',
      rising: 'ASCENDENTE',
      falling: 'DESCENDENTE',
      stable: 'ESTABLE',
      culturalContext: 'Contexto Cultural',
      favorited: 'En Favoritos',
      save: 'Guardar en Favoritos'
    }
  }[language];

  const trendLabel = {
    rising: labels.rising,
    falling: labels.falling,
    stable: labels.stable
  }[item.historicalTrend];

  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-accent-border bg-accent-dark p-6 hover:bg-accent-input transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="text-white text-2xl font-black">{item.name}</h3>
            <span className={`material-symbols-outlined text-sm ${getGenderColor(item.gender)}`}>
              {item.gender === 'boy' ? 'male' : item.gender === 'girl' ? 'female' : 'transgender'}
            </span>
          </div>
          <p className="text-primary text-sm font-semibold uppercase tracking-widest">{item.origin}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-xs text-slate-500 font-medium">{labels.phoneticFlow}</div>
          <div className="text-xl font-bold text-white">{item.phoneticScore}%</div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-slate-300 text-sm leading-relaxed italic">"{item.meaning}"</p>
        
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="px-2 py-1 rounded-md bg-accent-input text-[10px] text-slate-400 font-bold border border-accent-border">
            {labels.peak}: {item.popularityEra}
          </span>
          <span className={`px-2 py-1 rounded-md bg-accent-input text-[10px] font-bold border border-accent-border flex items-center gap-1 ${
            item.historicalTrend === 'rising' ? 'text-green-400' : item.historicalTrend === 'falling' ? 'text-orange-400' : 'text-blue-400'
          }`}>
            <span className="material-symbols-outlined text-[12px]">
              {item.historicalTrend === 'rising' ? 'trending_up' : item.historicalTrend === 'falling' ? 'trending_down' : 'trending_flat'}
            </span>
            {trendLabel}
          </span>
        </div>

        <div className="pt-3 border-t border-accent-border/50">
          <p className="text-[11px] text-slate-500 uppercase font-bold tracking-tight">{labels.culturalContext}</p>
          <p className="text-xs text-slate-400 mt-1">{item.culturalSignificance}</p>
        </div>
      </div>
      
      <button 
        onClick={() => onToggleFavorite(item)}
        className={`mt-4 w-full py-2 bg-transparent border ${isFavorite ? 'border-primary text-primary' : 'border-accent-border text-white'} hover:border-primary hover:text-primary transition-colors text-xs font-bold rounded-lg flex items-center justify-center gap-2`}
      >
        <span className={`material-symbols-outlined text-sm ${isFavorite ? 'fill-1' : ''}`}>favorite</span>
        {isFavorite ? labels.favorited : labels.save}
      </button>
    </div>
  );
};

export default NameCard;

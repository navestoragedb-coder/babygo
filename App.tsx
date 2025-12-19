
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Header from './components/Header';
import NameCard from './components/NameCard';
import { analyzeAndGenerateNames } from './services/geminiService';
import { BabyName, SearchMode, Language } from './types';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('historical');
  const [language, setLanguage] = useState<Language>('en');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BabyName[]>([]);
  const [favorites, setFavorites] = useState<BabyName[]>([]);
  const [searched, setSearched] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load favorites and language from local storage
  useEffect(() => {
    const savedFavs = localStorage.getItem('babygo_favorites');
    const savedLang = localStorage.getItem('babygo_language');
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
    if (savedLang === 'en' || savedLang === 'es') {
      setLanguage(savedLang as Language);
    }
  }, []);

  // Save state to local storage
  useEffect(() => {
    localStorage.setItem('babygo_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('babygo_language', language);
  }, [language]);

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    setShowFavoritesOnly(false);
    
    try {
      const data = await analyzeAndGenerateNames(query, searchMode, language);
      setResults(data);
      
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [query, searchMode, language]);

  const toggleFavorite = (item: BabyName) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.name === item.name);
      if (exists) {
        return prev.filter(f => f.name !== item.name);
      }
      return [...prev, item];
    });
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

  const handleFavoritesView = () => {
    if (favorites.length === 0 && !showFavoritesOnly) return;
    setShowFavoritesOnly(!showFavoritesOnly);
    setSearched(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleQuickSearch = (term: string) => {
    setQuery(term);
    setTimeout(() => {
       const btn = document.getElementById('main-analyze-btn');
       btn?.click();
    }, 50);
  };

  const t = {
    en: {
      heroBadge: 'Scientific Name Discovery',
      heroTitle: 'The Science of the Perfect Name',
      heroSub: 'Stop guessing. Start computing. Discover names using advanced phonetics, cultural heritage, and compatibility algorithms.',
      searchModeDb: 'Search (1980-2024)',
      searchModeAi: 'AI Generation',
      searchPlaceholderDb: 'Search 1980-2024 database...',
      searchPlaceholderAi: 'Generate unique AI names...',
      analyze: 'Analyze',
      analyzing: 'Analyzing...',
      trySearch: 'Try searching for:',
      classic: 'Classic',
      nature: 'Nature-inspired',
      rhythmic: 'Rhythmic flow',
      resultsTitle: 'Discovery Results',
      favoritesTitle: 'My Favorites',
      myFavs: 'My Favorites',
      dbLabel: 'Database',
      aiLabel: 'AI',
      foundMatches: (count: number, q: string) => `Analysis complete. Found ${count} matches for "${q}".`,
      viewingFavs: (count: number) => `Viewing your ${count} saved favorites.`,
      noFavs: "You haven't saved any favorites yet.",
      noResults: "No matches found. Try refining your parameters.",
      statsNames: 'Names Analyzed',
      statsParents: 'Happy Parents',
      statsAccuracy: 'Match Accuracy',
      ctaTitle: 'Ready to find the perfect name?',
      ctaSub: 'Join thousands of parents using AI to make the most important decision of their lives with confidence.',
      ctaBtn: 'Start Free Analysis',
      footerAbout: 'The first scientifically backed baby name finder powered by artificial intelligence.'
    },
    es: {
      heroBadge: 'Descubrimiento Científico de Nombres',
      heroTitle: 'La Ciencia del Nombre Perfecto',
      heroSub: 'Deja de adivinar. Empieza a computar. Descubre nombres usando fonética avanzada, herencia cultural y algoritmos de compatibilidad.',
      searchModeDb: 'Buscar (1980-2024)',
      searchModeAi: 'Generación IA',
      searchPlaceholderDb: 'Buscar en base de datos 1980-2024...',
      searchPlaceholderAi: 'Generar nombres únicos por IA...',
      analyze: 'Analizar',
      analyzing: 'Analizando...',
      trySearch: 'Prueba buscando:',
      classic: 'Clásico',
      nature: 'Inspirado en la naturaleza',
      rhythmic: 'Flujo rítmico',
      resultsTitle: 'Resultados del Descubrimiento',
      favoritesTitle: 'Mis Favoritos',
      myFavs: 'Mis Favoritos',
      dbLabel: 'Base de Datos',
      aiLabel: 'IA',
      foundMatches: (count: number, q: string) => `Análisis completo. Se encontraron ${count} coincidencias para "${q}".`,
      viewingFavs: (count: number) => `Viendo tus ${count} favoritos guardados.`,
      noFavs: "Aún no has guardado ningún favorito.",
      noResults: "No se encontraron coincidencias. Intenta refinar tus parámetros.",
      statsNames: 'Nombres Analizados',
      statsParents: 'Padres Felices',
      statsAccuracy: 'Precisión de Coincidencia',
      ctaTitle: '¿Listo para encontrar el nombre perfecto?',
      ctaSub: 'Únete a miles de padres que usan IA para tomar la decisión más importante de sus vidas con confianza.',
      ctaBtn: 'Empezar Análisis Gratis',
      footerAbout: 'El primer buscador de nombres para bebés con base científica impulsado por inteligencia artificial.'
    }
  }[language];

  const displayResults = showFavoritesOnly ? favorites : results;

  return (
    <div className="relative flex flex-col min-h-screen w-full">
      <Header 
        favoritesCount={favorites.length} 
        onFavoritesClick={handleFavoritesView}
        language={language}
        onLanguageToggle={toggleLanguage}
      />

      <main className="flex-grow flex flex-col items-center w-full">
        {/* Hero Section */}
        <section className="w-full relative px-4 sm:px-10 py-20 lg:py-32 flex flex-col items-center justify-center min-h-[600px]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] opacity-60"></div>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-dark border border-accent-border w-fit shadow-lg shadow-primary/5">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-medium text-white uppercase tracking-wider">{t.heroBadge}</span>
            </div>
            <div className="flex flex-col gap-6">
              <h1 className="text-white text-5xl md:text-7xl font-black leading-tight tracking-tight">
                {t.heroTitle.split(' ').slice(0, -2).join(' ')} <br className="hidden sm:block"/><span className="text-primary">{t.heroTitle.split(' ').slice(-2).join(' ')}</span>
              </h1>
              <p className="text-slate-300 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
                {t.heroSub}
              </p>
            </div>

            <div className="w-full max-w-3xl mt-6 flex flex-col gap-4">
              {/* Search Mode Toggle */}
              <div className="flex justify-center">
                <div className="bg-accent-dark border border-accent-border p-1 rounded-xl flex gap-1">
                  <button 
                    onClick={() => setSearchMode('historical')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${searchMode === 'historical' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <span className="material-symbols-outlined text-base">search</span>
                    {t.searchModeDb}
                  </button>
                  <button 
                    onClick={() => setSearchMode('ai')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${searchMode === 'ai' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <span className="material-symbols-outlined text-base">bolt</span>
                    {t.searchModeAi}
                  </button>
                </div>
              </div>

              <form onSubmit={handleSearch} className="w-full group">
                <div className="relative flex items-center w-full p-2 bg-accent-input border border-accent-border rounded-2xl focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all shadow-2xl">
                  <div className="pl-4 pr-2 flex items-center justify-center text-[#c89295]">
                    <span className="material-symbols-outlined text-3xl">
                      {loading ? 'sync' : searchMode === 'historical' ? 'database' : 'auto_awesome'}
                    </span>
                  </div>
                  <input 
                    className="w-full bg-transparent border-0 focus:ring-0 text-white text-lg placeholder-[#c89295]/70 h-14 px-2" 
                    placeholder={searchMode === 'historical' ? t.searchPlaceholderDb : t.searchPlaceholderAi}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={loading}
                  />
                  <button 
                    id="main-analyze-btn"
                    type="submit"
                    disabled={loading}
                    className="hidden sm:flex items-center justify-center h-12 px-8 bg-primary hover:bg-red-600 disabled:bg-slate-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-primary/25 whitespace-nowrap text-base"
                  >
                    {loading ? t.analyzing : t.analyze}
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="sm:hidden flex items-center justify-center h-12 w-12 bg-primary hover:bg-red-600 disabled:bg-slate-700 text-white rounded-xl transition-all shadow-lg"
                  >
                    <span className="material-symbols-outlined">{loading ? 'sync' : 'arrow_forward'}</span>
                  </button>
                </div>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-6 text-sm">
                  <span className="text-slate-500 font-medium">{t.trySearch}</span>
                  <button type="button" onClick={() => handleQuickSearch(t.classic)} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 group/btn">
                    <span className="material-symbols-outlined text-base group-hover/btn:text-primary transition-colors">history_edu</span> {t.classic}
                  </button>
                  <button type="button" onClick={() => handleQuickSearch(t.nature)} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 group/btn">
                    <span className="material-symbols-outlined text-base group-hover/btn:text-primary transition-colors">forest</span> {t.nature}
                  </button>
                  <button type="button" onClick={() => handleQuickSearch(t.rhythmic)} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 group/btn">
                    <span className="material-symbols-outlined text-base group-hover/btn:text-primary transition-colors">music_note</span> {t.rhythmic}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Results Section */}
        {searched && (
          <section ref={resultsRef} className="w-full bg-background-dark py-20 border-t border-accent-border scroll-mt-16">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
              <div className="flex flex-col gap-8 mb-12">
                <div className="flex flex-col gap-2">
                  <h2 className="text-white text-3xl font-bold flex items-center gap-3">
                    <span className="text-primary material-symbols-outlined">
                      {showFavoritesOnly ? 'favorite' : 'analytics'}
                    </span>
                    {showFavoritesOnly ? t.favoritesTitle : `${t.resultsTitle} (${searchMode === 'historical' ? t.dbLabel : t.aiLabel})`}
                  </h2>
                  <p className="text-slate-400">
                    {showFavoritesOnly 
                      ? t.viewingFavs(favorites.length) 
                      : t.foundMatches(results.length, query)}
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-accent-input/30 rounded-2xl border border-accent-border"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayResults.map((item, idx) => (
                    <NameCard 
                      key={`${item.name}-${idx}`} 
                      item={item} 
                      isFavorite={!!favorites.find(f => f.name === item.name)}
                      onToggleFavorite={toggleFavorite}
                      language={language}
                    />
                  ))}
                  {displayResults.length === 0 && (
                    <div className="col-span-full py-20 text-center text-slate-500 italic">
                      {showFavoritesOnly ? t.noFavs : t.noResults}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Stats Strip */}
        <section className="w-full bg-accent-dark/30 border-y border-accent-border">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-10 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2 p-6 rounded-xl bg-accent-input/50 border border-accent-border hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <p className="text-slate-300 text-base font-medium">{t.statsNames}</p>
                  <span className="material-symbols-outlined text-primary">database</span>
                </div>
                <div className="flex items-end gap-3">
                  <p className="text-white text-3xl font-bold">2M+</p>
                  <p className="text-[#0bda95] text-sm font-medium mb-1 flex items-center">
                    <span className="material-symbols-outlined text-sm">trending_up</span> 15%
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 p-6 rounded-xl bg-accent-input/50 border border-accent-border hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <p className="text-slate-300 text-base font-medium">{t.statsParents}</p>
                  <span className="material-symbols-outlined text-primary">sentiment_satisfied</span>
                </div>
                <div className="flex items-end gap-3">
                  <p className="text-white text-3xl font-bold">10k+</p>
                  <p className="text-[#0bda95] text-sm font-medium mb-1 flex items-center">
                    <span className="material-symbols-outlined text-sm">trending_up</span> 5%
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 p-6 rounded-xl bg-accent-input/50 border border-accent-border hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <p className="text-slate-300 text-base font-medium">{t.statsAccuracy}</p>
                  <span className="material-symbols-outlined text-primary">verified</span>
                </div>
                <div className="flex items-end gap-3">
                  <p className="text-white text-3xl font-bold">99%</p>
                  <p className="text-[#0bda95] text-sm font-medium mb-1 flex items-center">
                    <span className="material-symbols-outlined text-sm">trending_up</span> 1%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full px-4 sm:px-10 py-20">
          <div className="max-w-[1280px] mx-auto bg-gradient-to-r from-accent-dark to-[#2a1516] border border-accent-border rounded-2xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex flex-col gap-4 max-w-xl text-center md:text-left">
              <h2 className="text-white text-3xl font-bold">{t.ctaTitle}</h2>
              <p className="text-slate-300">{t.ctaSub}</p>
            </div>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex-none bg-primary hover:bg-red-600 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:-translate-y-0.5"
            >
              {t.ctaBtn}
            </button>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-accent-border bg-background-dark py-12 px-4 sm:px-10">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">
          <div className="flex flex-col gap-4 items-center md:items-start">
            <div className="flex items-center gap-2 text-white">
              <span className="material-symbols-outlined text-primary">smart_toy</span>
              <span className="font-bold text-xl">Babygo</span>
            </div>
            <p className="text-slate-500 text-sm">{t.footerAbout}</p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold">{language === 'en' ? 'Company' : 'Compañía'}</h4>
            <a className="text-slate-400 hover:text-primary text-sm transition-colors" href="#">{language === 'en' ? 'About Us' : 'Sobre Nosotros'}</a>
            <a className="text-slate-400 hover:text-primary text-sm transition-colors" href="#">{language === 'en' ? 'Careers' : 'Carreras'}</a>
            <a className="text-slate-400 hover:text-primary text-sm transition-colors" href="#">{language === 'en' ? 'Contact' : 'Contacto'}</a>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold">{language === 'en' ? 'Resources' : 'Recursos'}</h4>
            <a className="text-slate-400 hover:text-primary text-sm transition-colors" href="#">Blog</a>
            <a className="text-slate-400 hover:text-primary text-sm transition-colors" href="#">{language === 'en' ? 'Name Trends 2024' : 'Tendencias 2024'}</a>
            <a className="text-slate-400 hover:text-primary text-sm transition-colors" href="#">{language === 'en' ? 'Science' : 'Ciencia'}</a>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold">{language === 'en' ? 'Legal' : 'Legal'}</h4>
            <a className="text-slate-400 hover:text-primary text-sm transition-colors" href="#">{language === 'en' ? 'Privacy Policy' : 'Política de Privacidad'}</a>
            <a className="text-slate-400 hover:text-primary text-sm transition-colors" href="#">{language === 'en' ? 'Terms of Service' : 'Términos de Servicio'}</a>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-sm">© 2024 Babygo AI Inc. {language === 'en' ? 'All rights reserved.' : 'Todos los derechos reservados.'}</p>
          <div className="flex gap-4">
            <a className="text-slate-500 hover:text-white transition-colors" href="#"><span className="material-symbols-outlined">thumb_up</span></a>
            <a className="text-slate-500 hover:text-white transition-colors" href="#"><span className="material-symbols-outlined">share</span></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

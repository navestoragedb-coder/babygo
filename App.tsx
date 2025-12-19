
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Header from './components/Header';
import NameCard from './components/NameCard';
import { analyzeAndGenerateNames } from './services/geminiService';
import { BabyName, SearchMode } from './types';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('historical');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BabyName[]>([]);
  const [favorites, setFavorites] = useState<BabyName[]>([]);
  const [searched, setSearched] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load favorites from local storage
  useEffect(() => {
    const saved = localStorage.getItem('babygo_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  // Save favorites to local storage
  useEffect(() => {
    localStorage.setItem('babygo_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    setShowFavoritesOnly(false);
    
    try {
      const data = await analyzeAndGenerateNames(query, searchMode);
      setResults(data);
      
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [query, searchMode]);

  const toggleFavorite = (item: BabyName) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.name === item.name);
      if (exists) {
        return prev.filter(f => f.name !== item.name);
      }
      return [...prev, item];
    });
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

  const displayResults = showFavoritesOnly ? favorites : results;

  return (
    <div className="relative flex flex-col min-h-screen w-full">
      <Header 
        favoritesCount={favorites.length} 
        onFavoritesClick={handleFavoritesView}
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
              <span className="text-xs font-medium text-white uppercase tracking-wider">Scientific Name Discovery</span>
            </div>
            <div className="flex flex-col gap-6">
              <h1 className="text-white text-5xl md:text-7xl font-black leading-tight tracking-tight">
                The Science of the <br className="hidden sm:block"/><span className="text-primary">Perfect Name</span>
              </h1>
              <p className="text-slate-300 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
                Stop guessing. Start computing. Discover names using advanced phonetics, cultural heritage, and compatibility algorithms.
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
                    Search (1980-2024)
                  </button>
                  <button 
                    onClick={() => setSearchMode('ai')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${searchMode === 'ai' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <span className="material-symbols-outlined text-base">bolt</span>
                    AI Generation
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
                    placeholder={searchMode === 'historical' ? "Search 1980-2024 database..." : "Generate unique AI names..."}
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
                    {loading ? 'Analyzing...' : 'Analyze'}
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
                  <span className="text-slate-500 font-medium">Try searching for:</span>
                  <button type="button" onClick={() => handleQuickSearch('Classic')} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 group/btn">
                    <span className="material-symbols-outlined text-base group-hover/btn:text-primary transition-colors">history_edu</span> Classic
                  </button>
                  <button type="button" onClick={() => handleQuickSearch('Nature-inspired')} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 group/btn">
                    <span className="material-symbols-outlined text-base group-hover/btn:text-primary transition-colors">forest</span> Nature-inspired
                  </button>
                  <button type="button" onClick={() => handleQuickSearch('Rhythmic flow')} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 group/btn">
                    <span className="material-symbols-outlined text-base group-hover/btn:text-primary transition-colors">music_note</span> Rhythmic flow
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
                    {showFavoritesOnly ? 'My Favorites' : `Discovery Results (${searchMode === 'historical' ? 'Database' : 'AI'})`}
                  </h2>
                  <p className="text-slate-400">
                    {showFavoritesOnly 
                      ? `Viewing your ${favorites.length} saved favorites.` 
                      : `Analysis complete. Found ${results.length} matches for "${query}".`}
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
                    />
                  ))}
                  {displayResults.length === 0 && (
                    <div className="col-span-full py-20 text-center text-slate-500 italic">
                      {showFavoritesOnly ? "You haven't saved any favorites yet." : "No matches found. Try refining your parameters."}
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
                  <p className="text-slate-300 text-base font-medium">Names Analyzed</p>
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
                  <p className="text-slate-300 text-base font-medium">Happy Parents</p>
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
                  <p className="text-slate-300 text-base font-medium">Match Accuracy</p>
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

        {/* Process Section */}
        <section className="w-full bg-accent-input/30 py-20 border-y border-accent-border">
          <div className="max-w-[960px] mx-auto px-4 sm:px-10">
            <div className="text-center mb-16">
              <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">From Input to Insight</h2>
              <p className="text-slate-400">Four simple steps to finding the one.</p>
            </div>
            <div className="grid grid-cols-[48px_1fr] gap-x-6 px-4">
              <div className="flex flex-col items-center pt-2">
                <div className="w-12 h-12 rounded-full bg-accent-dark border border-accent-border flex items-center justify-center text-primary z-10">
                  <span className="material-symbols-outlined">keyboard</span>
                </div>
                <div className="w-[2px] bg-accent-border h-full min-h-[60px] -mt-2"></div>
              </div>
              <div className="flex flex-col pb-12 pt-2">
                <h3 className="text-white text-xl font-bold mb-1">Input Preferences</h3>
                <p className="text-[#c89295]">Tell us your surname, desired style (e.g., "Classic", "Modern"), and any cultural requirements.</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-[2px] bg-accent-border h-4 -mb-2"></div>
                <div className="w-12 h-12 rounded-full bg-accent-dark border border-accent-border flex items-center justify-center text-primary z-10 relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20"></div>
                  <span className="material-symbols-outlined">psychology</span>
                </div>
                <div className="w-[2px] bg-accent-border h-full min-h-[60px] -mt-2"></div>
              </div>
              <div className="flex flex-col pb-12 pt-2">
                <h3 className="text-white text-xl font-bold mb-1">AI Analysis</h3>
                <p className="text-[#c89295]">Our engine runs millions of combinations against your criteria to score phonetic compatibility.</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-[2px] bg-accent-border h-4 -mb-2"></div>
                <div className="w-12 h-12 rounded-full bg-accent-dark border border-accent-border flex items-center justify-center text-primary z-10">
                  <span className="material-symbols-outlined">format_list_bulleted</span>
                </div>
                <div className="w-[2px] bg-accent-border h-full min-h-[60px] -mt-2"></div>
              </div>
              <div className="flex flex-col pb-12 pt-2">
                <h3 className="text-white text-xl font-bold mb-1">Review Matches</h3>
                <p className="text-[#c89295]">Receive a curated list of top-scoring names, complete with origin stories and popularity trends.</p>
              </div>

              <div className="flex flex-col items-center pb-2">
                <div className="w-[2px] bg-accent-border h-4 -mb-2"></div>
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 z-10">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
              </div>
              <div className="flex flex-col pt-2">
                <h3 className="text-white text-xl font-bold mb-1">Select Name</h3>
                <p className="text-[#c89295]">Save your favorites or finalize the perfect choice for your baby.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full px-4 sm:px-10 py-20">
          <div className="max-w-[1280px] mx-auto bg-gradient-to-r from-accent-dark to-[#2a1516] border border-accent-border rounded-2xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex flex-col gap-4 max-w-xl text-center md:text-left">
              <h2 className="text-white text-3xl font-bold">Ready to find the perfect name?</h2>
              <p className="text-slate-300">Join thousands of parents using AI to make the most important decision of their lives with confidence.</p>
            </div>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex-none bg-primary hover:bg-red-600 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:-translate-y-0.5"
            >
              Start Free Analysis
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
            <p className="text-slate-500 text-sm">The first scientifically backed baby name finder powered by artificial intelligence.</p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold">Company</h4>
            <a className="text-slate-400 hover:text-primary text-sm transition-colors" href="#">About Us</a>
            <a className="text-slate-400 hover:text-primary text-sm transition-colors" href="#">Careers</a>
            <a className="text-slate-400 hover:text-primary text-sm transition-colors" href="#">Contact</a>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold">Resources</h4>
            <a className="text-slate-400 hover:text-primary text-sm transition-colors" href="#">Blog</a>
            <a className="text-slate-400 hover:text-primary text-sm transition-colors" href="#">Name Trends 2024</a>
            <a className="text-slate-400 hover:text-primary text-sm transition-colors" href="#">Science</a>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold">Legal</h4>
            <a className="text-slate-400 hover:text-primary text-sm transition-colors" href="#">Privacy Policy</a>
            <a className="text-slate-400 hover:text-primary text-sm transition-colors" href="#">Terms of Service</a>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-sm">© 2024 Babygo AI Inc. All rights reserved.</p>
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

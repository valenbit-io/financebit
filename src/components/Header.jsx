import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png'; 

const Header = ({ 
  trending, 
  handleTickerClick, 
  handleReset, 
  darkMode, 
  setDarkMode, 
  currency, 
  setCurrency,
  watchlist,
  showFavorites,
  setShowFavorites,
  setSearchTerm, 
  handleSearch,
  isSearching,
  clearSearch,
  searchTerm
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Ticker de Tendencias (Marquee) */}
        {!isSearching && !showFavorites && (
          <div className="w-full overflow-hidden bg-blue-50/50 dark:bg-blue-900/10 rounded-lg mb-2 border border-blue-100 dark:border-blue-500/10">
            <div className="animate-marquee whitespace-nowrap py-1 flex gap-8 items-center">
               <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest px-4">🔥 Tendencias:</span>
               {trending.map(coin => (
                 <button key={coin.item.id} onClick={() => handleTickerClick(coin.item.id)} className="inline-flex items-center gap-2 group cursor-pointer hover:bg-white/50 dark:hover:bg-white/5 px-3 rounded-full transition-all">
                    <img src={coin.item.thumb} alt={coin.item.name} className="w-5 h-5 rounded-full" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-cyan-400">{coin.item.symbol}</span>
                    <span className={`text-xs ${coin.item.data.price_change_percentage_24h.usd > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {coin.item.data.price_change_percentage_24h.usd.toFixed(2)}%
                    </span>
                 </button>
               ))}
            </div>
          </div>
        )}

        {/* Barra Principal */}
        <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4">
          
          {/* Logo */}
          <Link to="/" onClick={handleReset} className="flex items-center gap-2 group shrink-0">
            <img 
              src={logoImg} 
              alt="FinanceBit" 
              className="w-8 h-8 md:w-10 md:h-10 object-contain transition-transform group-hover:scale-110" 
            />
            <h1 className="text-lg md:text-2xl font-black tracking-tighter text-slate-800 dark:text-white hidden sm:block">
              Finance<span className="text-blue-600 dark:text-cyan-400">Bit</span>
            </h1>
          </Link>

          {/* Buscador */}
          <div className="flex-1 max-w-md relative">
            <form onSubmit={handleSearch} className="relative group">
              <input 
                type="text" 
                placeholder="Buscar (ej. Bitcoin)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800/50 text-slate-800 dark:text-white rounded-full pl-10 pr-10 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all border border-transparent focus:bg-white dark:focus:bg-slate-800"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              {searchTerm && (
                <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500">✕</button>
              )}
            </form>
          </div>

          {/* Controles Derecha (Moneda, Favoritos, Tema) */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)} 
              className="bg-slate-100 dark:bg-slate-800 text-xs md:text-sm font-bold text-slate-700 dark:text-white rounded-lg px-2 py-2 md:px-3 md:py-2 outline-none border border-transparent hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer"
            >
              <option value="usd">USD</option>
              <option value="mxn">MXN</option>
              <option value="eur">EUR</option>
            </select>

            {/* 🔥 CORRECCIÓN AQUÍ: Botón compacto en móvil */}
            <button 
              onClick={() => setShowFavorites(!showFavorites)} 
              className={`relative p-2 md:px-4 md:py-2 rounded-lg flex items-center gap-2 transition-all font-bold border ${
                showFavorites 
                ? 'bg-yellow-100 border-yellow-300 text-yellow-700' 
                : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-500 dark:text-slate-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-600'
              }`}
            >
              <span className="text-lg">★</span>
              <span className="hidden md:block text-sm">Favoritos</span>
              {watchlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white font-bold animate-bounce">
                  {watchlist.length}
                </span>
              )}
            </button>

            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
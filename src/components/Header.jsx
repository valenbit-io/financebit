import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 1. Componente externo
const TickerItems = ({ data, onItemClick }) => (
  <>
    {data.map((coin, index) => {
       const change = typeof coin.price_change_percentage_24h === 'number' 
          ? coin.price_change_percentage_24h 
          : 0;
       return (
         <button 
            key={`${coin.id}-${index}`} 
            onClick={() => onItemClick(coin.id)} 
            // 🔥 CAMBIO 1: mr-12 (margen derecho obligatorio) y w-auto para que no se aplaste
            className="flex-shrink-0 w-auto inline-flex items-center gap-2 mr-16 group cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
         >
            {/* Nombre (text-sm) */}
            <span className="text-slate-700 dark:text-slate-300 font-bold text-sm uppercase tracking-wider whitespace-nowrap">
              {coin.symbol}
            </span>
            {/* Porcentaje */}
            <span className={`text-sm font-mono font-bold whitespace-nowrap ${change > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {change > 0 ? '▲' : '▼'}
              {Math.abs(change).toFixed(2)}%
            </span>
         </button>
       );
    })}
  </>
);

const Header = ({ 
  coins, 
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

  const tickerData = coins && coins.length > 0 ? coins : trending.map(t => ({
      id: t.item.id,
      symbol: t.item.symbol,
      price_change_percentage_24h: t.item.data.price_change_percentage_24h.usd
  }));

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 flex flex-col ${isScrolled ? 'bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md shadow-lg' : 'bg-white dark:bg-[#0f172a]'}`}>
      
      {/* 📺 CINTA DE PRECIOS */}
      {!isSearching && !showFavorites && tickerData.length > 0 && (
        <div className="w-full overflow-hidden border-b border-slate-200 dark:border-white/5 py-3 relative z-10 select-none flex group bg-slate-50 dark:bg-black/20">
          
          {/* 🔥 CAMBIO 2: Quitamos 'min-w-full' y gap del padre. Usamos 'w-max' para que crezca libremente */}
          <div className="animate-marquee whitespace-nowrap flex items-center w-max group-hover:[animation-play-state:paused]">
            <TickerItems data={tickerData} onItemClick={handleTickerClick} />
          </div>

          {/* Clon para bucle infinito */}
          <div className="animate-marquee whitespace-nowrap flex items-center w-max group-hover:[animation-play-state:paused]" aria-hidden="true">
            <TickerItems data={tickerData} onItemClick={handleTickerClick} />
          </div>

        </div>
      )}

      {/* BARRA DE NAVEGACIÓN */}
      <div className="w-full max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4">
          
          {/* Logo */}
          <Link to="/" onClick={handleReset} className="flex items-center gap-2 group shrink-0">
            <span className="text-2xl md:text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">💎</span>
            <h1 className="text-xl md:text-2xl font-black tracking-tighter text-slate-800 dark:text-white">
              Finance<span className="text-blue-600 dark:text-cyan-400">Bit</span>
            </h1>
          </Link>

          {/* Buscador */}
          <div className="flex-1 max-w-md relative">
            <form onSubmit={handleSearch} className="relative group">
              <input 
                type="text" 
                placeholder="Buscar..." 
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

          {/* Controles Derecha */}
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
import React from 'react';
import TrendingTicker from './TrendingTicker';

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
  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-white/80 dark:bg-[#0f172a]/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-lg dark:shadow-2xl transition-all duration-300">
      
      {/* Usamos el componente Ticker que acabamos de crear */}
      {trending.length > 0 && (
        <TrendingTicker trending={trending} onCoinClick={handleTickerClick} />
      )}

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
            
            <h1 
              className="text-3xl font-extrabold cursor-pointer tracking-tight hover:opacity-80 transition-opacity flex items-center" 
              onClick={handleReset}
            >
              <span className="text-slate-800 dark:text-white mr-0.5">Finance</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-400 dark:to-blue-500">Bit</span>
            </h1>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-yellow-400 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>

              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-slate-100 dark:bg-gray-800/50 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 outline-none block p-2.5 font-bold cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-800 transition-colors"
              >
                <option value="usd">USD</option>
                <option value="mxn">MXN</option>
                <option value="eur">EUR</option>
              </select>

              <button
                onClick={() => {
                  setShowFavorites(!showFavorites);
                  setSearchTerm(""); 
                }}
                className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 border ${
                  showFavorites 
                  ? 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-300 dark:border-yellow-500/50' 
                  : 'bg-slate-100 dark:bg-gray-800/50 text-slate-500 dark:text-gray-400 border-slate-200 dark:border-white/10 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-gray-800'
                }`}
              >
                ★ <span className="hidden sm:inline">{showFavorites ? 'Ver Todos' : 'Favoritos'}</span>
                <span className="bg-white dark:bg-gray-900 px-2 rounded-full text-xs py-0.5 ml-1 border border-slate-200 dark:border-white/10">
                  {watchlist.length}
                </span>
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSearch} className="w-full md:w-96 flex gap-2">
            <div className="relative w-full">
              <input 
                type="text"
                placeholder="Buscar token..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100 dark:bg-gray-900/50 border border-slate-200 dark:border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 transition-all placeholder-gray-400 dark:placeholder-gray-500 text-sm md:text-base"
              />
              
              {isSearching && (
                <button 
                  type="button" 
                  onClick={clearSearch} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-600 dark:hover:text-white font-bold p-1 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

            <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-600 dark:to-blue-600 hover:brightness-110 px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 text-white text-sm md:text-base">
              Buscar
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
import React from 'react';

const HeroSection = ({ coins, formatPrice, setSelectedCoin, currency }) => (
  <div className="hidden md:grid grid-cols-3 gap-6 mb-10 animate-fadeIn">
    {coins.map((coin) => (
      <div 
        key={coin.id} 
        onClick={() => setSelectedCoin(coin)}
        className="
          bg-white 
          dark:bg-gray-900/60 
          backdrop-blur-xl 
          border border-slate-100 dark:border-white/5 
          p-6 rounded-2xl 
          hover:shadow-xl hover:scale-[1.02] 
          dark:hover:border-cyan-500/30 
          transition-all duration-300 
          cursor-pointer group relative overflow-hidden shadow-sm
        "
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-colors"></div>
        
        <div className="flex items-center gap-4 mb-4 relative z-10">
          <img src={coin.image} alt={coin.name} className="w-12 h-12 rounded-full shadow-lg group-hover:scale-110 transition-transform" />
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">{coin.name}</h3>
            <span className="text-xs text-slate-500 dark:text-gray-400 uppercase font-mono bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">{coin.symbol}</span>
          </div>
        </div>
        
        <div className="relative z-10">
          <p className="text-2xl font-bold font-mono tracking-tight text-slate-800 dark:text-white">
             {formatPrice(coin.current_price)}
             <span className="text-xs text-slate-400 dark:text-gray-500 ml-2 font-sans">{currency.toUpperCase()}</span>
          </p>
          <p className={`text-sm font-bold mt-1 ${coin.price_change_percentage_24h > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {coin.price_change_percentage_24h > 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
          </p>
        </div>
      </div>
    ))}
  </div>
);

export default HeroSection;
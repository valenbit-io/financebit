import React from 'react';

const TrendingTicker = ({ trending, onCoinClick }) => {
  return (
    <div className="w-full bg-slate-900/10 dark:bg-black/40 border-b border-slate-200 dark:border-white/5 overflow-hidden flex items-center h-10 transition-colors duration-300">
      <div className="flex items-center gap-8 animate-marquee whitespace-nowrap px-4 hover:pause-animation">
        <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-widest mr-4">🔥 Trending Now:</span>
        {trending.map((coin) => (
          <div 
            key={coin.item.id} 
            onClick={() => onCoinClick(coin.item.id)}
            className="flex items-center gap-2 cursor-pointer group opacity-80 hover:opacity-100 transition-opacity"
          >
            <span className="text-slate-400 dark:text-gray-500 text-xs font-mono">#{coin.item.market_cap_rank || "?"}</span>
            <img src={coin.item.thumb} alt={coin.item.symbol} className="w-4 h-4 rounded-full" />
            <span className="font-bold text-xs text-slate-700 dark:text-white group-hover:text-blue-500 dark:group-hover:text-cyan-400">{coin.item.symbol}</span>
            {coin.item.data && coin.item.data.price_change_percentage_24h && (
               <span className={`text-xs ${coin.item.data.price_change_percentage_24h.usd > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                 {coin.item.data.price_change_percentage_24h.usd > 0 ? '▲' : '▼'}
                 {Math.abs(coin.item.data.price_change_percentage_24h.usd).toFixed(1)}%
               </span>
            )}
          </div>
        ))}
        {/* Duplicado para efecto infinito */}
        {trending.map((coin) => (
          <div 
            key={`${coin.item.id}-dup`} 
            onClick={() => onCoinClick(coin.item.id)}
            className="flex items-center gap-2 cursor-pointer group opacity-80 hover:opacity-100 transition-opacity"
          >
             <span className="text-slate-400 dark:text-gray-500 text-xs font-mono">#{coin.item.market_cap_rank || "?"}</span>
             <img src={coin.item.thumb} alt={coin.item.symbol} className="w-4 h-4 rounded-full" />
             <span className="font-bold text-xs text-slate-700 dark:text-white group-hover:text-blue-500 dark:group-hover:text-cyan-400">{coin.item.symbol}</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 40s linear infinite; }
        .hover\\:pause-animation:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
};

export default TrendingTicker;
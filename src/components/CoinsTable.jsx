import React from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { useCrypto } from '../context/CryptoContext';

const CoinsTable = ({ coins, loading, error, watchlist, toggleWatchlist, formatPrice, setSelectedCoin, fetchData, showFavorites, searchTerm }) => {
  const { currency } = useCrypto();
  
  if (loading) {
    return (
      <div className="overflow-x-auto flex-1 animate-fadeIn">
        <table className="w-full text-left border-collapse">
          <TableHead currency={currency} />
          <tbody>
              {[...Array(10)].map((_, index) => <SkeletonRow key={index} />)}
          </tbody>
        </table>
      </div>
    );
  }

  if (coins.length > 0) {
    return (
      <div className="overflow-x-auto flex-1 animate-fadeIn">
        <table className="w-full text-left border-collapse">
          <TableHead currency={currency} />
          <tbody className="divide-y divide-slate-200 dark:divide-white/5">
            {coins.map((coin) => (
              <tr 
                key={coin.id} 
                onClick={() => setSelectedCoin(coin)}
                className="hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group cursor-pointer"
              >
                <td className="px-2 py-3 md:p-4 text-center">
                  <button 
                    onClick={(e) => toggleWatchlist(e, coin.id)}
                    className={`text-xl transition-transform hover:scale-125 ${
                      watchlist.includes(coin.id) ? 'text-yellow-500 dark:text-yellow-400' : 'text-slate-300 dark:text-gray-600 hover:text-slate-400 dark:hover:text-gray-400'
                    }`}
                  >
                    ★
                  </button>
                </td>

                <td className="px-2 py-3 md:p-4 text-slate-400 dark:text-gray-500 font-mono text-sm hidden sm:table-cell">{coin.market_cap_rank}</td>

                <td className="px-2 py-3 md:p-4 flex items-center gap-2 md:gap-3">
                  <img src={coin.image} alt={coin.name} className="w-8 h-8 md:w-10 md:h-10 rounded-full shadow-md" />
                  <div className="min-w-0 flex flex-col">
                    <p className="font-bold text-slate-700 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors truncate max-w-[80px] sm:max-w-none text-sm md:text-base">
                      {coin.name}
                    </p>
                    <span className="text-xs text-slate-400 dark:text-gray-400 uppercase font-mono">{coin.symbol}</span>
                  </div>
                </td>
                
                <td className="px-2 py-3 md:p-4 font-mono font-bold text-slate-800 dark:text-white tracking-wide text-sm md:text-base">
                  {formatPrice(coin.current_price)}
                  <span className="text-[10px] md:text-xs text-slate-400 dark:text-gray-400 ml-1 font-sans">{currency.toUpperCase()}</span>
                </td>
                
                <td className={`px-2 py-3 md:p-4 font-bold text-sm md:text-base ${coin.price_change_percentage_24h > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  <span className="flex items-center gap-1">
                    {coin.price_change_percentage_24h > 0 ? '▲' : '▼'}
                    {Math.abs(coin.price_change_percentage_24h?.toFixed(2)) || "0.00"}%
                  </span>
                </td>
                <td className="p-4 hidden md:table-cell w-48 h-16">
                  {coin.sparkline_in_7d?.price ? (
                      <SparklineChart data={coin.sparkline_in_7d.price} change={coin.price_change_percentage_24h} />
                  ) : (<span className="text-xs text-slate-400 dark:text-gray-500">Sin datos</span>)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center text-slate-400 dark:text-gray-400 gap-4 animate-fadeIn p-10">
      {error ? (
        <>
          <div className="p-4 bg-red-100 dark:bg-red-500/10 rounded-full"><span className="text-4xl">⚠️</span></div>
          <p className="text-rose-600 dark:text-rose-400 font-bold text-lg text-center max-w-md">{error}</p>
          <button onClick={() => fetchData()} className="px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors font-bold shadow-lg shadow-rose-500/20">Reintentar conexión</button>
        </>
      ) : (
        <>
          <span className="text-6xl grayscale opacity-50">{showFavorites ? "⭐" : "🔍"}</span>
          <p className="text-lg">
            {showFavorites 
              ? "Tu lista de seguimiento está vacía." 
              : `No se encontraron criptomonedas para "${searchTerm}"`
            }
          </p>
        </>
      )}
    </div>
  );
};

const TableHead = ({ currency }) => (
  <thead>
    <tr className="text-slate-500 dark:text-gray-400 border-b border-slate-200 dark:border-white/10 text-xs uppercase bg-slate-50/50 dark:bg-black/20 tracking-wider">
      <th className="px-2 py-3 md:p-4 w-12 text-center">★</th>
      <th className="px-2 py-3 md:p-4 w-16 hidden sm:table-cell">#</th>
      <th className="px-2 py-3 md:p-4">Activo</th>
      <th className="px-2 py-3 md:p-4">Precio ({currency.toUpperCase()})</th>
      <th className="px-2 py-3 md:p-4">24h %</th>
      <th className="p-4 hidden md:table-cell">Tendencia (7d)</th>
    </tr>
  </thead>
);

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-slate-200 dark:border-white/5 last:border-0">
    <td className="p-2 md:p-4"><div className="h-5 w-5 bg-slate-200 dark:bg-white/5 rounded-full mx-auto"></div></td>
    <td className="p-2 md:p-4 hidden sm:table-cell"><div className="h-4 w-6 bg-slate-200 dark:bg-white/5 rounded"></div></td>
    <td className="p-2 md:p-4 flex items-center gap-3">
      <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-200 dark:bg-white/5 rounded-full"></div>
      <div className="space-y-2"><div className="h-4 w-16 md:w-24 bg-slate-200 dark:bg-white/5 rounded"></div><div className="h-3 w-10 md:w-12 bg-slate-200 dark:bg-white/5 rounded"></div></div>
    </td>
    <td className="p-2 md:p-4"><div className="h-5 w-20 bg-slate-200 dark:bg-white/5 rounded"></div></td>
    <td className="p-2 md:p-4"><div className="h-5 w-12 bg-slate-200 dark:bg-white/5 rounded"></div></td>
    <td className="p-4 hidden md:table-cell"><div className="h-12 w-full bg-slate-200 dark:bg-white/5 rounded-lg"></div></td>
  </tr>
);

const SparklineChart = ({ data, change }) => {
  const chartData = data.map((val, index) => ({ index, val }));
  const color = change > 0 ? "#10b981" : "#f43f5e"; 
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <Line type="monotone" dataKey="val" stroke={color} strokeWidth={2} dot={false} />
        <YAxis domain={['auto', 'auto']} hide />
      </LineChart>
    </ResponsiveContainer>
  );
};

CoinsTable.propTypes = {
  coins: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  watchlist: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleWatchlist: PropTypes.func.isRequired,
  formatPrice: PropTypes.func.isRequired,
  setSelectedCoin: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  showFavorites: PropTypes.bool.isRequired,
  searchTerm: PropTypes.string.isRequired
};

TableHead.propTypes = {
  currency: PropTypes.string.isRequired
};

SparklineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
  change: PropTypes.number
};

export default CoinsTable;

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CoinModal = ({ coin, onClose, formatPrice, globalCurrency, isFavorite, toggleWatchlist, darkMode }) => {
  const [amount, setAmount] = useState(100); 
  const [calcCurrency, setCalcCurrency] = useState(globalCurrency); 
  const [calcPrice, setCalcPrice] = useState(coin.current_price); 
  const [chartData, setChartData] = useState([]);
  const [days, setDays] = useState(7); 
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    if (calcCurrency === globalCurrency) { return; }
    const fetchSpecificPrice = async () => {
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin.id}&vs_currencies=${calcCurrency}`);
        const data = await res.json();
        if (data[coin.id] && data[coin.id][calcCurrency]) {
          setCalcPrice(data[coin.id][calcCurrency]);
        }
      } catch (e) { console.error("Error calculando precio", e); }
    };
    fetchSpecificPrice();
  }, [calcCurrency, globalCurrency, coin.id]);

  useEffect(() => {
    const fetchChartData = async () => {
      setChartLoading(true);
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=${globalCurrency}&days=${days}`);
        const data = await res.json();
        const formattedData = data.prices.map((item) => ({ date: item[0], price: item[1] }));
        setChartData(formattedData);
      } catch (error) { console.error("Error fetching chart data:", error); } 
      finally { setChartLoading(false); }
    };
    fetchChartData();
  }, [coin.id, days, globalCurrency]);

  const priceToUse = calcCurrency === globalCurrency ? coin.current_price : calcPrice;
  const cryptoAmount = amount / priceToUse;

  const formatCompact = (num) => {
    return new Intl.NumberFormat(globalCurrency === 'mxn' ? 'es-MX' : 'en-US', {
      style: 'currency',
      currency: globalCurrency.toUpperCase(),
      notation: 'compact',
      maximumFractionDigits: 2
    }).format(num);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn" onClick={handleBackdropClick}>
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden animate-scaleUp flex flex-col max-h-[90vh] transition-colors duration-300">
        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-black/20">
          <div className="flex items-center gap-4">
            <img src={coin.image} alt={coin.name} className="w-14 h-14 rounded-full shadow-lg" />
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                {coin.name}
                <button onClick={(e) => toggleWatchlist(e, coin.id)} className={`text-2xl transition-all hover:scale-110 ${isFavorite ? 'text-yellow-500 dark:text-yellow-400' : 'text-slate-300 dark:text-gray-600 hover:text-yellow-500 dark:hover:text-yellow-400'}`}>★</button>
              </h2>
              <span className="text-blue-600 dark:text-cyan-400 uppercase font-mono font-bold">{coin.symbol}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-full p-2 transition-all">✕</button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div>
                <p className="text-slate-500 dark:text-gray-400 text-sm mb-1 font-medium">Precio Actual</p>
                <div className="flex items-baseline gap-4">
                  <p className="text-4xl font-extrabold font-mono text-slate-800 dark:text-white tracking-tight">
                    {formatPrice(coin.current_price)}
                    <span className="text-sm text-slate-400 dark:text-gray-500 ml-2 font-sans align-middle">{globalCurrency.toUpperCase()}</span>
                  </p>
                  <span className={`px-2 py-1 rounded text-sm font-bold ${coin.price_change_percentage_24h > 0 ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400'}`}>{coin.price_change_percentage_24h?.toFixed(2)}%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <StatCard label="Rango 24h (Bajo)" value={formatCompact(coin.low_24h)} color="text-rose-600 dark:text-rose-300" />
                <StatCard label="Rango 24h (Alto)" value={formatCompact(coin.high_24h)} color="text-emerald-600 dark:text-emerald-300" />
                <StatCard label="Market Cap" value={formatCompact(coin.market_cap)} />
                <StatCard label="Volumen Total" value={formatCompact(coin.total_volume)} />
              </div>
              <div className="bg-slate-50 dark:bg-gray-800/50 p-4 rounded-xl border border-slate-200 dark:border-white/5">
                <h3 className="text-blue-600 dark:text-cyan-400 font-bold mb-3 text-sm uppercase flex items-center gap-2">🧮 Calculadora de Inversión</h3>
                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs text-slate-500 dark:text-gray-400">Si invierto:</label>
                      <select value={calcCurrency} onChange={(e) => setCalcCurrency(e.target.value)} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-white/10 text-xs rounded px-2 py-0.5 text-blue-600 dark:text-cyan-400 outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-800">
                        <option value="usd">USD ($)</option>
                        <option value="mxn">MXN ($)</option>
                        <option value="eur">EUR (€)</option>
                      </select>
                    </div>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg p-3 text-slate-800 dark:text-white font-mono focus:border-blue-500 dark:focus:border-cyan-500 outline-none" />
                  </div>
                  <div className="flex justify-center text-slate-400 dark:text-gray-500">↓</div>
                  <div className="bg-blue-50 dark:bg-cyan-500/10 border border-blue-100 dark:border-cyan-500/20 rounded-lg p-3">
                    <label className="text-xs text-blue-600 dark:text-cyan-400 mb-1 block">Recibo aprox ({coin.symbol.toUpperCase()})</label>
                    <p className="text-xl font-bold font-mono text-blue-500 dark:text-cyan-300">{cryptoAmount.toFixed(6)}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col h-full min-h-[350px] bg-slate-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-slate-200 dark:border-white/5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-slate-500 dark:text-gray-400 text-sm">Tendencia</h3>
                <div className="flex gap-1 bg-white dark:bg-gray-800 rounded-lg p-1 border border-slate-200 dark:border-transparent">
                   {[1, 7, 30, 365].map((d) => (
                     <button key={d} onClick={() => setDays(d)} className={`px-3 py-1 rounded text-xs font-bold transition-colors ${days === d ? 'bg-blue-600 dark:bg-cyan-600 text-white' : 'text-slate-400 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white'}`}>{d === 1 ? '24H' : d === 365 ? '1A' : `${d}D`}</button>
                   ))}
                </div>
              </div>
              <div className="flex-1 w-full relative">
                {chartLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-500 dark:border-cyan-500 border-t-transparent rounded-full animate-spin"></div></div>
                ) : chartData.length > 0 ? (
                  <DetailedChart data={chartData} change={coin.price_change_percentage_24h} days={days} currency={globalCurrency} darkMode={darkMode} />
                ) : ( <div className="h-full flex items-center justify-center text-slate-400 dark:text-gray-500">Sin datos</div> )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => {
  const textColor = color || "text-slate-800 dark:text-white";
  return (
    <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/5">
      <p className="text-xs text-slate-500 dark:text-gray-400 mb-1">{label}</p>
      <p className={`font-mono font-bold text-sm ${textColor} break-all`}>{value}</p>
    </div>
  );
};

const DetailedChart = ({ data, change, days, currency, darkMode }) => {
  const color = change > 0 ? "#10b981" : "#f43f5e";
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorChart" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: darkMode ? '#1e293b' : '#ffffff', 
            borderColor: darkMode ? '#334155' : '#e2e8f0', 
            color: darkMode ? '#fff' : '#1e293b',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
          }}
          itemStyle={{ color: darkMode ? '#fff' : '#1e293b' }}
          labelFormatter={(timestamp) => {
            const date = new Date(timestamp);
            return days === 1 ? date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : date.toLocaleDateString();
          }}
          formatter={(value) => [
            new Intl.NumberFormat(currency === 'mxn' ? 'es-MX' : 'en-US', {
              style: 'currency', currency: currency.toUpperCase(), minimumFractionDigits: 2, maximumFractionDigits: 2,
            }).format(value), "Precio"
          ]}
        />
        <Area type="monotone" dataKey="price" stroke={color} strokeWidth={2} fillOpacity={1} fill="url(#colorChart)" />
        <XAxis dataKey="date" hide />
        <YAxis domain={['auto', 'auto']} hide />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CoinModal;
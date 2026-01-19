import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CoinPage = ({ formatPrice, currency, watchlist, toggleWatchlist, darkMode }) => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [amount, setAmount] = useState(100); 
  const [targetPrice, setTargetPrice] = useState(0); 
  const [currentPrice, setCurrentPrice] = useState(0); 
  
  const [isAmountFocused, setIsAmountFocused] = useState(false);
  const [isTargetFocused, setIsTargetFocused] = useState(false);
  
  const [chartData, setChartData] = useState([]);
  const [days, setDays] = useState(7); 
  const [chartLoading, setChartLoading] = useState(true);

  const calculateSmartTarget = (price) => {
    const rawTarget = price * 1.5; 
    let decimals = 2;
    if (price < 1) decimals = 4;
    if (price < 0.01) decimals = 8;
    return parseFloat(rawTarget.toFixed(decimals));
  };

  const formatInputDisplay = (val, isFocused) => {
    if (isFocused) return val;
    if (!val && val !== 0) return "";
    return new Intl.NumberFormat('en-US', { 
      maximumFractionDigits: 8,
      useGrouping: true 
    }).format(val);
  };

  const handleInputChange = (val, setter) => {
    if (val === "") {
      setter("");
      return;
    }
    const cleanVal = val.replace(/,/g, '');
    if (!isNaN(cleanVal) && cleanVal.length <= 12) {
      setter(cleanVal);
    }
  };

  useEffect(() => {
    const fetchCoinData = async () => {
      setLoading(true);
      const cacheKey = `coin_detail_${id}_${currency}`;
      
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          setCoin(data);
          setCurrentPrice(data.current_price);
          setTargetPrice(calculateSmartTarget(data.current_price)); 
          setLoading(false);
          return;
        }
      }

      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${id}&sparkline=true`);
        if (res.status === 429) throw new Error("Rate limit");
        const data = await res.json();
        
        if (data.length > 0) {
          setCoin(data[0]);
          setCurrentPrice(data[0].current_price);
          setTargetPrice(calculateSmartTarget(data[0].current_price)); 
          localStorage.setItem(cacheKey, JSON.stringify({ data: data[0], timestamp: Date.now() }));
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error(error);
        if (cached) {
            const { data } = JSON.parse(cached);
            setCoin(data);
            setCurrentPrice(data.current_price);
            setTargetPrice(calculateSmartTarget(data.current_price));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCoinData();
  }, [id, currency, navigate]);

  useEffect(() => {
    const fetchChartData = async () => {
      setChartLoading(true);
      const cacheKey = `coin_chart_${id}_${currency}_${days}`;

      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 10 * 60 * 1000) {
            setChartData(data);
            setChartLoading(false);
            return;
        }
      }

      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`);
        if (!res.ok) return;
        const data = await res.json();
        const formattedData = data.prices.map((item) => ({ date: item[0], price: item[1] }));
        setChartData(formattedData);
        localStorage.setItem(cacheKey, JSON.stringify({ data: formattedData, timestamp: Date.now() }));
      } catch (error) { console.error(error); } 
      finally { setChartLoading(false); }
    };
    fetchChartData();
  }, [id, days, currency]);

  if (loading || !coin) {
    return (
      <div className="min-h-screen flex justify-center items-center pt-20">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const numericAmount = Number(amount);
  const numericTarget = Number(targetPrice);
  const coinsOwned = numericAmount / currentPrice; 
  const futureValue = coinsOwned * numericTarget; 
  const profit = futureValue - numericAmount; 
  const percentageGrowth = currentPrice > 0 
    ? ((numericTarget - currentPrice) / currentPrice) * 100 
    : 0;

  const isFavorite = watchlist.includes(coin.id);

  const formatCompact = (num) => {
    return new Intl.NumberFormat(currency === 'mxn' ? 'es-MX' : 'en-US', {
      style: 'currency', currency: currency.toUpperCase(), notation: 'compact', maximumFractionDigits: 2
    }).format(num);
  };

  const formatMoney = (num) => {
    if (!num && num !== 0) return "0.00";
    return new Intl.NumberFormat(currency === 'mxn' ? 'es-MX' : 'en-US', {
      style: 'currency', currency: currency.toUpperCase(), minimumFractionDigits: 2, maximumFractionDigits: 2
    }).format(num);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-48 md:pt-40 pb-12 animate-fadeIn">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-cyan-400 transition-colors font-bold"
      >
        ← Volver
      </button>

      <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden p-6 md:p-8 transition-colors duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-200 dark:border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <img src={coin.image} alt={coin.name} className="w-16 h-16 rounded-full shadow-lg" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                {coin.name}
                <button 
                  onClick={(e) => toggleWatchlist(e, coin.id)} 
                  className={`text-3xl transition-all hover:scale-110 ${isFavorite ? 'text-yellow-500 dark:text-yellow-400' : 'text-slate-300 dark:text-gray-600 hover:text-yellow-500'}`}
                >
                  ★
                </button>
              </h1>
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-cyan-400 px-3 py-1 rounded-lg text-sm font-bold font-mono tracking-wider">
                {coin.symbol.toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-4xl font-extrabold font-mono text-slate-800 dark:text-white tracking-tight">
              {formatPrice(coin.current_price)}
            </p>
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold mt-2 ${coin.price_change_percentage_24h > 0 ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400'}`}>
               {coin.price_change_percentage_24h > 0 ? '▲' : '▼'}
               {Math.abs(coin.price_change_percentage_24h?.toFixed(2))}% (24h)
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Rango 24h (Bajo)" value={formatCompact(coin.low_24h)} color="text-rose-600 dark:text-rose-300" />
              <StatCard label="Rango 24h (Alto)" value={formatCompact(coin.high_24h)} color="text-emerald-600 dark:text-emerald-300" />
              <StatCard label="Market Cap" value={formatCompact(coin.market_cap)} />
              <StatCard label="Volumen Total" value={formatCompact(coin.total_volume)} />
            </div>

            <div className="bg-slate-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-inner">
              <h3 className="text-blue-600 dark:text-cyan-400 font-bold mb-4 uppercase flex items-center gap-2">🚀 Simulador de Ganancias</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 dark:text-gray-400 mb-1 block">Si invierto hoy ({currency.toUpperCase()}):</label>
                  <input 
                    type="text" 
                    value={formatInputDisplay(amount, isAmountFocused)}
                    onChange={(e) => handleInputChange(e.target.value, setAmount)}
                    onFocus={() => setIsAmountFocused(true)}
                    onBlur={() => setIsAmountFocused(false)}
                    className="w-full bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-3 text-slate-800 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-gray-400 mb-1 block flex justify-between">
                    <span>Y el precio sube a:</span>
                    <span className={percentageGrowth >= 0 ? "text-emerald-500" : "text-rose-500"}>
                      {percentageGrowth > 0 ? "+" : ""}{percentageGrowth.toFixed(2)}%
                    </span>
                  </label>
                  <input 
                    type="text"
                    value={formatInputDisplay(targetPrice, isTargetFocused)}
                    onChange={(e) => handleInputChange(e.target.value, setTargetPrice)}
                    onFocus={() => setIsTargetFocused(true)}
                    onBlur={() => setIsTargetFocused(false)}
                    className="w-full bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-3 text-slate-800 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500 outline-none" 
                  />
                </div>
                <div className="border-t border-slate-200 dark:border-white/10 my-2"></div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-white/5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-500 dark:text-gray-400">Valor Futuro:</span>
                    <span className="font-bold text-slate-800 dark:text-white break-all">{formatMoney(futureValue || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 dark:text-gray-400">Tu Ganancia Neta:</span>
                    <span className={`font-bold font-mono text-lg break-all ${profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {profit > 0 ? "+" : ""}{formatMoney(profit || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col h-[500px] bg-slate-50 dark:bg-gray-900/50 rounded-2xl p-4 md:p-6 border border-slate-200 dark:border-white/5">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-slate-500 dark:text-gray-400 font-bold text-sm md:text-base">Historial de Precio</h3>
                
                <div className="flex gap-1 bg-white dark:bg-gray-800 p-1 rounded-lg border border-slate-200 dark:border-transparent overflow-x-auto max-w-[200px] md:max-w-none scrollbar-hide">
                   {[1, 7, 30, 365].map((d) => (
                     <button 
                        key={d} 
                        onClick={() => setDays(d)} 
                        className={`whitespace-nowrap px-3 py-1 md:px-4 md:py-1.5 rounded-md text-xs md:text-sm font-bold transition-all ${days === d ? 'bg-blue-600 dark:bg-cyan-600 text-white shadow-md' : 'text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-700'}`}
                      >
                        {d === 1 ? '24H' : d === 365 ? '1A' : `${d}D`}
                      </button>
                   ))}
                </div>

              </div>
              <div className="flex-1 w-full relative">
              {chartLoading ? (
                <div className="absolute inset-0 flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 dark:border-cyan-500 border-t-transparent rounded-full animate-spin"></div></div>
              ) : chartData.length > 0 ? (
                <DetailedChart data={chartData} change={coin.price_change_percentage_24h} days={days} currency={currency} darkMode={darkMode} />
              ) : ( <div className="h-full flex items-center justify-center text-slate-400">Sin datos</div> )}
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
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm">
      <p className="text-xs text-slate-500 dark:text-gray-400 mb-1">{label}</p>
      <p className={`font-mono font-bold text-base ${textColor} break-all`}>{value}</p>
    </div>
  );
};

const DetailedChart = ({ data, change, days, currency, darkMode }) => {
  const color = change > 0 ? "#10b981" : "#f43f5e";
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorChartPage" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Tooltip 
          contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#ffffff', borderColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#fff' : '#1e293b', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          itemStyle={{ color: darkMode ? '#fff' : '#1e293b' }}
          labelFormatter={(timestamp) => {
            const date = new Date(timestamp);
            return days === 1 ? date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : date.toLocaleDateString();
          }}
          formatter={(value) => [ new Intl.NumberFormat(currency === 'mxn' ? 'es-MX' : 'en-US', { style: 'currency', currency: currency.toUpperCase() }).format(value), "Precio" ]}
        />
        <Area type="monotone" dataKey="price" stroke={color} strokeWidth={3} fillOpacity={1} fill="url(#colorChartPage)" />
        <XAxis dataKey="date" hide />
        <YAxis domain={['auto', 'auto']} hide />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CoinPage;
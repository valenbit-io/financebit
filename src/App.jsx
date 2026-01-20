import { useEffect, useState, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Header from './components/Header';
import Home from './pages/Home';
import CoinPage from './pages/CoinPage';
import FavoritesModal from './components/FavoritesModal';

function App() {
  const navigate = useNavigate();
  
  // Lista principal para la TABLA (paginada de 10 en 10)
  const [coins, setCoins] = useState([]);
  
  // 👇 NUEVO: Lista exclusiva para el HEADER (Top 50 para que haya variedad)
  const [tickerCoins, setTickerCoins] = useState([]);
  
  const [heroCoins, setHeroCoins] = useState([]);
  const [trending, setTrending] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currency, setCurrency] = useState('usd');
  const [showFavorites, setShowFavorites] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    if (localStorage.getItem('theme')) {
      return localStorage.getItem('theme') === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Fetch de Tendencias (backup)
  useEffect(() => {
    const fetchTrending = async () => {
      const cacheKey = 'trending_coins';
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 15 * 60 * 1000) {
          setTrending(data);
          return;
        }
      }

      try {
        const res = await fetch('https://api.coingecko.com/api/v3/search/trending');
        if (!res.ok) return;
        const data = await res.json();
        setTrending(data.coins);
        localStorage.setItem(cacheKey, JSON.stringify({ data: data.coins, timestamp: Date.now() }));
      } catch (e) {
        console.error(e);
      }
    };
    fetchTrending();
  }, []);

  // 👇 NUEVO EFECTO: Descargar Top 50 monedas para la cinta (independiente de la tabla)
  useEffect(() => {
    const fetchTickerData = async () => {
      // Usamos caché para no saturar la API (validez 5 minutos)
      const cacheKey = `ticker_top_50_${currency}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          setTickerCoins(data);
          return;
        }
      }

      try {
        // Pedimos 50 monedas para asegurar mezcla de rojos y verdes
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`);
        if (!res.ok) return;
        const data = await res.json();
        setTickerCoins(data);
        localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
      } catch (e) {
        console.error("Error cargando ticker:", e);
      }
    };
    fetchTickerData();
  }, [currency]);

  // Lógica del Hero (Monedas destacadas)
  useEffect(() => {
    if (coins.length > 0) {
      const shuffleCoins = () => {
        const shuffled = [...coins].sort(() => 0.5 - Math.random());
        setHeroCoins(shuffled.slice(0, 3));
      };
      shuffleCoins();
      const intervalId = setInterval(shuffleCoins, 4000);
      return () => clearInterval(intervalId);
    }
  }, [coins]);

  // Fetch Principal de la Tabla (Paginado)
  const fetchData = useCallback(async (currCurrency = currency, currPage = page, term = searchTerm) => {
    setLoading(true);
    setError(null);

    const cacheKey = `coins_${currCurrency}_${currPage}_${term}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached && !term) { 
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 2 * 60 * 1000) {
        setCoins(data);
        setLoading(false);
        return;
      }
    }

    try {
      let url = "";
      if (term) {
        setIsSearching(true);
        const searchRes = await fetch(`https://api.coingecko.com/api/v3/search?query=${term}`);
        const searchData = await searchRes.json();
        const coinIds = searchData.coins.slice(0, 10).map(coin => coin.id).join(',');
        
        if (coinIds) {
          url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currCurrency}&ids=${coinIds}&order=market_cap_desc&sparkline=true`;
        } else {
          setCoins([]);
          setLoading(false);
          return;
        }
      } else {
        setIsSearching(false);
        // Aquí seguimos pidiendo solo 10 para la paginación de la tabla
        url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currCurrency}&order=market_cap_desc&per_page=10&page=${currPage}&sparkline=true`;
      }

      const res = await fetch(url);
      if (res.status === 429) throw new Error("Rate limit exceeded. Please wait.");
      if (!res.ok) throw new Error("Server error.");
      
      const data = await res.json();
      setCoins(data);

      if (!term) {
        localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
      if (cached) {
        const { data } = JSON.parse(cached);
        setCoins(data);
        setError(null); 
      } else {
        setCoins([]);
      }
    } finally {
      setLoading(false);
    }
  }, [currency, page, searchTerm]); 

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!searchTerm) fetchData(currency, page, "");
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchData, currency, page, searchTerm]);

  const handleReset = () => {
    setSearchTerm("");
    setIsSearching(false);
    setShowFavorites(false);
    setPage(1);
    setError(null);
    setLoading(true);
    fetchData(currency, 1, ""); 
    navigate("/"); 
  };

  const toggleWatchlist = (e, coinId) => {
    e.stopPropagation(); 
    setWatchlist(prev => {
      if (prev.includes(coinId)) return prev.filter(id => id !== coinId); 
      return [...prev, coinId]; 
    });
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat(currency === 'mxn' ? 'es-MX' : 'en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(price);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData(currency, 1, searchTerm);
    navigate("/"); 
  };

  const handleTickerClick = (coinId) => {
    setSearchTerm(coinId);
    fetchData(currency, 1, coinId);
    navigate("/"); 
  };

  const clearSearch = () => {
    setSearchTerm("");
    setIsSearching(false);
    setPage(1); 
    fetchData(currency, 1, ""); 
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-800 dark:text-white font-sans flex flex-col items-center relative overflow-x-hidden transition-colors duration-300">
      
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-[120px]"></div>
      </div>

      <Header 
        // 🔥 CAMBIO CLAVE: Pasamos la lista de 50 (tickerCoins) en lugar de la de 10 (coins)
        coins={tickerCoins} 
        trending={trending}
        handleTickerClick={handleTickerClick}
        handleReset={handleReset}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currency={currency}
        setCurrency={(newCurrency) => {
            setCoins([]); 
            setLoading(true);
            setCurrency(newCurrency);
        }}
        watchlist={watchlist}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        isSearching={isSearching}
        clearSearch={clearSearch}
        searchTerm={searchTerm}
      />

      <main className="w-full max-w-7xl z-10 px-4 pt-48 md:pt-40 pb-12 flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={
            <Home 
              coins={coins}
              heroCoins={heroCoins}
              loading={loading}
              error={error}
              currency={currency}
              watchlist={watchlist}
              toggleWatchlist={toggleWatchlist}
              formatPrice={formatPrice}
              fetchData={fetchData}
              showFavorites={showFavorites}
              searchTerm={searchTerm}
              isSearching={isSearching}
            />
          } />
          <Route path="/coin/:id" element={
            <CoinPage 
              formatPrice={formatPrice}
              currency={currency}
              watchlist={watchlist}
              toggleWatchlist={toggleWatchlist}
              darkMode={darkMode}
            />
          } />
        </Routes>
      </main>

      {!isSearching && !loading && !error && (
         <div className="w-full max-w-7xl z-10 px-4 pb-12 flex flex-col md:flex-row justify-between items-center gap-4 mx-auto mt-auto">
            <button 
              onClick={() => setPage(prev => Math.max(prev - 1, 1))} 
              disabled={page === 1} 
              className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold transition-all border text-sm ${page === 1 ? 'bg-slate-200 dark:bg-gray-800/50 text-slate-400 dark:text-gray-600 border-transparent cursor-not-allowed' : 'bg-white dark:bg-gray-800 text-slate-700 dark:text-white border-slate-200 dark:border-white/10 hover:border-blue-500 dark:hover:border-cyan-500/50'}`}
            >
              ← Anterior
            </button>
            
            <span className="text-slate-500 dark:text-gray-400 font-mono text-sm bg-white/50 dark:bg-gray-900/50 px-6 py-3 rounded-xl border border-slate-200 dark:border-white/5 whitespace-nowrap">
              Página <span className="text-blue-600 dark:text-cyan-400 font-bold ml-2">{page}</span>
            </span>
            
            <button 
              onClick={() => setPage(prev => prev + 1)} 
              className="w-full md:w-auto px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-600 dark:to-blue-600 hover:brightness-110 text-white text-sm shadow-lg shadow-blue-500/20 transition-all"
            >
              Siguiente →
            </button>
         </div>
      )}

      {showFavorites && (
        <FavoritesModal 
          watchlist={watchlist}
          currency={currency}
          onClose={() => setShowFavorites(false)}
          toggleWatchlist={toggleWatchlist}
          formatPrice={formatPrice}
          onNavigate={(id) => {
            navigate(`/coin/${id}`);
          }}
        />
      )}
    </div>
  );
}

export default App;
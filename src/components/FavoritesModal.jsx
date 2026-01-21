import React, { useEffect, useState } from 'react';
import { useCache } from '../hooks/useCache';
import { CoinGeckoService } from '../services/api';

const FavoritesModal = ({ watchlist, currency, onClose, toggleWatchlist, formatPrice, onNavigate }) => {
  const [favCoins, setFavCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getCache, setCache } = useCache();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (watchlist.length === 0) {
        setFavCoins([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      // Crear una clave de caché única basada en los IDs y la moneda
      const ids = watchlist.join(',');
      const cacheKey = `fav_coins_${ids}_${currency}`;

      // 1. Intentar obtener del caché primero (5 minutos de validez)
      const cachedData = getCache(cacheKey, 5);
      if (cachedData) {
        setFavCoins(cachedData);
        setLoading(false);
        return;
      }

      // 2. Si no hay caché, consultar a la API
      try {
        const data = await CoinGeckoService.getCoinsByIds(currency, ids, false);
        setFavCoins(data);
        setCache(cacheKey, data);
      } catch (error) {
        console.error("Error cargando favoritos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [watchlist, currency, getCache, setCache]);

  // Cerrar con la tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <span className="text-yellow-500">★</span> Favoritos
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : favCoins.length === 0 ? (
            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
              <p className="text-4xl mb-4">📭</p>
              <p>No tienes monedas en favoritos aún.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {favCoins.map(coin => (
                <div 
                  key={coin.id}
                  onClick={() => { onNavigate(coin.id); onClose(); }}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white">{coin.name}</h3>
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase">{coin.symbol}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="text-right">
                      <p className="font-mono font-bold text-slate-800 dark:text-white">{formatPrice(coin.current_price)}</p>
                      <p className={`text-xs font-bold ${coin.price_change_percentage_24h >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                      </p>
                    </div>
                    <button 
                      onClick={(e) => toggleWatchlist(e, coin.id)}
                      className="p-2 text-yellow-500 hover:text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                      title="Quitar de favoritos"
                    >
                      ★
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesModal;
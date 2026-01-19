import React, { useEffect, useState } from 'react';

const FavoritesModal = ({ 
  watchlist, 
  currency, 
  onClose, 
  toggleWatchlist, 
  onNavigate, 
  formatPrice 
}) => {
  const [favCoins, setFavCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos de las monedas favoritas
  useEffect(() => {
    const fetchFavorites = async () => {
      if (watchlist.length === 0) {
        setFavCoins([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Pedimos solo las monedas que están en la watchlist
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${watchlist.join(',')}&order=market_cap_desc`
        );
        const data = await res.json();
        setFavCoins(data);
      } catch (error) {
        console.error("Error cargando favoritos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [watchlist, currency]);

  // Cerrar al hacer clic fuera
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-[60] flex justify-end transition-opacity duration-300 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto animate-slideInRight border-l border-slate-200 dark:border-white/10">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            ⭐ Tus Favoritas
          </h2>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            ✕
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : favCoins.length === 0 ? (
          <div className="text-center py-10 text-slate-500 dark:text-gray-400">
            <p className="text-4xl mb-2">😴</p>
            <p>Aún no tienes favoritos.</p>
            <p className="text-sm mt-2">Usa la estrella ★ para agregar.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {favCoins.map((coin) => (
              <div 
                key={coin.id}
                onClick={() => {
                  onNavigate(coin.id);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer transition-all border border-slate-200 dark:border-transparent group"
              >
                <div className="flex items-center gap-3">
                  <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-bold text-slate-700 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400">{coin.name}</p>
                    <span className="text-xs text-slate-400 uppercase">{coin.symbol}</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-mono font-bold text-slate-800 dark:text-white text-sm">
                    {formatPrice(coin.current_price)}
                  </p>
                  <p className={`text-xs font-bold ${coin.price_change_percentage_24h > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {coin.price_change_percentage_24h > 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                  </p>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWatchlist(e, coin.id);
                  }}
                  className="ml-2 text-yellow-500 hover:text-red-500 transition-colors"
                >
                  ★
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesModal;
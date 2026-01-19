import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import CoinsTable from '../components/CoinsTable';

const Home = ({ 
  coins, 
  heroCoins, 
  loading, 
  error, 
  currency, 
  watchlist, 
  toggleWatchlist, 
  formatPrice, 
  fetchData, 
  showFavorites, 
  searchTerm,
  isSearching 
}) => {
  const navigate = useNavigate();

  const handleCoinClick = (coin) => {
    navigate(`/coin/${coin.id}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      
      {!isSearching && !showFavorites && !loading && !error && heroCoins.length > 0 && (
        <HeroSection 
          coins={heroCoins} 
          formatPrice={formatPrice} 
          setSelectedCoin={handleCoinClick} 
          currency={currency} 
        />
      )}
      
      <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 dark:border-white/5 min-h-[500px] flex flex-col overflow-hidden transition-colors duration-300">
        <CoinsTable 
          coins={coins}
          loading={loading}
          error={error}
          currency={currency}
          watchlist={watchlist}
          toggleWatchlist={toggleWatchlist}
          formatPrice={formatPrice}
          setSelectedCoin={handleCoinClick} 
          fetchData={fetchData}
          showFavorites={showFavorites}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
};

export default Home;
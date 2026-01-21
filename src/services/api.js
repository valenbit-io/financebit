const BASE_URL = import.meta.env.VITE_API_URL || "https://api.coingecko.com/api/v3";

export const CoinGeckoService = {
  getTrending: async (options = {}) => {
    const response = await fetch(`${BASE_URL}/search/trending`, options);
    if (!response.ok) throw new Error("Error fetching trending coins");
    return response.json();
  },

  getMarkets: async (currency, page = 1, perPage = 10, sparkline = true, options = {}) => {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=${sparkline}`,
      options
    );
    if (!response.ok) throw new Error("Error fetching markets");
    return response.json();
  },

  searchCoins: async (query, options = {}) => {
    const response = await fetch(`${BASE_URL}/search?query=${query}`, options);
    if (!response.ok) throw new Error("Error searching coins");
    return response.json();
  },

  getCoinsByIds: async (currency, ids, sparkline = true, options = {}) => {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=${currency}&ids=${ids}&order=market_cap_desc&sparkline=${sparkline}`,
      options
    );
    if (!response.ok) throw new Error("Error fetching specific coins");
    return response.json();
  }
};

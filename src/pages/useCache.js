import { useCallback } from 'react';

export const useCache = () => {
  /**
   * Retrieves data from localStorage.
   * @param {string} key - The cache key.
   * @param {number|null} durationInMinutes - If provided, checks if data is fresher than this duration. If null, returns data regardless of age.
   * @returns {any|null} - The cached data or null if not found/expired.
   */
  const getCache = useCallback((key, durationInMinutes = null) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      if (!parsed || typeof parsed !== 'object' || !('data' in parsed) || !('timestamp' in parsed)) {
        return null;
      }

      const { data, timestamp } = parsed;

      if (durationInMinutes !== null) {
        const age = Date.now() - timestamp;
        if (age > durationInMinutes * 60 * 1000) {
          return null;
        }
      }

      return data;
    } catch (error) {
      console.error("Error reading cache:", error);
      return null;
    }
  }, []);

  const setCache = useCallback((key, data) => {
    try {
      const cacheItem = { data, timestamp: Date.now() };
      localStorage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.error("Error setting cache:", error);
    }
  }, []);

  return { getCache, setCache };
};
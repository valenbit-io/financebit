import React, { createContext, useContext, useState } from 'react';

const CryptoContext = createContext();

export const CryptoProvider = ({ children }) => {
  const [currency, setCurrency] = useState("usd");
  const symbol = currency === "eur" ? "€" : "$";

  return (
    <CryptoContext.Provider value={{ currency, symbol, setCurrency }}>
      {children}
    </CryptoContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCrypto = () => {
  const context = useContext(CryptoContext);
  if (!context) throw new Error('useCrypto debe usarse dentro de un CryptoProvider');
  return context;
};

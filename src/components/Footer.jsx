import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full max-w-7xl mx-auto px-4 py-8 mt-auto border-t border-slate-200 dark:border-white/5 z-10 relative">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} FinanceBit. Proyecto de Portafolio.</p>
        <div className="flex items-center gap-6">
          <a href="https://www.coingecko.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
            Datos por CoinGecko API
          </a>
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
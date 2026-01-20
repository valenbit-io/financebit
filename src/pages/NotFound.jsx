import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 animate-fadeIn">
      <h1 className="text-9xl font-black text-slate-200 dark:text-slate-800 select-none">404</h1>
      <div className="absolute mt-2">
        <p className="text-2xl font-bold text-slate-700 dark:text-white mb-6">Página no encontrada</p>
        <Link 
          to="/" 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/30"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}

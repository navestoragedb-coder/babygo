
import React from 'react';
import { Language } from '../types';

interface NotFoundProps {
  onBackHome: () => void;
  language: Language;
}

const NotFound: React.FC<NotFoundProps> = ({ onBackHome, language }) => {
  const t = {
    en: {
      title: '404',
      subtitle: 'Analysis Interrupted',
      message: "We couldn't find the page you're looking for. Our AI suggests it might have been moved or doesn't exist yet.",
      btn: 'Back to Discovery'
    },
    es: {
      title: '404',
      subtitle: 'Análisis Interrumpido',
      message: "No pudimos encontrar la página que buscas. Nuestra IA sugiere que podría haber sido movida o aún no existe.",
      btn: 'Volver al Inicio'
    }
  }[language];

  return (
    <div className="flex-grow flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="relative">
        <h1 className="text-[12rem] md:text-[18rem] font-black text-white/5 leading-none select-none">
          {t.title}
        </h1>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="material-symbols-outlined text-primary text-6xl md:text-8xl animate-pulse mb-4">
            running_with_errors
          </span>
          <h2 className="text-white text-3xl md:text-4xl font-bold tracking-tight">
            {t.subtitle}
          </h2>
        </div>
      </div>
      <p className="text-slate-400 text-lg max-w-md mt-6">
        {t.message}
      </p>
      <button
        onClick={onBackHome}
        className="mt-10 px-8 py-4 bg-primary hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:-translate-y-1"
      >
        {t.btn}
      </button>
    </div>
  );
};

export default NotFound;

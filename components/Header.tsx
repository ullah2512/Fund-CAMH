
import React from 'react';

interface HeaderProps {
  isLive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isLive = true }) => {
  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-indigo-100 shadow-xl transition-transform hover:scale-105">
            <i className="fa-solid fa-hand-holding-heart"></i>
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-slate-900 leading-none">
              Fund <span className="text-indigo-600">CAMH</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
              {isLive ? 'Global Sync Active' : 'Local Preview'}
            </span>
          </div>
          
          <a 
            href="https://give.camh.ca/site/Donation2?df_id=2463&2463.donation=form1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 md:px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 flex items-center gap-2 text-xs md:text-sm active:scale-95"
          >
            <i className="fa-solid fa-heart-pulse animate-pulse"></i>
            Donate Now
          </a>
        </div>
      </div>
    </header>
  );
};


import React, { useRef, useCallback } from 'react';

interface HeaderProps {
  isLive?: boolean;
  onModeratorTrigger?: () => void;
}

const TAP_COUNT_THRESHOLD = 5;
const TAP_TIMEOUT_MS = 2000;

export const Header: React.FC<HeaderProps> = ({ isLive = true, onModeratorTrigger }) => {
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoTap = useCallback(() => {
    tapCountRef.current += 1;

    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, TAP_TIMEOUT_MS);

    if (tapCountRef.current >= TAP_COUNT_THRESHOLD) {
      tapCountRef.current = 0;
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      onModeratorTrigger?.();
    }
  }, [onModeratorTrigger]);

  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            onClick={handleLogoTap}
            role="button"
            tabIndex={-1}
            aria-hidden="true"
            className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-indigo-100 shadow-xl transition-transform hover:scale-105 select-none cursor-pointer"
          >
            <span className="relative">
              <i className="fa-solid fa-hand-fist text-2xl"></i>
              <i className="fa-solid fa-fire text-xs absolute -top-2.5 -right-2.5 text-orange-300"></i>
            </span>
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-slate-900 leading-none">
              Hear The <span className="text-indigo-600">Fight</span>
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
            Donate to CAMH
          </a>
        </div>
      </div>
    </header>
  );
};

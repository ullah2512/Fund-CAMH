import React, { useState } from 'react';

interface PreviewGateProps {
  onUnlock: () => void;
}

export const PreviewGate: React.FC<PreviewGateProps> = ({ onUnlock }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if passcode is correct
    if (passcode === 'CAMH-2025') {
      // Save to localStorage so the gate won't show again
      localStorage.setItem('camh_preview_unlocked', 'true');
      onUnlock();
    } else {
      // Show error with shake animation
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-200">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
            <i className="fa-solid fa-lock text-3xl"></i>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Preview Access</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            This platform is in preview mode. Please enter the access code to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 text-center">
              Access Code
            </label>
            <input
              type="text"
              autoFocus
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode"
              className={`w-full p-5 bg-slate-50 border rounded-2xl outline-none transition-all text-center font-mono text-lg tracking-wider ${
                error 
                  ? 'border-red-500 animate-shake' 
                  : 'border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            />
            {error && (
              <p className="text-red-500 text-xs text-center mt-2 font-semibold animate-fade-in">
                <i className="fa-solid fa-circle-exclamation mr-1"></i>
                Incorrect passcode. Please try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 text-lg"
          >
            <i className="fa-solid fa-key text-sm"></i>
            Unlock Preview
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            For access, contact the project team
          </p>
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

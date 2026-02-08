
import React, { useState } from 'react';

interface PrivateGateProps {
  onUnlock: () => void;
}

export const PREVIEW_ACCEPTED_KEY = 'camh_preview_accepted';
const PREVIEW_PASSCODE = 'CAMH-2025';

export const PrivateGate: React.FC<PrivateGateProps> = ({ onUnlock }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Check if the passcode matches
    if (code === PREVIEW_PASSCODE) {
      // Save to localStorage so user doesn't see gate again
      localStorage.setItem(PREVIEW_ACCEPTED_KEY, 'true');
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-slate-200">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
            <i className="fa-solid fa-lock text-2xl"></i>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Private Preview</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            This platform is currently in early access. 
            Please enter the passcode to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2 ml-1">
              Passcode
            </label>
            <input
              type="text"
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter passcode"
              className={`w-full p-5 bg-slate-50 border rounded-2xl outline-none transition-all text-center font-mono text-lg ${
                error ? 'border-red-500 animate-shake' : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
              }`}
            />
            {error && (
              <p className="text-red-500 text-sm font-medium mt-2 ml-1 animate-fade-in">
                <i className="fa-solid fa-circle-exclamation mr-1"></i>
                Incorrect passcode. Please try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-arrow-right-to-bracket"></i>
            Access Preview
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-xs text-slate-400">
            Need access? Contact the project administrator.
          </p>
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-shake {
          animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

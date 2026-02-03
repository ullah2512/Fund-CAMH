
import React, { useState } from 'react';

interface PrivateGateProps {
  onUnlock: () => void;
}

export const PrivateGate: React.FC<PrivateGateProps> = ({ onUnlock }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple access code for private preview
    if (code.toUpperCase() === 'CAMH2025') {
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
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Private Preview</h1>
          <p className="text-slate-500 text-sm">
            This platform is currently undergoing a final privacy review. 
            Access is restricted to early contributors.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 ml-1">
              Access Code
            </label>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter access code"
              className={`w-full p-4 bg-slate-50 border rounded-2xl outline-none transition-all ${
                error ? 'border-red-500 animate-shake' : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
              }`}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-key text-xs"></i>
            Unlock Preview
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-xs text-slate-400">
            For access requests, please contact the project administrator.
          </p>
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

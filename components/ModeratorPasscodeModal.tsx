import React, { useState } from 'react';

interface ModeratorPasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const MODERATOR_PASSCODE = 'CAMH-MOD-2025';

export const ModeratorPasscodeModal: React.FC<ModeratorPasscodeModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passcode === MODERATOR_PASSCODE) {
      // Success: authenticate and activate moderator mode
      sessionStorage.setItem('camh_moderator_authenticated', 'true');
      setPasscode('');
      setError(false);
      onSuccess();
    } else {
      // Error: show shake animation and error message
      setError(true);
      setPasscode('');
      setTimeout(() => setError(false), 500);
    }
  };

  const handleClose = () => {
    setPasscode('');
    setError(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-200">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
            <i className="fa-solid fa-shield-halved text-3xl"></i>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Moderator Access</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Enter the moderator passcode to activate moderator mode.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 text-center">
              Moderator Passcode
            </label>
            <input
              type="password"
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

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-5 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-3 text-lg border border-slate-200"
            >
              <i className="fa-solid fa-times text-sm"></i>
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 text-lg"
            >
              <i className="fa-solid fa-key text-sm"></i>
              Unlock
            </button>
          </div>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            Moderator access required
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

export default ModeratorPasscodeModal;

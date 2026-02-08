import React, { useState } from 'react';
import PrivacyGate from './components/PrivacyGate';
import PreviewGate from './components/PreviewGate';

const App = () => {
    const [privacyAccepted, setPrivacyAccepted] = useState(() => {
        try {
            return localStorage.getItem('camh_privacy_accepted') === 'true';
        } catch {
            // localStorage may be unavailable in SSR, private browsing, or restrictive environments
            // Default to false (show privacy gate) for safety
            return false;
        }
    });

    const [previewUnlocked, setPreviewUnlocked] = useState(() => {
        try {
            return localStorage.getItem('camh_preview_unlocked') === 'true';
        } catch {
            // localStorage may be unavailable in SSR, private browsing, or restrictive environments
            // Default to false (show preview gate) for safety
            return false;
        }
    });

    const handlePreviewUnlock = () => {
        setPreviewUnlocked(true);
    };

    return (
        <PrivacyGate privacyAccepted={privacyAccepted} setPrivacyAccepted={setPrivacyAccepted}>
            {previewUnlocked ? (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
                    <div className="text-center">
                        <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
                            <i className="fa-solid fa-check text-4xl"></i>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 mb-4">Preview Unlocked!</h1>
                        <p className="text-slate-600 text-lg">
                            You have successfully unlocked the preview.
                        </p>
                    </div>
                </div>
            ) : (
                <PreviewGate onUnlock={handlePreviewUnlock} />
            )}
        </PrivacyGate>
    );
};

export default App;
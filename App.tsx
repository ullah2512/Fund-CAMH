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

    return (
        <PrivacyGate privacyAccepted={privacyAccepted} setPrivacyAccepted={setPrivacyAccepted}>
            <PreviewGate />
        </PrivacyGate>
    );
};

export default App;
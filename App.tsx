import React, { useState } from 'react';
import PrivacyGate from './components/PrivacyGate';
import PreviewGate from './components/PreviewGate';

const App = () => {
    const [privacyAccepted, setPrivacyAccepted] = useState(() => localStorage.getItem('camh_privacy_accepted') === 'true');

    return (
        <PrivacyGate privacyAccepted={privacyAccepted} setPrivacyAccepted={setPrivacyAccepted}>
            <PreviewGate />
        </PrivacyGate>
    );
};

export default App;
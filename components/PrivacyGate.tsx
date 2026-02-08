import React from 'react';

interface PrivacyGateProps {
  onAccept: () => void;
}

export const PrivacyGate: React.FC<PrivacyGateProps> = ({ onAccept }) => {
  const handleAccept = () => {
    // Save acceptance to localStorage
    localStorage.setItem('camh_privacy_accepted', 'true');
    onAccept();
  };

  return (
    <div className="fixed inset-0 z-[300] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 border border-slate-200 my-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
            <i className="fa-solid fa-shield-halved text-3xl"></i>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Privacy Policy</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Please review our privacy policy before continuing.
          </p>
        </div>

        {/* Scrollable Privacy Policy Content */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 max-h-[400px] overflow-y-auto mb-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Data Collection</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              We collect minimal information necessary to provide our community support platform. This includes:
            </p>
            <ul className="list-disc list-inside text-slate-600 text-sm leading-relaxed mt-2 space-y-1">
              <li>Anonymous community posts and reflections you submit</li>
              <li>Basic interaction data (helpful votes)</li>
              <li>Local browser storage for preferences</li>
            </ul>
            <p className="text-slate-600 text-sm leading-relaxed mt-2">
              We do not collect personally identifiable information such as names, email addresses, or IP addresses.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Community Posts</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Posts you share on the community feed are visible to all users of this platform. Please do not include 
              personal information in your posts. All community contributions are stored to provide a supportive 
              environment for mental health awareness and fundraising for CAMH.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">AI Reflection Service</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Our platform uses AI technology to provide thoughtful reflections on community posts. These reflections 
              are generated to offer supportive perspectives and are not medical advice. Your post content may be 
              processed by third-party AI services for this purpose.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Your Privacy Rights</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-slate-600 text-sm leading-relaxed mt-2 space-y-1">
              <li>Request deletion of your community posts by contacting us</li>
              <li>Clear your local browser data at any time</li>
              <li>Use this platform anonymously</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Third-Party Services</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              This platform may use third-party services including Firebase for data storage and Google Generative AI 
              for reflections. These services have their own privacy policies which you should review.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Contact Information</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              If you have questions about this privacy policy or wish to exercise your privacy rights, please contact 
              the project team through the GitHub repository or CAMH's official channels.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <p className="text-slate-400 text-xs italic">
              Last updated: February 2026
            </p>
          </div>
        </div>

        {/* Accept Button */}
        <button
          onClick={handleAccept}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 text-lg"
        >
          <i className="fa-solid fa-check-circle text-sm"></i>
          I Agree
        </button>

        <div className="mt-6 text-center">
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            By continuing, you accept our privacy policy
          </p>
        </div>
      </div>
    </div>
  );
};

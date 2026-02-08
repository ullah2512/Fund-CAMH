
import React, { useState, useEffect } from 'react';

interface PrivacyGateProps {
  children: React.ReactNode;
}

export const PrivacyGate: React.FC<PrivacyGateProps> = ({ children }) => {
  const [hasAccepted, setHasAccepted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user has already accepted the privacy policy
    const accepted = localStorage.getItem('camh_privacy_accepted');
    if (accepted === 'true') {
      setHasAccepted(true);
    }
    setIsLoading(false);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('camh_privacy_accepted', 'true');
    setHasAccepted(true);
  };

  // Don't render anything while checking localStorage
  if (isLoading) {
    return null;
  }

  // If user has accepted, show the app
  if (hasAccepted) {
    return <>{children}</>;
  }

  // Show the privacy gate
  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-3xl w-full shadow-2xl border border-slate-100 my-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-shield-halved text-2xl"></i>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Privacy Policy</h2>
          <p className="text-slate-500 text-sm">
            Please review our privacy policy before using this platform.
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 md:p-8 max-h-[50vh] overflow-y-auto border border-slate-200 mb-6 space-y-6 text-left">
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-circle-info text-indigo-600 text-sm"></i>
              Overview
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              The Fund CAMH platform is a community awareness project designed to redirect support to the 
              Centre for Addiction and Mental Health (CAMH). This privacy policy explains how we handle your 
              information when you use our platform.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-database text-indigo-600 text-sm"></i>
              Data Collection Practices
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed mb-2">
              We collect minimal information necessary to operate the community feed:
            </p>
            <ul className="list-disc list-inside text-slate-700 text-sm space-y-1 ml-2">
              <li>Anonymous community posts you choose to share</li>
              <li>Post categories and timestamps</li>
              <li>Helpful vote counts on posts</li>
              <li>Local browser storage for your privacy acceptance</li>
            </ul>
            <p className="text-slate-700 text-sm leading-relaxed mt-2">
              <strong className="text-slate-900">We do NOT collect:</strong> Personal identifying information, 
              email addresses, names, or any contact details. All posts are completely anonymous.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-comments text-indigo-600 text-sm"></i>
              Use of Community Posts
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              Community posts are shared publicly on the platform to foster support and awareness. By submitting 
              a post, you grant permission for it to be displayed anonymously on the community feed. Posts may 
              be moderated for appropriateness. You are responsible for ensuring your posts do not contain 
              personally identifying information.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-robot text-indigo-600 text-sm"></i>
              AI Reflection Service
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              Our platform uses Google's Gemini AI to provide supportive reflections on community posts. When you 
              submit a post, the content is sent to Gemini API to generate an empathetic response. This processing 
              is done in real-time and the content is not stored by the AI service beyond what's necessary for 
              generating the reflection. Please refer to Google's privacy policy for information on how they handle 
              API requests.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-user-shield text-indigo-600 text-sm"></i>
              Your Privacy Rights
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed mb-2">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-slate-700 text-sm space-y-1 ml-2">
              <li>Access and review posts you have contributed (through browser history during your session)</li>
              <li>Request removal of your posts by contacting a moderator</li>
              <li>Clear your browser's local storage at any time to reset your privacy acceptance</li>
              <li>Stop using the platform at any time</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-shield-heart text-indigo-600 text-sm"></i>
              Data Security
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              We use Firebase for secure data storage and synchronization. All data transmission is encrypted. 
              However, please remember that no method of transmission over the internet is 100% secure. We 
              encourage you to avoid sharing sensitive personal information in your posts.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-handshake-angle text-indigo-600 text-sm"></i>
              Third-Party Services
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              This platform integrates with:
            </p>
            <ul className="list-disc list-inside text-slate-700 text-sm space-y-1 ml-2 mt-2">
              <li><strong>CAMH Donation Portal:</strong> When you click donation links, you are directed to CAMH's official donation page. We do not handle any payment information.</li>
              <li><strong>Google Gemini API:</strong> Used for AI-generated reflections on posts.</li>
              <li><strong>Firebase:</strong> Used for real-time database and hosting services.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-child text-indigo-600 text-sm"></i>
              Children's Privacy
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              This platform is not intended for children under 13. We do not knowingly collect information from 
              children. If you believe a child has submitted information, please contact us immediately.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-file-contract text-indigo-600 text-sm"></i>
              Changes to Privacy Policy
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              We may update this privacy policy from time to time. Changes will be reflected on this page. 
              Your continued use of the platform after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-envelope text-indigo-600 text-sm"></i>
              Contact Information
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              If you have questions or concerns about this privacy policy or your data, please contact the 
              project administrator through the platform's admin interface. For questions about CAMH's services 
              or donations, please visit{' '}
              <a 
                href="https://www.camh.ca" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 font-semibold underline"
              >
                www.camh.ca
              </a>
              .
            </p>
          </section>

          <section className="pt-4 border-t border-slate-200">
            <p className="text-slate-500 text-xs italic">
              Last updated: February 2026
            </p>
          </section>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleAccept}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <i className="fa-solid fa-check-circle"></i>
            I Agree
          </button>
        </div>

        <p className="text-center text-slate-400 text-xs mt-6">
          By clicking "I Agree", you acknowledge that you have read and understood this privacy policy.
        </p>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { 
          animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
      `}</style>
    </div>
  );
};

import React, { useState } from 'react';

export const ContactModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-slate-400 hover:text-indigo-600 text-sm font-medium transition-colors flex items-center gap-2"
      >
        <i className="fa-solid fa-envelope text-xs"></i>
        Contact Us
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-slate-400 hover:text-indigo-600 text-sm font-medium transition-colors flex items-center gap-2"
      >
        <i className="fa-solid fa-envelope text-xs"></i>
        Contact Us
      </button>

      {/* Modal overlay */}
      <div className="fixed inset-0 z-[300] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 border border-slate-200 my-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
              <i className="fa-solid fa-envelope text-3xl"></i>
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Contact Us</h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Have a question, suggestion, or concern? We'd love to hear from you.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                <i className="fa-solid fa-envelope text-lg"></i>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Email</p>
                <a
                  href="mailto:ullah.nas@outlook.com"
                  className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm transition-colors"
                >
                  ullah.nas@outlook.com
                </a>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <p className="text-slate-600 text-sm leading-relaxed">
                Whether you have questions about the platform, want to report an issue, or would like to get involved in supporting mental health initiatives — reach out and we'll get back to you as soon as possible.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <a
              href="mailto:ullah.nas@outlook.com"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 text-lg no-underline"
            >
              <i className="fa-solid fa-paper-plane text-sm"></i>
              Send an Email
            </a>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3 text-base border border-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactModal;

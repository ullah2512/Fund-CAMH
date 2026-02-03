
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PostForm } from './components/PostForm';
import { PostList } from './components/PostList';
import { Post, Category } from './types';
import { api } from './services/api';
import { isConfigured } from './services/firebase';

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [moderatorMode, setModeratorMode] = useState<boolean>(false);
  const [showModAuth, setShowModAuth] = useState<boolean>(false);
  const [modPassword, setModPassword] = useState<string>('');
  const [modError, setModError] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(false);

  const donationUrl = "https://give.camh.ca/site/Donation2?df_id=2463&2463.donation=form1";
  const MOD_SECRET = "CAMH-ADMIN-2025";

  useEffect(() => {
    if (isConfigured) {
      const unsubscribe = api.subscribeToPosts((updatedPosts) => {
        setPosts(updatedPosts);
        setIsLive(true);
      });
      return () => unsubscribe();
    } else {
      const saved = localStorage.getItem('camh_local_posts');
      if (saved) setPosts(JSON.parse(saved));
      setIsLive(false);
    }
  }, []);

  const handleAddPost = async (content: string, category: Category, aiReflection: string) => {
    if (!isConfigured) {
      const newPost: Post = {
        id: Math.random().toString(36).substr(2, 9),
        author: 'Community Member (Local)',
        content,
        category,
        timestamp: Date.now(),
        aiReflection,
        helpfulCount: 0
      };
      const updated = [newPost, ...posts];
      setPosts(updated);
      localStorage.setItem('camh_local_posts', JSON.stringify(updated));
      return;
    }
    try {
      await api.createPost({ author: 'Community Member', content, category, aiReflection });
    } catch (err) {
      console.error("Failed to sync post:", err);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!isConfigured) {
      const updated = posts.filter(p => p.id !== id);
      setPosts(updated);
      localStorage.setItem('camh_local_posts', JSON.stringify(updated));
      return;
    }
    await api.deletePost(id);
  };

  const handleToggleHelpful = async (id: string) => {
    if (!isConfigured) {
      const updated = posts.map(p => p.id === id ? { ...p, helpfulCount: (p.helpfulCount || 0) + 1 } : p);
      setPosts(updated);
      localStorage.setItem('camh_local_posts', JSON.stringify(updated));
      return;
    }
    await api.toggleHelpful(id);
  };

  const handleModLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (modPassword === MOD_SECRET) {
      setModeratorMode(true);
      setShowModAuth(false);
      setModPassword('');
      setModError(false);
    } else {
      setModError(true);
      setTimeout(() => setModError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <Header isLive={isLive && isConfigured} />

      {/* Admin Login Modal */}
      {showModAuth && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border border-slate-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-shield-halved text-2xl"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-900">Admin Access</h3>
              <p className="text-slate-500 text-sm mt-2">Manage the community feed.</p>
            </div>
            <form onSubmit={handleModLogin} className="space-y-4">
              <input 
                type="password"
                autoFocus
                value={modPassword}
                onChange={(e) => setModPassword(e.target.value)}
                placeholder="Passcode"
                className={`w-full p-5 bg-slate-50 border rounded-2xl outline-none transition-all text-center font-mono text-lg ${
                  modError ? 'border-red-500 animate-shake' : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
                }`}
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModAuth(false)} className="flex-1 py-4 font-bold text-slate-400">Cancel</button>
                <button type="submit" className="flex-[2] bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl active:scale-95">Verify</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-12 md:py-20">
        {/* HERO SECTION */}
        <section className="text-center mb-16 animate-fade-in">
          <div className="mb-8">
            <span className="inline-block px-5 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              Community Awareness Project
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-[100px] font-[950] text-slate-900 leading-[0.85] tracking-tighter mb-8">
            Don't Fund <span className="text-indigo-600">Me.</span>
            <br />
            Go Fund <span className="text-indigo-600">CAMH.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 font-medium leading-tight max-w-2xl mx-auto mb-10">
            100% of your support should go directly to the experts at the <strong className="text-slate-900 font-black">Centre for Addiction and Mental Health.</strong>
          </p>

          <div className="flex justify-center mb-20">
            <a
              href={donationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-indigo-600 text-white px-14 py-7 rounded-[2.5rem] font-black text-2xl hover:bg-indigo-700 transition-all shadow-[0_25px_50px_rgba(79,70,229,0.3)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 group"
            >
              <i className="fa-solid fa-heart-pulse group-hover:animate-ping"></i>
              Give Directly to CAMH
            </a>
          </div>

          {/* COMMUNITY FEED - INTEGRATED DIRECTLY BELOW */}
          <div className="text-left space-y-10">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight whitespace-nowrap">Community Feed</h2>
              <div className="h-px w-full bg-slate-200"></div>
            </div>

            <div className="bg-white p-6 md:p-10 rounded-[3rem] border border-slate-200 shadow-sm transition-all hover:shadow-md">
               <PostForm onAddPost={handleAddPost} />
            </div>
            
            <div className="flex items-center justify-between px-2">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Voices of Support</p>
              <button 
                onClick={() => moderatorMode ? setModeratorMode(false) : setShowModAuth(true)}
                className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all border ${
                  moderatorMode ? 'bg-red-600 text-white border-red-700 shadow-lg' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                }`}
              >
                <i className={`fa-solid ${moderatorMode ? 'fa-unlock' : 'fa-lock'} mr-1.5`}></i>
                {moderatorMode ? 'Exit Admin' : 'Admin'}
              </button>
            </div>

            <PostList 
              posts={posts} 
              onDeletePost={handleDeletePost}
              onToggleHelpful={handleToggleHelpful} 
              moderatorMode={moderatorMode} 
            />
          </div>
        </section>
      </main>

      <footer className="py-16 px-6 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-indigo-400 mb-6">Transparency First</p>
          <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-lg mx-auto">
            This project is independent. We do not handle money. All donation links lead to the verified CAMH portal.
          </p>
          <div className="mt-8 text-slate-200">
            <i className="fa-solid fa-handshake-angle text-3xl"></i>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-fade-in { 
          animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        .animate-shake { 
          animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both; 
        }
      `}</style>
    </div>
  );
};

export default App;

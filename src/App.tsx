import React, { useState, useEffect } from 'react';
import ModeratorPasscodeModal from '../components/ModeratorPasscodeModal';
import { PrivacyPolicyModal } from '../components/PrivacyPolicyModal';
import { ContactModal } from '../components/ContactModal';
import { Header } from '../components/Header';
import { PostForm } from '../components/PostForm';
import { PostList } from '../components/PostList';
import { PendingPostsQueue } from '../components/PendingPostsQueue';
import { Post, Category } from '../types';
import { api } from '../services/api';

const App = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [pendingPosts, setPendingPosts] = useState<Post[]>([]);
    const [moderatorMode, setModeratorMode] = useState(false);
    const [showModeratorPasscodeModal, setShowModeratorPasscodeModal] = useState(false);
    const [moderatorAuthenticated, setModeratorAuthenticated] = useState(() => {
        try {
            return sessionStorage.getItem('camh_moderator_authenticated') === 'true';
        } catch {
            return false;
        }
    });

    useEffect(() => {
        const unsubscribe = api.subscribeToPosts((newPosts) => {
            setPosts(newPosts);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (moderatorMode) {
            const unsubscribe = api.subscribeToPendingPosts((newPendingPosts) => {
                setPendingPosts(newPendingPosts);
            });
            return unsubscribe;
        } else {
            setPendingPosts([]);
        }
    }, [moderatorMode]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'M') {
                handleModeratorTrigger();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [moderatorAuthenticated]);

    const handleModeratorTrigger = () => {
        const isAuthenticated = sessionStorage.getItem('camh_moderator_authenticated') === 'true';
        if (!isAuthenticated) {
            setShowModeratorPasscodeModal(true);
        } else {
            setModeratorMode(prev => !prev);
        }
    };

    const handleAddPost = async (content: string, category: Category, aiReflection: string) => {
        try {
            await api.createPost({ author: 'Anonymous', content, category, aiReflection });
        } catch (error) {
            console.error('Failed to create post:', error);
        }
    };

    const handleDeletePost = async (id: string) => {
        try {
            await api.deletePost(id);
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    const handleToggleHelpful = async (id: string, delta: 1 | -1) => {
        try {
            await api.toggleHelpful(id, delta);
        } catch (error) {
            console.error('Failed to toggle helpful:', error);
        }
    };

    const handleModeratorAuthentication = () => {
        setModeratorAuthenticated(true);
        setModeratorMode(true);
        setShowModeratorPasscodeModal(false);
    };

    const handleApprovePost = async (id: string) => {
        try {
            await api.approvePost(id);
        } catch (error) {
            console.error('Failed to approve post:', error);
        }
    };

    const handleRejectPost = async (id: string) => {
        try {
            await api.deletePost(id);
        } catch (error) {
            console.error('Failed to reject post:', error);
        }
    };

    return (
        <>
                <div className="min-h-screen bg-slate-50">
                    <Header isLive={true} onModeratorTrigger={handleModeratorTrigger} />
                    {moderatorMode && (
                        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg text-xs font-bold flex items-center gap-2">
                            <span>🛡️</span>
                            <span>Moderator Mode Active</span>
                        </div>
                    )}
                    <main className="max-w-5xl mx-auto px-4 py-8">
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 mb-8 border border-indigo-100 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                    <i className="fa-solid fa-heart-pulse text-xl"></i>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2"> Our Mission </h2>
                                    <p className="text-slate-700 leading-relaxed mb-2">This project was launched in memory of those handed an impossible mission — to fight mental illness alone. May you rest in peace.</p>
                                    <p className="text-slate-700 leading-relaxed mb-4">Here is what we are fighting for:</p>
                                    <ol className="list-decimal list-inside text-slate-700 leading-relaxed space-y-2">
                                        <li>Secure more funding for organizations like CAMH — via donations and earmarked funds from the government.</li>
                                        <li>Push for Ontario disability benefits that people can actually live on.</li>
                                        <li>Simplify the short-term disability process — one built around compassion, not judgement and deadlines.</li>
                                        <li>Bring therapy to patients' doors — so no one has to worry about accessing their own treatment.</li>
                                        <li>Build a financial support hub for patients — so no one has to choose between managing their health and keeping a roof over their head.</li>
                                        <li>Clean house in mental health care — patients deserve professionals who show up with compassion, not judgement and indifference. Those who don't should find a different profession.</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                        <PostForm onAddPost={handleAddPost} />
                        {moderatorMode && (
                            <PendingPostsQueue pendingPosts={pendingPosts} onApprovePost={handleApprovePost} onRejectPost={handleRejectPost} />
                        )}
                        <PostList posts={posts} onDeletePost={handleDeletePost} onToggleHelpful={handleToggleHelpful} moderatorMode={moderatorMode} />
                    </main>
                    <footer className="max-w-5xl mx-auto px-4 py-6 border-t border-slate-200 flex justify-center gap-6">
                        <PrivacyPolicyModal />
                        <span className="text-slate-300">|</span>
                        <ContactModal />
                    </footer>
                    <ModeratorPasscodeModal isOpen={showModeratorPasscodeModal} onClose={() => setShowModeratorPasscodeModal(false)} onSuccess={handleModeratorAuthentication} />
                </div>
        </>
    );
};
export default App;
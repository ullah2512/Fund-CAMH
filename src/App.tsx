import React, { useState, useEffect } from 'react';
import PreviewGate from '../components/PreviewGate';
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
    const [previewUnlocked, setPreviewUnlocked] = useState(() => {
        try {
            return localStorage.getItem('camh_preview_unlocked') === 'true';
        } catch {
            return false;
        }
    });

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
        if (previewUnlocked) {
            const unsubscribe = api.subscribeToPosts((newPosts) => {
                setPosts(newPosts);
            });
            return unsubscribe;
        }
    }, [previewUnlocked]);

    useEffect(() => {
        if (previewUnlocked && moderatorMode) {
            const unsubscribe = api.subscribeToPendingPosts((newPendingPosts) => {
                setPendingPosts(newPendingPosts);
            });
            return unsubscribe;
        } else {
            setPendingPosts([]);
        }
    }, [previewUnlocked, moderatorMode]);

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

    const handlePreviewUnlock = () => {
        try {
            localStorage.setItem('camh_preview_unlocked', 'true');
        } catch {}
        setPreviewUnlocked(true);
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
            {previewUnlocked ? (
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
                                    <p className="text-slate-700 leading-relaxed mb-2">This project was launched in memory of those lost to the deafening silence of mental illness. May you rest in peace.</p>
                                    <p className="text-slate-700 leading-relaxed">Our mission is to fund CAMH, so that everyone—regardless of who they are or what they have—can access the help they need, precisely when they need it most.</p>
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
            ) : (
                <PreviewGate onUnlock={handlePreviewUnlock} />
            )}
        </>
    );
};
export default App;
import React, { useState, useEffect } from 'react';
import PrivacyGate from './components/PrivacyGate';
import PreviewGate from './components/PreviewGate';
import { Header } from './components/Header';
import { PostForm } from './components/PostForm';
import { PostList } from './components/PostList';
import { Post, Category } from './types';
import { api } from './services/api';

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

    const [posts, setPosts] = useState<Post[]>([]);
    const [moderatorMode, setModeratorMode] = useState(false);

    // Subscribe to posts from Firebase
    useEffect(() => {
        if (previewUnlocked) {
            const unsubscribe = api.subscribeToPosts((newPosts) => {
                setPosts(newPosts);
            });
            return unsubscribe;
        }
    }, [previewUnlocked]);

    // Toggle moderator mode with keyboard shortcut (Ctrl+Shift+M)
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'M') {
                setModeratorMode(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    const handlePreviewUnlock = () => {
        try {
            localStorage.setItem('camh_preview_unlocked', 'true');
        } catch {
            // localStorage may be unavailable in SSR, private browsing, or restrictive environments
            // Silently ignore as the in-memory state still works
        }
        setPreviewUnlocked(true);
    };

    const handleAddPost = async (content: string, category: Category, aiReflection: string) => {
        try {
            await api.createPost({
                author: 'Anonymous',
                content,
                category,
                aiReflection
            });
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

    const handleToggleHelpful = async (id: string) => {
        try {
            await api.toggleHelpful(id);
        } catch (error) {
            console.error('Failed to toggle helpful:', error);
        }
    };

    return (
        <PrivacyGate privacyAccepted={privacyAccepted} setPrivacyAccepted={setPrivacyAccepted}>
            {previewUnlocked ? (
                <div className="min-h-screen bg-slate-50">
                    <Header isLive={true} />
                    <main className="max-w-5xl mx-auto px-4 py-8">
                        <PostForm onAddPost={handleAddPost} />
                        <PostList 
                            posts={posts}
                            onDeletePost={handleDeletePost}
                            onToggleHelpful={handleToggleHelpful}
                            moderatorMode={moderatorMode}
                        />
                    </main>
                </div>
            ) : (
                <PreviewGate onUnlock={handlePreviewUnlock} />
            )}
        </PrivacyGate>
    );
};

export default App;
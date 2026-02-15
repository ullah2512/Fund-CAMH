
import React, { useState } from 'react';
import { Post } from '../types';

// Helper to get/set hearted post IDs in localStorage
const HEARTED_KEY = 'camh_hearted_posts';

function getHeartedPosts(): Set<string> {
  try {
    const stored = localStorage.getItem(HEARTED_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function saveHeartedPosts(hearted: Set<string>) {
  try {
    localStorage.setItem(HEARTED_KEY, JSON.stringify([...hearted]));
  } catch {
    // Silently ignore
  }
}

interface PostListProps {
  posts: Post[];
  onDeletePost: (id: string) => void;
  onToggleHelpful: (id: string, delta: 1 | -1) => void;
  moderatorMode: boolean;
}

export const PostList: React.FC<PostListProps> = ({ posts, onDeletePost, onToggleHelpful, moderatorMode }) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isAnimatingId, setIsAnimatingId] = useState<string | null>(null);
  const [heartedPosts, setHeartedPosts] = useState<Set<string>>(() => getHeartedPosts());

  const handleToggleHelpful = (id: string) => {
    const isCurrentlyHearted = heartedPosts.has(id);
    const post = posts.find(p => p.id === id);
    const currentCount = post?.helpfulCount || 0;

    // If not hearted yet, block if already at cap of 50
    if (!isCurrentlyHearted && currentCount >= 50) return;

    const newHearted = new Set(heartedPosts);
    if (isCurrentlyHearted) {
      newHearted.delete(id);
      onToggleHelpful(id, -1);
    } else {
      newHearted.add(id);
      onToggleHelpful(id, 1);
    }
    setHeartedPosts(newHearted);
    saveHeartedPosts(newHearted);
  };

  const handleTriggerDelete = (id: string) => {
    // If not already in confirm state, switch to confirm state
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }

    // If already in confirm state, execute the deletion
    setIsAnimatingId(id);
    
    // Slight delay to allow animation to show before removal from DOM
    setTimeout(() => {
      onDeletePost(id);
      setConfirmDeleteId(null);
      setIsAnimatingId(null);
    }, 200);
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
          <i className="fa-solid fa-comment-medical text-2xl"></i>
        </div>
        <h4 className="text-slate-800 font-bold mb-1">Quiet in the community</h4>
        <p className="text-slate-500 text-sm">Be the first to share a supportive thought above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div 
          key={post.id} 
          className={`group bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden relative ${
            isAnimatingId === post.id ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'
          } ${
            moderatorMode 
              ? 'border-red-200 ring-1 ring-red-50 shadow-sm' 
              : 'border-slate-200 hover:border-indigo-200 hover:shadow-md'
          }`}
        >
          {moderatorMode && (
            <div className="bg-red-50 border-b border-red-100 px-6 py-3 flex items-center justify-between relative z-30 pointer-events-auto">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">
                  Moderator Action Required
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {confirmDeleteId === post.id && (
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="text-slate-500 hover:text-slate-700 text-[10px] font-bold uppercase tracking-tight px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-sm"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleTriggerDelete(post.id);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-2 shadow-sm active:scale-95 ${
                    confirmDeleteId === post.id
                      ? 'bg-red-600 text-white border-red-700 animate-pulse'
                      : 'bg-white text-red-600 border-red-200 hover:bg-red-50'
                  }`}
                >
                  <i className={`fa-solid ${confirmDeleteId === post.id ? 'fa-triangle-exclamation' : 'fa-trash-can'} text-[10px]`}></i>
                  {confirmDeleteId === post.id ? 'Confirm Removal?' : 'Delete Post'}
                </button>
              </div>
            </div>
          )}

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-full uppercase tracking-widest">
                {post.category}
              </span>
              <span className="text-slate-400 text-xs flex items-center gap-1.5 font-medium">
                <i className="fa-regular fa-calendar"></i>
                {new Date(post.timestamp).toLocaleDateString()}
              </span>
            </div>
            
            <p className="text-slate-700 leading-relaxed mb-6 whitespace-pre-wrap font-medium">
              {post.content}
            </p>
            
            {post.aiReflection && (
              <div className="bg-gradient-to-r from-slate-50 to-white border-l-4 border-indigo-400 p-4 rounded-r-xl">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-[10px] uppercase tracking-widest mb-1.5">
                  <i className="fa-solid fa-sparkles"></i>
                  Supportive Reflection
                </div>
                <p className="text-slate-600 text-sm italic leading-snug">
                  "{post.aiReflection}"
                </p>
              </div>
            )}
            
            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 text-[10px]">
                  <i className="fa-solid fa-user"></i>
                </div>
                <span className="text-slate-400 text-xs italic">{post.author}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  type="button"
                  onClick={() => handleToggleHelpful(post.id)}
                  className={`transition-all duration-300 flex items-center gap-2 px-3 py-1.5 rounded-full border group/btn active:scale-90 ${
                    heartedPosts.has(post.id)
                      ? 'bg-indigo-50 border-indigo-100 text-indigo-600' 
                      : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-600'
                  }`}
                >
                  <i className={`${heartedPosts.has(post.id) ? 'fa-solid' : 'fa-regular'} fa-heart group-hover/btn:scale-125 transition-transform`}></i>
                  <span className="text-xs font-bold">{(post.helpfulCount || 0) > 0 ? post.helpfulCount : 'Helpful'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

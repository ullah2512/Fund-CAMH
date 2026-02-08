
import React, { useState } from 'react';
import { Post } from '../types';

interface PendingPostsQueueProps {
  pendingPosts: Post[];
  onApprovePost: (id: string) => void;
  onRejectPost: (id: string) => void;
}

export const PendingPostsQueue: React.FC<PendingPostsQueueProps> = ({ 
  pendingPosts, 
  onApprovePost, 
  onRejectPost 
}) => {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await onApprovePost(id);
      setSuccessMessage('Post approved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Failed to approve post:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await onRejectPost(id);
      setSuccessMessage('Post rejected and removed.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Failed to reject post:', error);
    } finally {
      setProcessingId(null);
    }
  };

  if (pendingPosts.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-circle-check text-green-600 text-2xl"></i>
          </div>
          <h4 className="text-slate-800 font-bold mb-1">All caught up!</h4>
          <p className="text-slate-500 text-sm">No posts pending approval at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
            <i className="fa-solid fa-hourglass-half text-white text-lg"></i>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">⏳ Posts Awaiting Approval</h3>
            <p className="text-slate-600 text-sm">
              {pendingPosts.length} {pendingPosts.length === 1 ? 'post' : 'posts'} pending moderator review
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-fade-in">
          <i className="fa-solid fa-circle-check text-green-600 text-xl"></i>
          <p className="text-green-800 font-semibold text-sm">{successMessage}</p>
        </div>
      )}

      {/* Pending Posts List */}
      <div className="space-y-4">
        {pendingPosts.map((post) => (
          <div 
            key={post.id}
            className="bg-white rounded-2xl shadow-sm border border-yellow-200 overflow-hidden hover:shadow-md transition-all"
          >
            {/* Post Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-full uppercase tracking-widest">
                  {post.category}
                </span>
                <span className="text-slate-400 text-xs flex items-center gap-1.5 font-medium">
                  <i className="fa-regular fa-calendar"></i>
                  {new Date(post.timestamp).toLocaleDateString()} at {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <p className="text-slate-700 leading-relaxed mb-4 whitespace-pre-wrap font-medium">
                {post.content}
              </p>
              
              {post.aiReflection && (
                <div className="bg-gradient-to-r from-slate-50 to-white border-l-4 border-indigo-400 p-4 rounded-r-xl mb-4">
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-[10px] uppercase tracking-widest mb-1.5">
                    <i className="fa-solid fa-sparkles"></i>
                    AI Reflection
                  </div>
                  <p className="text-slate-600 text-sm italic leading-snug">
                    "{post.aiReflection}"
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => handleReject(post.id)}
                disabled={processingId === post.id}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 border ${
                  processingId === post.id
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200'
                    : 'bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 active:scale-95 shadow-sm'
                }`}
              >
                <i className="fa-solid fa-xmark text-lg"></i>
                Reject
              </button>
              
              <button
                onClick={() => handleApprove(post.id)}
                disabled={processingId === post.id}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                  processingId === post.id
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md active:scale-95'
                }`}
              >
                {processingId === post.id ? (
                  <>
                    <i className="fa-solid fa-circle-notch animate-spin"></i>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-check text-lg"></i>
                    Approve
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

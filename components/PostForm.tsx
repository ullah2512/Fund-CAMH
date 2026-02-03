
import React, { useState } from 'react';
import { Category } from '../types';
import { enhancePost } from '../services/gemini';

interface PostFormProps {
  onAddPost: (content: string, category: Category, aiReflection: string) => void;
}

export const PostForm: React.FC<PostFormProps> = ({ onAddPost }) => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('General Support');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Use Gemini to get a supportive reflection
      const aiReflection = await enhancePost(content, category);
      onAddPost(content, category, aiReflection);
      setContent('');
      setCategory('General Support');
    } catch (error) {
      console.error("Failed to post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8 transition-all hover:shadow-md">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
        <i className="fa-solid fa-pen-to-square text-indigo-500"></i>
        Share a Helpful Thought or Resource
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's a tip or encouraging word you'd like to share today?"
            className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-slate-700 placeholder:text-slate-400"
            required
          />
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-sm font-medium text-slate-500 whitespace-nowrap">Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full text-slate-700 cursor-pointer transition-colors"
            >
              <option value="General Support">General Support</option>
              <option value="Anxiety">Anxiety</option>
              <option value="Depression">Depression</option>
              <option value="Resources">Resources</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className={`w-full sm:w-auto px-8 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              isSubmitting || !content.trim() 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md active:scale-95'
            }`}
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-circle-notch animate-spin"></i>
                Processing...
              </>
            ) : (
              <>
                <i className="fa-solid fa-paper-plane text-xs"></i>
                Post Anonymously
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

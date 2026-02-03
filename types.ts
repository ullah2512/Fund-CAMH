
export type Category = 'Anxiety' | 'Depression' | 'General Support' | 'Resources';

export interface Post {
  id: string;
  author: string;
  content: string;
  category: Category;
  timestamp: number;
  aiReflection?: string;
  helpfulCount?: number;
}

export interface GeminiResponse {
  reflection: string;
  suggestion: string;
}

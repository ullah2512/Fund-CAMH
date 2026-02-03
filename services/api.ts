import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  doc, 
  deleteDoc, 
  updateDoc, 
  increment 
} from "@firebase/firestore";
import { Post } from '../types';
import { db, isConfigured } from './firebase';

const POSTS_COLLECTION = 'posts';

export const api = {
  /**
   * Subscribes to post changes in real-time.
   */
  subscribeToPosts(callback: (posts: Post[]) => void) {
    if (!isConfigured || !db) {
      console.warn("API: Firestore not available for subscription.");
      return () => {};
    }

    try {
      const postsRef = collection(db, POSTS_COLLECTION);
      const q = query(postsRef, orderBy('timestamp', 'desc'));

      return onSnapshot(q, (snapshot) => {
        const posts: Post[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          posts.push({
            id: docSnap.id,
            author: data.author,
            content: data.content,
            category: data.category,
            timestamp: data.timestamp,
            aiReflection: data.aiReflection,
            helpfulCount: data.helpfulCount || 0
          } as Post);
        });
        callback(posts);
      }, (error) => {
        console.error("Firestore Subscription Error:", error);
      });
    } catch (e) {
      console.error("Failed to setup subscription:", e);
      return () => {};
    }
  },

  /**
   * Submits a new post to the global feed.
   */
  async createPost(postData: Omit<Post, 'id' | 'timestamp' | 'helpfulCount'>): Promise<string> {
    if (!isConfigured || !db) throw new Error("Firebase not configured or initialized");

    const newPostData = {
      ...postData,
      timestamp: Date.now(),
      helpfulCount: 0
    };

    try {
      const postsRef = collection(db, POSTS_COLLECTION);
      const docRef = await addDoc(postsRef, newPostData);
      return docRef.id;
    } catch (error) {
      console.error("Firestore Error [createPost]:", error);
      throw error;
    }
  },

  /**
   * Deletes a post from the global feed.
   */
  async deletePost(id: string): Promise<void> {
    if (!isConfigured || !db) return;
    try {
      const docRef = doc(db, POSTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Firestore Error [deletePost]:", error);
      throw error;
    }
  },

  /**
   * Increments the helpful count for a post globally.
   */
  async toggleHelpful(id: string): Promise<void> {
    if (!isConfigured || !db) return;
    try {
      const postRef = doc(db, POSTS_COLLECTION, id);
      await updateDoc(postRef, {
        helpfulCount: increment(1)
      });
    } catch (error) {
      console.error("Firestore Error [toggleHelpful]:", error);
      throw error;
    }
  }
};
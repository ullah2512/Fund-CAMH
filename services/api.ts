import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  doc, 
  deleteDoc, 
  updateDoc, 
  increment,
  where 
} from "@firebase/firestore";
import { Post } from '../types';
import { db, isConfigured } from './firebase';

const POSTS_COLLECTION = 'posts';

export const api = {
  /**
   * Subscribes to post changes in real-time.
   * Only returns approved posts (or posts without status field for backwards compatibility)
   */
  subscribeToPosts(callback: (posts: Post[]) => void) {
    if (!isConfigured || !db) {
      console.warn("API: Firestore not available for subscription.");
      return () => {};
    }

    try {
      const postsRef = collection(db, POSTS_COLLECTION);
      // Query all posts, but filter on client side for approved or null status
      const q = query(postsRef, orderBy('timestamp', 'desc'));

      return onSnapshot(q, (snapshot) => {
        const posts: Post[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          
          // Only include posts that are approved or have no status (backwards compatibility)
          if (!data.status || data.status === 'approved') {
            posts.push({
              id: docSnap.id,
              author: data.author,
              content: data.content,
              category: data.category,
              timestamp: data.timestamp,
              aiReflection: data.aiReflection,
              helpfulCount: data.helpfulCount || 0,
              status: data.status || 'approved'
            } as Post);
          }
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
   * Subscribes to pending posts in real-time (for moderators).
   */
  subscribeToPendingPosts(callback: (posts: Post[]) => void) {
    if (!isConfigured || !db) {
      console.warn("API: Firestore not available for subscription.");
      return () => {};
    }

    try {
      const postsRef = collection(db, POSTS_COLLECTION);
      const q = query(
        postsRef, 
        where('status', '==', 'pending'),
        orderBy('timestamp', 'desc')
      );

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
            helpfulCount: data.helpfulCount || 0,
            status: data.status
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
  async createPost(postData: Omit<Post, 'id' | 'timestamp' | 'helpfulCount' | 'status'>): Promise<string> {
    if (!isConfigured || !db) throw new Error("Firebase not configured or initialized");

    const newPostData = {
      ...postData,
      timestamp: Date.now(),
      helpfulCount: 0,
      status: 'pending'
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
   * Toggles the helpful count for a post (increment or decrement by 1).
   */
  async toggleHelpful(id: string, delta: 1 | -1 = 1): Promise<void> {
    if (!isConfigured || !db) return;
    try {
      const postRef = doc(db, POSTS_COLLECTION, id);
      await updateDoc(postRef, {
        helpfulCount: increment(delta)
      });
    } catch (error) {
      console.error("Firestore Error [toggleHelpful]:", error);
      throw error;
    }
  },

  /**
   * Approves a pending post (moderator action).
   */
  async approvePost(id: string): Promise<void> {
    if (!isConfigured || !db) return;
    try {
      const postRef = doc(db, POSTS_COLLECTION, id);
      await updateDoc(postRef, {
        status: 'approved'
      });
    } catch (error) {
      console.error("Firestore Error [approvePost]:", error);
      throw error;
    }
  }
};
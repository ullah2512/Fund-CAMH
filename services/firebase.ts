import { initializeApp, getApps, getApp } from "@firebase/app";
import { getFirestore, Firestore } from "@firebase/firestore";

/**
 * ---------------------------------------------------------
 * FIREBASE CONFIGURATION
 * ---------------------------------------------------------
 */

const firebaseConfig = {
  apiKey: "AIzaSyA8IjOIdKH76Klu5XDxYjF6EnZyY_TaEXQ",
  authDomain: "fund-camh.firebaseapp.com",
  projectId: "fund-camh",
  storageBucket: "fund-camh.firebasestorage.app",
  messagingSenderId: "24730708044",
  appId: "1:24730708044:web:9017d67bc7d7d31a7eace9",
  measurementId: "G-6QF2Q9EX7D"
};

// Detects if real keys are present
export const isConfigured = 
  firebaseConfig.projectId !== "" && 
  firebaseConfig.projectId !== "PASTE_YOUR_PROJECT_ID_HERE" &&
  !firebaseConfig.apiKey.includes("PASTE_YOUR");

let db: Firestore | null = null;

try {
  if (isConfigured) {
    // Standard Firebase initialization pattern to avoid multiple instances
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    
    // Explicitly initialize Firestore with the app instance to ensure the service is registered correctly
    db = getFirestore(app);
    
    console.log("✅ Firebase Connected: Community Feed is now Global.");
  } else {
    console.warn("⚠️ Firebase configuration missing. App will function in local mode.");
  }
} catch (error) {
  console.error("❌ Firebase Initialization Error:", error);
  db = null;
}

export { db };
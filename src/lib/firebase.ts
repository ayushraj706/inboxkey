import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // यहाँ अपनी Firebase Console से मिली डिटेल्स डालें
  apiKey: "AIzaSyD...", 
  authDomain: "ayush-chat.firebaseapp.com",
  projectId: "ayush-chat",
  storageBucket: "ayush-chat.appspot.com",
  messagingSenderId: "123...",
  appId: "1:123..."
};

// अगर ऐप पहले से चल रहा है तो उसे ही यूज़ करें, वरना नया शुरू करें (Singleton Pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);


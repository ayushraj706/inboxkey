import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // अपनी Firebase Config यहाँ पेस्ट करें (जो आपने पहले Console से ली थी)
  apiKey: "AIzaSyD...", 
  authDomain: "ayush-chat.firebaseapp.com",
  projectId: "ayush-chat",
  storageBucket: "ayush-chat.appspot.com",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

// यह नई लाइन है - Google Contacts के लिए
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');

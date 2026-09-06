import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAVOHC74b1-w5_NNPBvwRojAghXhsoTFL0",
  authDomain: "gemini-journal-93e2c.firebaseapp.com",
  projectId: "gemini-journal-93e2c",
  storageBucket: "gemini-journal-93e2c.firebasestorage.app",
  messagingSenderId: "148933346763",
  appId: "1:148933346763:web:a043d2c8738a891f16e24e",
  measurementId: "G-Y09MNVP6ZK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics
const analytics = getAnalytics(app);

// Initialize Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
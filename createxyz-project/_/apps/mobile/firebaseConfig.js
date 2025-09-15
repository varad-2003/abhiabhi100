// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase project settings (from Firebase console → Project settings → SDK setup & config)
const firebaseConfig = {
  apiKey: "AIzaSyALraqhYWyQiMoL9tJKqZVu9mgyF79wpeA",
  authDomain: "smartkrishi-40b63.firebaseapp.com",
  projectId: "smartkrishi-40b63",
  storageBucket: "smartkrishi-40b63.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth
export const auth = getAuth(app);

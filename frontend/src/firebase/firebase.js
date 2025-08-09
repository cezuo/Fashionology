import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD7cw1G-TWTsaCHv4O7InaxFtM61VNdbiM",
  authDomain: "fashionology-96737.firebaseapp.com",
  projectId: "fashionology-96737",
  storageBucket: "fashionology-96737.appspot.com",
  messagingSenderId: "1085847011811",
  appId: "1:1085847011811:web:b499ad922a09ea9ea220d6",
  measurementId: "G-8EJ55JDDSZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Export for use in other files
export { auth, provider, signInWithPopup, db };

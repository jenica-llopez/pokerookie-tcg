import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDPJukKsfp8Dd1vlfve5OmhoepHYdOqBsI",
  authDomain: "pokerookie-tcg.firebaseapp.com",
  projectId: "pokerookie-tcg",
  storageBucket: "pokerookie-tcg.firebasestorage.app",
  messagingSenderId: "595171331918",
  appId: "1:595171331918:web:15b934841b0afc09c0181f",
  measurementId: "G-4PVMZK3QQ5",
};

// UIDs allowed to add, edit, and delete items
export const ADMIN_UIDS = [
  "juRb7XSMlaWCRni9XyA7uXec2nr1", // Jenica (owner)
  "REPLACE_WITH_SECRETARY_UID",    // Secretary — fill in after she logs in
];

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

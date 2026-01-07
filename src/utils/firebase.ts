import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAr8a-VFw4YrlZpBFjCsWmtvdgLjzuNuyE",
  authDomain: "digitl-game.firebaseapp.com",
  projectId: "digitl-game",
  storageBucket: "digitl-game.firebasestorage.app",
  messagingSenderId: "264136933032",
  appId: "1:264136933032:web:70922002525b7f992a0c9d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom database ID
export const db = getFirestore(app, 'digitl-web');


import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBjXSNOr00J6S5DzY5G-_T3u-Uzo8dVzNU",
  authDomain: "antojocriollo-aea5e.firebaseapp.com",
  projectId: "antojocriollo-aea5e",
  storageBucket: "antojocriollo-aea5e.firebasestorage.app",
  messagingSenderId: "1027049041416",
  appId: "1:1027049041416:web:1f60bcb3dc7c9195a8ebbd"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

export { db };
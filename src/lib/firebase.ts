import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCzFW_-M45FReyScJ3zYUdf3PcTAgFwVx4",
  authDomain: "sabkimandi-1b2bc.firebaseapp.com",
  projectId: "sabkimandi-1b2bc",
  storageBucket: "sabkimandi-1b2bc.firebasestorage.app",
  messagingSenderId: "907398008774",
  appId: "1:907398008774:web:ad4153a3b64bb526016cc7",
  measurementId: "G-5T9LN6EXK2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
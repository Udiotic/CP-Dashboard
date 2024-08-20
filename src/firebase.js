import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC4eSrDzuhy2n_xJGg-VBWcNSzSQmLXLC0",
    authDomain: "comp-programming-dashboard.firebaseapp.com",
    projectId: "comp-programming-dashboard",
    storageBucket: "comp-programming-dashboard.appspot.com",
    messagingSenderId: "692756618204",
    appId: "1:692756618204:web:88c783c7af2e44c533cd19",
    measurementId: "G-7GZ1NYNJ7Y"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
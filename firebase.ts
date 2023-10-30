// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD8S9tntUDZRP1yx9t6M-mK-aI8AqfFPEc',
  authDomain: 'next-chat-ai-app.firebaseapp.com',
  projectId: 'next-chat-ai-app',
  storageBucket: 'next-chat-ai-app.appspot.com',
  messagingSenderId: '1035552210244',
  appId: '1:1035552210244:web:3e45d1991284526986ab11',
};

// Initialize Firebase as a single instance
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app);

export { db, auth, functions };

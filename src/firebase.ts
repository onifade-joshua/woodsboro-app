// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDM5LkL9bW1nArkERCBc_XBgNKVsrt7hGI",
  authDomain: "woodsboro-app-4bd08.firebaseapp.com",
  projectId: "woodsboro-app-4bd08",
  storageBucket: "woodsboro-app-4bd08.firebasestorage.app",
  messagingSenderId: "146942014228",
  appId: "1:146942014228:web:63e044a7935ec31da9c801"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

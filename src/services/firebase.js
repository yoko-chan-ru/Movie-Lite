import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBxk7jJhlegmc2aKYaeGz4zOBwlvjPglk8",
  authDomain: "movie-lite-da2de.firebaseapp.com",
  projectId: "movie-lite-da2de",
  storageBucket: "movie-lite-da2de.firebasestorage.app",
  messagingSenderId: "616917360581",
  appId: "1:616917360581:web:0e3f29d8ccf0b6533175ac",
  measurementId: "G-B48TFSZR5N"
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
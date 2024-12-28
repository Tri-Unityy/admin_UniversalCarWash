import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

const firebaseConfig = {

  apiKey: "AIzaSyDrlxc397-k6A_Q_qVikqc_ax-DClE60l4",
  authDomain: "universal-carwash.firebaseapp.com",
  projectId: "universal-carwash",
  storageBucket: "universal-carwash.appspot.com",
  messagingSenderId: "559845262805",
  appId: "1:559845262805:web:ae406857b3b781c672295c",
  measurementId: "G-GYXD17ECTV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
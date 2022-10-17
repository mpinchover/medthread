// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKYEihtV2w2vshH1eKENrB-GXF0ujrg00",
  authDomain: "healthcare-f57e8.firebaseapp.com",
  projectId: "healthcare-f57e8",
  storageBucket: "healthcare-f57e8.appspot.com",
  messagingSenderId: "774435420948",
  appId: "1:774435420948:web:2d58330489014aa6f72001",
  measurementId: "G-830V5H69VT",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

connectAuthEmulator(auth, "http://localhost:9099");
connectFirestoreEmulator(db, "localhost", 8080);

export default app;

// https://blog.logrocket.com/using-firebase-emulator-suite-and-react-for-local-first-development/

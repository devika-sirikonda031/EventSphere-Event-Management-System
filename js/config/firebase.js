// Firebase App
import { initializeApp } 
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";

// Firebase Services
import { getAuth } 
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import { getFirestore } 
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { getStorage } 
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-storage.js";

/* ======================
   FIREBASE CONFIG
====================== */

const firebaseConfig = {
  apiKey: "AIzaSyCQFv2HjMYcln-4J1AZ8PMPRREJ42xWVqA",
  authDomain: "eventmanagementsystem-445bc.firebaseapp.com",
  projectId: "eventmanagementsystem-445bc",
  storageBucket: "eventmanagementsystem-445bc.firebasestorage.app",
  messagingSenderId: "583046124553",
  appId: "1:583046124553:web:1814e1c2e78f8bbe2294d8"
};

/* ======================
   INITIALIZE FIREBASE
====================== */

const app = initializeApp(firebaseConfig);

/* ======================
   SERVICES
====================== */

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);   // ⭐ ADD THIS

console.log("Firebase connected successfully");

/* ======================
   EXPORT SERVICES
====================== */

export { app, auth, db, storage };  // ⭐ ADD storage
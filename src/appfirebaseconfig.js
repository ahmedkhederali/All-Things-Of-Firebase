import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
//  FireStore
import {getFirestore} from "firebase/firestore"
// Storage 
import {getStorage} from "firebase/storage"
const firebaseConfig = {
  apiKey: "AIzaSyDzfW8G_wlz0mq-xLR4lLQmzn9AfaD2Ur0",
  authDomain: "firstpro-220e7.firebaseapp.com",
  projectId: "firstpro-220e7",
  storageBucket: "firstpro-220e7.appspot.com",
  messagingSenderId: "425809947406",
  appId: "1:425809947406:web:5bba5cc1df9af23286055f",
  measurementId: "G-S82BFN4H3K"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database=getFirestore(app)
export const storage=getStorage(app)
const analytics = getAnalytics(app);
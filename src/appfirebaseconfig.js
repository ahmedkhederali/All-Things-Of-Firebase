import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
//  FireStore
import {getFirestore} from "firebase/firestore"
// Storage 
import {getStorage} from "firebase/storage"
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database=getFirestore(app)
export const storage=getStorage(app)
const analytics = getAnalytics(app);
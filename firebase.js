// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7W_MS03FML-uCMEBEg43Ifalv5wdq7gQ",
  authDomain: "myfisher-b85b2.firebaseapp.com",
  projectId: "myfisher-b85b2",
  storageBucket: "myfisher-b85b2.appspot.com",
  messagingSenderId: "453531606799",
  appId: "1:453531606799:web:e16c307efef3fc68ba687a",
  measurementId: "G-D2M81MDSBX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
const firestore = getFirestore(app);
const storage = getStorage(app);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { firestore, storage, auth };

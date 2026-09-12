import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const environment = import.meta.env ?? process.env;

const firebaseConfig = {
  apiKey: environment.VITE_FIREBASE_API_KEY ?? environment.REACT_APP_FIREBASE_API_KEY,
  authDomain: environment.VITE_FIREBASE_AUTH_DOMAIN ?? environment.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: environment.VITE_FIREBASE_PROJECT_ID ?? environment.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: environment.VITE_FIREBASE_STORAGE_BUCKET ?? environment.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: environment.VITE_FIREBASE_MESSAGING_SENDER_ID ?? environment.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: environment.VITE_FIREBASE_APP_ID ?? environment.REACT_APP_FIREBASE_APP_ID,
  measurementId: environment.VITE_FIREBASE_MEASUREMENT_ID ?? environment.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
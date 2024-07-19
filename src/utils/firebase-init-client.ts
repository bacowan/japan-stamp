
// TODO: refactor these into function calls so that they don't get automatically initialized in places I don't want them

import { getAuth, connectAuthEmulator } from "firebase/auth";
import firebase from 'firebase/compat/app';
import "firebase/compat/storage";

const app = firebase.initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
});

export const auth = getAuth(app);
connectAuthEmulator(auth, "http://127.0.0.1:9099"); // TODO: Disable this with environment variables if not using the emulator

export const storage = firebase.storage();
//if (location.hostname === "localhost") {
  // TODO: Again, environment variables are probably better here
  storage.useEmulator("127.0.0.1", 9199);
//}
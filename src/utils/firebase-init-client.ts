
// TODO: refactor these into function calls so that they don't get automatically initialized in places I don't want them

import { getAuth, connectAuthEmulator } from "firebase/auth";
import firebase from 'firebase/compat/app';
import firebaseConfig from "../../firebase-config";
import "firebase/compat/storage";

const app = firebase.initializeApp(firebaseConfig);

export const auth = getAuth(app);
connectAuthEmulator(auth, "http://127.0.0.1:9099"); // TODO: Disable this with environment variables if not using the emulator

export const storage = firebase.storage();
//if (location.hostname === "localhost") {
  // TODO: Again, environment variables are probably better here
  storage.useEmulator("127.0.0.1", 9199);
//}
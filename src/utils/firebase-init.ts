
import { getAuth, connectAuthEmulator } from "firebase/auth";
import firebase from 'firebase/compat/app';
import firebaseConfig from "../../firebase-config";

const app = firebase.initializeApp(firebaseConfig);

const auth = getAuth(app);
connectAuthEmulator(auth, "http://127.0.0.1:9099"); // TODO: Disable this with environment variables if not using the emulator

const storage = firebase.storage();
if (location.hostname === "localhost") {
    // TODO: Again, environment variables are probably better here
    storage.useEmulator("127.0.0.1", 9199);
  } 

export default auth;
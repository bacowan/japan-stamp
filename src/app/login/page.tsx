'use client'

// Import the functions you need from the SDKs you need
import firebaseConfig from "../../../firebase-config";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { useEffect } from "react";
import authConfig from "../../../firebase-config/auth-config";
import firebase from 'firebase/compat/app';
import 'firebaseui/dist/firebaseui.css'

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const auth = getAuth(app);
connectAuthEmulator(auth, "http://127.0.0.1:9099"); // TODO: Disable this with environment variables if not using the emulator

export default function Login() {
    useEffect(() => {
        (async function() {
            const firebaseui = await import("firebaseui");
            var ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
            ui.start('#firebaseui-auth-container', authConfig);
        })();
    }, []);

    return <div className="p-10">
        <div id="firebaseui-auth-container"></div>
    </div>
}
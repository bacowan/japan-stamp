'use client'

// Import the functions you need from the SDKs you need
import auth from '../../utils/firebase-init';
import { useEffect } from "react";
import authConfig from "../../../firebase-config/auth-config";
import 'firebaseui/dist/firebaseui.css'

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
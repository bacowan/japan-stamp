'use client'

// Import the functions you need from the SDKs you need
import { auth } from '../../../utils/firebase-init-client';
import { Suspense, useEffect } from "react";
import authConfig from "../../../../firebase-config/auth-config";
import 'firebaseui/dist/firebaseui.css'
import { redirect, useSearchParams } from 'next/navigation'
import useSignedIn from '@/utils/use-signed-in';

function LoginPage() {
    const searchParams = useSearchParams();
    const isSignedIn = useSignedIn();

    if (isSignedIn === true) {
        const from = searchParams.get('from');
        if (from !== null) {
            redirect(from);
        }
        else {
            redirect("/");
        }
    }

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

export default function Login() {
    return <Suspense>
        <LoginPage/>
    </Suspense>
}
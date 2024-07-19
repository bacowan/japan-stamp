import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from './firebase-init-client';

function useSignedIn() {
    const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsSignedIn(true);
            }
            else {
                setIsSignedIn(false);
            }
        });
        return unsubscribe;
    }, []);
    return isSignedIn;
}

export default useSignedIn;
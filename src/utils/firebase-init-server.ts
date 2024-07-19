
// TODO: refactor these into function calls so that they don't get automatically initialized in places I don't want them

import { getAuth } from 'firebase-admin/auth';
import firebase from 'firebase/compat/app';
import "firebase/compat/storage";
import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';

// TODO: use actual environment variables
process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
process.env.STORAGE_EMULATOR_HOST = 'http://127.0.0.1:9199';

if (!getApps().length) initializeApp({
    credential: applicationDefault(),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
});
export const auth = getAuth();
//export const storage = firebase.storage();
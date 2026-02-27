import { shallowRef } from 'vue';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
  getAuth,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCJmi0lsf8UZxsUkcxzL77JKhZVq5XoIuY',
  authDomain: 'asistente-ce26f.firebaseapp.com',
  projectId: 'asistente-ce26f',
  storageBucket: 'asistente-ce26f.appspot.com',
  messagingSenderId: '783319224009',
  appId: '1:783319224009:web:4619d2d92c829af84c4718',
};

const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

const currentUser = shallowRef<User | null>(auth.currentUser);
const authReady = shallowRef(false);

let authListenerInitialized = false;
let resolveReadyPromise: (() => void) | null = null;
const authReadyPromise = new Promise<void>((resolve) => {
  resolveReadyPromise = resolve;
});

export const authState = {
  currentUser,
  authReady,
};

export function initializeAuthListener() {
  if (authListenerInitialized) {
    return;
  }

  authListenerInitialized = true;
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user;
    if (!authReady.value) {
      authReady.value = true;
      resolveReadyPromise?.();
      resolveReadyPromise = null;
    }
  });
}

export function waitForAuthReady() {
  return authReadyPromise;
}

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, provider);
  currentUser.value = result.user;
  return result.user;
}

export async function signOutUser() {
  await signOut(auth);
}

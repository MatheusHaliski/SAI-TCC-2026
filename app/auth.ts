"use client";

import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  type UserCredential,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { firebaseAuthGate } from "@/app/gate/firebaseClient";

const provider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export async function signInWithGoogle() {
  const { firebaseApp, hasFirebaseConfig } = firebaseAuthGate();
  if (!firebaseApp || !hasFirebaseConfig) {
    throw new Error("Firebase auth is not configured.");
  }

  const auth = getAuth(firebaseApp);
  return signInWithPopup(auth, provider);
}

export async function signInWithFacebook(): Promise<UserCredential> {
  const { firebaseApp, hasFirebaseConfig } = firebaseAuthGate();
  if (!firebaseApp || !hasFirebaseConfig) {
    throw new Error("Firebase auth is not configured.");
  }

  const auth = getAuth(firebaseApp);
  return signInWithPopup(auth, facebookProvider);
}

export async function signOutUser() {
  const { firebaseApp, hasFirebaseConfig } = firebaseAuthGate();
  if (!firebaseApp || !hasFirebaseConfig) return;

  const auth = getAuth(firebaseApp);
  await signOut(auth);
}

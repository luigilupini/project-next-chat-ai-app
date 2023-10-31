'use client';

import { auth } from '@/firebase';
import { signInWithCustomToken } from 'firebase/auth';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

// If the user does not have a firebaseToken, sign them out.
async function syncFirebaseAuth(session: Session) {
  if (session && session.firebaseToken) {
    try {
      await signInWithCustomToken(auth, session.firebaseToken);
    } catch (error) {
      console.error('Error signing in with custom token:', error);
    }
  } else {
    auth.signOut();
  }
}

// 🔥 FIRESTORE
export default function FirebaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;
    // Sync the Firebase auth state if the session changes.
    syncFirebaseAuth(session);
  }, [session]);
  return <>{children}</>;
}

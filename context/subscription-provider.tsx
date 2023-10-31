'use client';

import { subscriptionRef } from '@/lib/converters/Subscription';
import { useSubscriptionStore } from '@/store/store';
import { onSnapshot } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

// 🔥 FIRESTORE & ฅ՞•ﻌ•՞ฅ ZUSTAND
// Here we building a global subscription object that we can use to check if a
// users role status is pro, and if they have exceeded the 3 chats. Open the see
// CreateChatButton for fore info on using this global state to control flow.
export default function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  const setSubscription = useSubscriptionStore(
    (state) => state.setSubscription
  );

  useEffect(() => {
    if (!session?.user.id) return;

    return onSnapshot(
      subscriptionRef(session.user.id),
      (snapshot) => {
        if (snapshot.empty) {
          console.log('No such document!');
          setSubscription(null);
        } else {
          console.log('Document data:', snapshot.docs[0].data());
          // Here we append data from firestore to our global ฅ՞•ﻌ•՞ฅ state
          // Open devtools > click React components > useSubscriptionStore
          setSubscription(snapshot.docs[0].data());
        }
      },
      (error) => {
        console.log('Error getting document:', error);
      }
    );
  }, [session, setSubscription]);
  return <>{children}</>;
}

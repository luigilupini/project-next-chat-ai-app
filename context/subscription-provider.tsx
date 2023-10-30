'use client';

import { subscriptionRef } from '@/lib/converters/Subscription';
import { useSubscriptionStore } from '@/store/store';
import { onSnapshot } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

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

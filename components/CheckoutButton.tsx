'use client';

import { db } from '@/firebase';
import { useSubscriptionStore } from '@/store/store';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ManageAccountButton from './ManageAccountButton';

export default function CheckoutButton() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const subscription = useSubscriptionStore((state) => state.subscription);
  const isSubscriptionLoading = subscription === undefined;
  const isSubscribed =
    subscription?.role === 'pro' || subscription?.status === 'active';

  const createCheckoutSession = async () => {
    if (!session?.user.id) return; // exit if user is not logged in

    // After loading is complete and the component is mounted push a new document
    setLoading(true);

    // Push a new document to Firestore called `checkout_sessions` with the following fields:
    const docRef = await addDoc(
      collection(db, 'customers', session.user.id, 'checkout_sessions'),
      {
        // Add price and redirect
        price: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PRICE_ID,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      }
    );
    // ... stripe extension on the firestore database will create a checkout session
    // Wait for the CheckoutSession to get attached by the extension
    // A onSnapshot is like a realtime listener for the document
    return onSnapshot(docRef, (snap) => {
      const data = snap.data();
      const url = data?.url;
      const error = data?.error;
      if (error) {
        // Show an error to your customer and
        // inspect your Cloud Function logs in the Firebase console.
        alert(`An error occurred: ${error.message}`);
        setLoading(false);
      }
      if (url) {
        // We have a Stripe Checkout URL, let's redirect.
        window.location.assign(url);
        setLoading(false);
      }
    });
  };
  return (
    <div className='flex flex-col space-y-2'>
      <button className='mt-8 block rounded-md bg-indigo-600 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer disabled:opacity-80 disabled:bg-indigo-600/50 disabled:text-white   disabled:cursor-default'>
        {isSubscribed ? (
          <ManageAccountButton />
        ) : isSubscriptionLoading || loading ? (
          <LoadingSpinner />
        ) : (
          <button onClick={() => createCheckoutSession()}>Sign Up</button>
        )}
      </button>
    </div>
  );
}

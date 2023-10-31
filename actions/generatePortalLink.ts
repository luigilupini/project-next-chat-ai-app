'use server';

import { authOptions } from '@/auth';
import { adminDb } from '@/firebase-admin';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore
  apiVersion: '2023-08-16',
});

export async function generatePortalLink() {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) return console.error('No user Id found');

  // The host of the current page example localhost or vercel.com
  const hostUrl = headers().get('host');
  const returnUrl =
    process.env.NODE_ENV === 'development'
      ? `http://${hostUrl}/register`
      : `https://${hostUrl}/register`;

  // 🔥 Get the customer record from Firestore based on the users session id from
  // our authentication.
  const doc = await adminDb.collection('customers').doc(session?.user.id).get();

  if (!doc.data)
    return console.error(
      `No customer record found with userId: ${session?.user.id}`
    );

  // Connect to Stripe customer portal and redirect
  const stripeId = doc.data()!.stripeId;
  const stripeSession = await stripe.billingPortal.sessions.create({
    customer: stripeId,
    return_url: returnUrl,
  });
  redirect(stripeSession.url);
}

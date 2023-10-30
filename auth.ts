import { FirestoreAdapter } from '@auth/firebase-adapter';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';

import type { NextAuthOptions } from 'next-auth';
import { adminAuth, adminDb } from './firebase-admin';
import prisma from './prisma/client';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // By default we do not have the id appended to the token
    // Update next-auth.d.ts to ensure custom values are typed
    jwt: async ({ user, token }) => {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    // Next we need to ensure its within each client session
    session: async ({ session, token }) => {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
          const firebaseToken = await adminAuth.createCustomToken(token.sub);
          session.firebaseToken = firebaseToken;
        }
      }
      return session;
    },
  },

  // adapter: FirestoreAdapter(adminDb),
  adapter: PrismaAdapter(prisma),
} satisfies NextAuthOptions;

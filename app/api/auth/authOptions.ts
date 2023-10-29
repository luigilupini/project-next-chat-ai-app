import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import type { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      //   Add ID to user field
      if (session?.user) {
        if (token?.sub) {
          // session.user.id = token.sub;
          // !Add firebase token to session
          // !SOLUTION to firebase not syncing
          // !https://github.com/nextauthjs/next-auth/discussions/7157
          // const firebaseToken = await adminAuth.createCustomToken(token.sub);
          // session.firebaseToken = firebaseToken;
        }
      }

      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },

  session: {
    strategy: 'jwt',
  },
  // adapter: FirestoreAdapter(adminDb),
} satisfies NextAuthOptions;

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}

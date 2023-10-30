// Import the built-in types

import { DefaultSession } from 'next-auth';

// Adjust the path if needed to point to your Prisma client
// Declare module to merge the types with the existing `next-auth` types
// https://next-auth.js.org/getting-started/typescript#module-augmentation
declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession`
   * And received as a prop on the `SessionProvider` React Context
   * Add any custom fields to the session here.
   * E.g., the role from your database.
   */
  interface Session {
    firebaseToken?: string;
    user: {
      /** The user's postal address. */
      id?: string;
    } & DefaultSession['user'];
  }
}

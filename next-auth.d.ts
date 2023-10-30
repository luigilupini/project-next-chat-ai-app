// Import the built-in types

import { User } from '@/libs/prisma/client';
import { JWT, Session, DefaultSession } from 'next-auth';

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
      id: string;
      role: string; // Add your custom role field here
    } & DefaultSession['user'];
  }

  /**
   * Add any custom fields to the JWT token here.
   * E.g., the role from your database.
   */
  interface JWT {
    role?: string; // Your custom role field
  }
}

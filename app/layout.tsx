import Header from '@/components/Header';
import ClientProviders from '@/context/client-proviers';
import { ThemeProvider } from '@/context/theme-provider';
import type { Metadata } from 'next';
import { Work_Sans } from 'next/font/google';

import { Toaster } from '@/components/ui/toaster';
import FirebaseAuthProvider from '@/context/firebase-auth-provider';
import SubscriptionProvider from '@/context/subscription-provider';
import './globals.css';

const fontType = Work_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientProviders>
      <html lang='en'>
        <body className={`${fontType.className} h-screen w-screen`}>
          <FirebaseAuthProvider>
            <SubscriptionProvider>
              <ThemeProvider
                attribute='class'
                defaultTheme='system'
                enableSystem
                disableTransitionOnChange
              >
                <Header />
                {children}
                <Toaster />
              </ThemeProvider>
            </SubscriptionProvider>
          </FirebaseAuthProvider>
        </body>
      </html>
    </ClientProviders>
  );
}

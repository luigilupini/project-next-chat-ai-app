import { authOptions } from '@/auth';
import { MessagesSquareIcon } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import CreateChatButton from './CreateChatButton';
import LanguageSelect from './LanguageSelect';
import Logo from './Logo';
import { ModeToggle } from './ModeToggle';
import UpgradeBanner from './UpgradeBanner';
import UserButton from './UserButton';

export default async function Header() {
  const session = await getServerSession(authOptions);
  return (
    <header className='sticky top-0 z-50 bg-white shadow-sm dark:bg-gray-900'>
      <nav className='flex flex-col items-center gap-4 p-5 pl-2 mx-auto bg-white sm:flex-row dark:bg-gray-900 max-w-7xl'>
        <Logo />
        {/* controls */}
        <div className='flex items-center justify-end flex-1 gap-4'>
          {session ? (
            <>
              <LanguageSelect />
              <Link href='/chat' prefetch={false}>
                <MessagesSquareIcon className='text-black dark:text-white' />
              </Link>
              <CreateChatButton />
            </>
          ) : (
            <>
              <Link href='/pricing' prefetch={false}>
                Pricing
              </Link>
            </>
          )}
          <ModeToggle />
          <UserButton session={session} />
        </div>
      </nav>

      {/* upgrade banner for non-pro members */}
      <UpgradeBanner />
    </header>
  );
}

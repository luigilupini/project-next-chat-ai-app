import { MessagesSquareIcon } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import Logo from './Logo';
import { ModeToggle } from './ModeToggle';
import UserButton from './UserButton';
import CreateChatButton from './CreateChatButton';

export default async function Header() {
  const session = await getServerSession();
  return (
    // we have a max width of 7xl that we centering with mx-auto
    <header className='sticky top-0 z-50 bg-white shadow-sm dark:bg-gray-900'>
      <nav className='flex flex-col items-center gap-4 p-5 pl-2 mx-auto bg-white sm:flex-row dark:bg-gray-900 max-w-7xl'>
        <Logo />
        {/* controls */}
        <div className='flex items-center justify-end flex-1 gap-4'>
          {session ? (
            <>
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
          <UserButton session={session} />
          <ModeToggle />
        </div>
      </nav>

      {/* upgrade banner */}
    </header>
  );
}

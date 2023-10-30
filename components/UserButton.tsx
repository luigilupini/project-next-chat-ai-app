'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSubscriptionStore } from '@/store/store';
import { StarIcon } from 'lucide-react';
import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import ManageAccountButton from './ManageAccountButton';
import { UserAvatar } from './UserAvatar';
import LoadingSpinner from './loadingSpinner';
import { Button } from './ui/button';

export default function UserButton({ session }: { session: Session | null }) {
  const subscription = useSubscriptionStore((state) => state.subscription);

  if (!session)
    return (
      <Button variant={'outline'} onClick={() => signIn()}>
        Sign in
      </Button>
    );
  return (
    session && (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar name={session.user?.name} image={session.user?.image} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{session.user?.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {subscription === undefined && (
            <DropdownMenuItem>
              <LoadingSpinner />
            </DropdownMenuItem>
          )}
          {subscription?.role === 'pro' && (
            <>
              <DropdownMenuLabel className='text-xs flex items-center justify-start space-x-1 text-[#E935C1] animate-pulse'>
                <StarIcon fill='#E935C1' />
                <span>PRO</span>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <ManageAccountButton />
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem onClick={() => signOut()}>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
}

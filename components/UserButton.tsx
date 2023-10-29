'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import { UserAvatar } from './UserAvatar';
import { Button } from './ui/button';

export default function UserButton({ session }: { session: Session | null }) {
  if (!session)
    return (
      <Button variant={'outline'} onClick={() => signIn()}>
        Sign in
      </Button>
    );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar name={session.user?.name} image={session.user?.image} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{session.user?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

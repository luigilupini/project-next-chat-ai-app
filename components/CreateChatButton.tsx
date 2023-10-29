'use client';

import React from 'react';
import { Button } from './ui/button';
import { MessageSquarePlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateChatButton() {
  const router = useRouter();
  const createNewChat = async () => {
    // logic here to create new chat...
    router.push(`/chat/${'abc'}`);
  };
  return (
    <Button onClick={createNewChat} variant='ghost'>
      <MessageSquarePlus />
    </Button>
  );
}

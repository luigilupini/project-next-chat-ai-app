'use client';

import {
  ChatMembers,
  chatMembersCollectionGroupRef,
} from '@/lib/converters/ChatsMembers';

import { MessageSquare } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import ChatListRow from './ChatListRow';
import CreateChatButton from './CreateChatButton';

function ChatListRows({ initialChats }: { initialChats: ChatMembers[] }) {
  const { data: session } = useSession();

  // 🔥 FIREBASE & REACT FIREBASE HOOKS
  // Here we use the useCollectionData hook to listen to changes in the `chats`
  // collection that our (SSR) rendered data toward the client as initialChats.
  // The useCollectionData is a real time listener that will update the data in
  // real time on the client-side. This is a great example of how we can use the
  // same data in multiple components and have them update in real time
  const [members, loading, error] = useCollectionData<ChatMembers>(
    session && chatMembersCollectionGroupRef(session?.user.id!),
    {
      initialValue: initialChats,
    }
  );

  if (members?.length === 0)
    return (
      <div className='flex flex-col items-center justify-center pt-40 space-y-2'>
        <MessageSquare className='w-10 h-10' />
        <h1 className='text-5xl font-extralight'>Welcome!</h1>
        <h2 className='pb-10'>
          Lets get you started by creating your first chat!
        </h2>
        <CreateChatButton isLarge />
      </div>
    );

  return (
    <div className='mt-2'>
      {members?.map((member) => (
        <ChatListRow key={member.chatId} chatId={member.chatId} />
      ))}
    </div>
  );
}

export default ChatListRows;

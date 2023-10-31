'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Message, limitedSortedMessagesRef } from '@/lib/converters/Message';
import { useLanguageStore } from '@/store/store';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { UserAvatar } from './UserAvatar';

export default function ChatListRow({ chatId }: { chatId: string }) {
  // 🔥 FIREBASE & REACT FIREBASE HOOKS
  // Here we pull in the messages for the current chatId. We use the
  // useCollectionData hook to listen to changes in the `messages` collection.
  // We use the limitedSortedMessagesRef function that return a reference to the
  // messages collection sorted by timestamp and limited to 1 message.
  const [messages, loading, error] = useCollectionData<Message>(
    limitedSortedMessagesRef(chatId)
  );
  const language = useLanguageStore((state) => state.language);
  const { data: session } = useSession();

  const router = useRouter();

  const prettyUUID = (n = 4) => chatId.substring(0, n);

  const row = (message?: Message) => (
    <div
      key={chatId}
      onClick={() => router.push(`/chat/${chatId}`)}
      className='flex items-center p-5 space-x-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700'
    >
      <UserAvatar
        name={message?.user.name || session?.user.name}
        image={message?.user.image || session?.user.image}
      />

      <div className='flex-1'>
        <p className='font-medium'>
          {!message && 'New Chat'}
          {message &&
            [message?.user.name || session?.user.name].toString().split(' ')[0]}
        </p>

        <p className='text-sm text-gray-400 line-clamp-1'>
          {message?.translated?.[language] || 'Get the conversation started'}
        </p>
      </div>

      <div className='text-xs text-right text-gray-400'>
        <p className='mb-auto'>
          {message
            ? new Date(message.timestamp).toLocaleTimeString()
            : 'No messages yet'}
        </p>
        <p className=''>chat #{prettyUUID()}</p>
      </div>
    </div>
  );

  return (
    <div className=''>
      {loading && (
        <div className='flex items-center p-5 space-x-2'>
          <Skeleton className='w-12 h-12 rounded-full' />
          <div className='flex-1 space-y-2'>
            <Skeleton className='w-full h-4' />
            <Skeleton className='w-1/4 h-4' />
          </div>
        </div>
      )}

      {messages?.length === 0 && !loading && row()}

      {messages?.map((message) => row(message))}
    </div>
  );
}

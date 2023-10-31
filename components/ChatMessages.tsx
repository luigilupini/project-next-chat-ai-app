'use client';

import { Message, sortedMessagesRef } from '@/lib/converters/Message';
import { useLanguageStore } from '@/store/store';
import { MessageCircleIcon } from 'lucide-react';
import { Session } from 'next-auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import LoadingSpinner from './LoadingSpinner';
import { UserAvatar } from './UserAvatar';

export default function ChatMessages({
  chatId,
  initialMessages,
  session,
}: {
  chatId: string;
  initialMessages: Message[];
  session: Session | null;
}) {
  const language = useLanguageStore((state) => state.language);
  // 👇🏻 Used to scroll to the bottom of the messages
  // const messagesEndRef = createRef<HTMLDivElement>();

  // 🔥 FIREBASE & REACT-FIREBASE HOOKS
  // Get the messages for the current chatId. We use the sortedMessagesRef to
  // get a reference to the messages collection sorted by timestamp. The hook
  // will return an array of messages, a loading state and an error. We also
  // pass an initialValue of initialMessages to the hook so it doesn't return
  // undefined while loading. The hook is a realtime listener so it will update
  // automatically when a new message is added to the collection.
  const [messages, loading, error] = useCollectionData<Message>(
    sortedMessagesRef(chatId),
    { initialValue: initialMessages }
  );
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [messages, messagesEndRef]);

  return (
    <div className='p-5'>
      {!loading && messages?.length === 0 && <PageBanner />}
      {messages?.map((message) => {
        const isSender = message.user.id === session?.user.id;

        return (
          <div key={message.id} className='flex items-end my-1'>
            {/* MESSAGE BUBBLE */}
            <article
              className={`flex flex-col relative space-y-1 py-2 px-5 w-fit line-clamp-1 mx-2 rounded-lg shadow ${
                isSender
                  ? 'ml-auto bg-violet-600 text-white rounded-br-none'
                  : 'bg-gray-100 dark:text-gray-100 dark:bg-slate-700 rounded-bl-none'
              }`}
            >
              <p
                className={`text-[10px] lowercase line-clamp-1 tracking-wider ${
                  isSender ? 'text-right' : 'text-left'
                }`}
              >
                {message.user.name.split(' ')[0]}
              </p>
              <div className='flex space-x-2 text-[13px] font-normal'>
                <p>{message.translated?.[language] || message.input}</p>
                {!message.translated && <LoadingSpinner />}
              </div>
            </article>

            <UserAvatar
              name={message.user.name}
              image={message.user.image}
              className={`${!isSender && '-order-1'}`}
            />
          </div>
        );
      })}
      {/* <div ref={messagesEndRef} /> */}
    </div>
  );
}

const PageBanner = () => (
  <div
    className={`absolute flex flex-col items-center justify-center p-20 space-y-2 text-white
	bg-indigo-400 bottom-[20%] left-10 right-10 rounded-xl font-extralight`}
  >
    <MessageCircleIcon className='w-10 h-10' />

    <h2>
      <span className='font-bold'>Invite a friend</span> &{' '}
      <span className='font-bold'>send your first message in any language</span>{' '}
      below to get started!
    </h2>
    <p>The AI will auto-detect & translate it all for you</p>
  </div>
);

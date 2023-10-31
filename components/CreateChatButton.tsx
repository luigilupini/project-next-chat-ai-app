'use client';

import {
  addChatRef,
  chatMembersCollectionGroupRef,
} from '@/lib/converters/ChatsMembers';
import { useSubscriptionStore } from '@/store/store';
import { getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { MessageSquarePlusIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import LoadingSpinner from './LoadingSpinner';
import { Button } from './ui/button';
import { ToastAction } from './ui/toast';
import { useToast } from './ui/use-toast';

function CreateChatButton({ isLarge }: { isLarge?: boolean }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // We use the global subscription object via the store
  const subscription = useSubscriptionStore((state) => state.subscription);
  const { toast } = useToast();

  const createNewChat = async () => {
    if (!session?.user.id) return;
    // Set loading state for spinner
    setLoading(true);
    toast({
      title: 'Creating new chat...',
      description: 'Hold tight while we create your new chat...',
      className: 'bg-yellow-700 text-white',
      duration: 3000,
    });

    // 🔥 FIRESTORE
    // Here we get the users current chats to check if they're about to exceed a
    // pro plan with the `chatMembersCollectionGroupRef` converter this will
    // return the membership and the associated chat with the user.
    const chats = (
      await getDocs(chatMembersCollectionGroupRef(session.user.id))
    ).docs.map((doc) => doc.data());
    // ฅ՞•ﻌ•՞ฅ ZUSTAND check if the user is about to exceed the pro plan which
    // is 3 chats limited using the global subscription object 🇿.
    const isPro =
      subscription?.role === 'pro' && subscription.status === 'active';
    // If our user is not a pro and has exceeded 3 charts, notify them and push
    // them to the upgrade subscription `register` page.
    if (!isPro && chats.length >= 3) {
      toast({
        title: 'Free plan limit exceeded',
        description: `You've'exceeded the limit of chats for the FREE plan.
          Please upgrade to PRO to continue adding users to chats!`,
        variant: 'destructive',
        action: (
          <ToastAction
            altText='Upgrade'
            onClick={() => router.push('/register')}
          >
            Upgrade to PRO
          </ToastAction>
        ),
      });
      setLoading(false);
      return;
    }

    // 🔥 FIRESTORE
    // If the user is a pro or has not exceeded the free plan limit, create the
    // chat and push them to the chat page. We use the `addChatRef` converter to
    // create a chat `uuid` and we pass in the user session. Users creating the
    // chat will be the admin by default `isAdmin`.
    const chatId = uuidv4();

    await setDoc(addChatRef(chatId, session.user.id), {
      userId: session.user.id!,
      email: session.user.email!,
      timestamp: serverTimestamp(),
      isAdmin: true, // auto assign creator of chat as admin
      chatId: chatId,
      image: session.user.image || '',
    })
      .then(() => {
        toast({
          title: 'Success',
          description: 'Your chat has been created!',
          className: 'bg-green-600 text-white',
          duration: 2000,
        });
        router.push(`/chat/${chatId}`);
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: 'There was an error creating your chat!',
          variant: 'destructive',
        });
        console.log(error);
      })
      .finally(() => setLoading(false));
  };

  if (isLarge)
    return (
      <div>
        <Button variant={'default'} onClick={createNewChat}>
          {loading ? <LoadingSpinner /> : 'Create a New Chat'}
        </Button>
      </div>
    );

  return (
    <div>
      <Button size={'icon'} variant={'ghost'} onClick={createNewChat}>
        {loading ? <LoadingSpinner /> : <MessageSquarePlusIcon />}
      </Button>
    </div>
  );
}

export default CreateChatButton;

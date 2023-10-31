'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from './ui/button';
import { ToastAction } from './ui/toast';
import { useToast } from './ui/use-toast';

import { addDoc, getDocs, serverTimestamp } from 'firebase/firestore';

import {
  User,
  limitedMessagesRef,
  messagesRef,
} from '@/lib/converters/Message';

import { useSubscriptionStore } from '@/store/store';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({ input: z.string().max(100) });

export default function ChatInput({ chatId }: { chatId: string }) {
  const { data: session } = useSession();

  const subscription = useSubscriptionStore((state) => state.subscription);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.input.length === 0) return;
    if (!session?.user) return;

    // 🔥 FIREBASE
    // Get the users current chats to check if they're about to exceed the PRO plan
    const messages = (await getDocs(limitedMessagesRef(chatId))).docs.map(
      (doc) => doc.data()
    ).length;

    // Check if the user is about to exceed the PRO plan of 20 messages per chat
    const isPro =
      subscription?.role === 'pro' && subscription.status === 'active';
    if (!isPro && messages >= 20) {
      toast({
        title: 'Free plan limit exceeded',
        description: `You've'exceeded the FREE plan limit of 20 messages per chat.
          Upgrade to PRO for unlimited chat messages!`,
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
      return;
    }

    // 🔥 FIREBASE
    // Otherwise we can add the single message to messages and reset the form.
    // We use messagesRef function to get a reference to the messages collection
    // for the current chatId and append the new document to the messages.
    const userToStore: User = {
      id: session.user.id!,
      name: session.user.name!,
      email: session.user.email!,
      image: session.user.image || '',
    };
    // 🔥 FIREBASE
    addDoc(messagesRef(chatId), {
      input: values.input,
      timestamp: serverTimestamp(),
      user: userToStore,
    });
    form.reset();
  }

  return (
    <div className='sticky bottom-0'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex max-w-4xl p-2 mx-auto space-x-2 bg-white border rounded-t-xl dark:bg-slate-800'
        >
          <FormField
            control={form.control}
            name='input'
            render={({ field }) => (
              <FormItem className='flex-1'>
                <FormControl>
                  <Input
                    className='bg-transparent border-none dark:placeholder:text-white/70'
                    placeholder='Enter a message in any language'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='text-white bg-violet-600'>
            Send
          </Button>
        </form>
      </Form>
    </div>
  );
}

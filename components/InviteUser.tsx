'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useToast } from '@/components/ui/use-toast';
import { addChatRef, chatMembersRef } from '@/lib/converters/ChatsMembers';
import { getUserByEmailRef } from '@/lib/converters/User';
import { getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import * as z from 'zod';

import useIsAdmin from '@/hooks/useIsAdmin';
import { useSubscriptionStore } from '@/store/store';
import { PlusCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ShareLink } from './ShareLink';
import { ToastAction } from './ui/toast';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export default function InviteUser({ chatId }: { chatId: string }) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const { toast } = useToast();

  const adminId = useIsAdmin({ chatId });
  const subscription = useSubscriptionStore((state) => state.subscription);
  const router = useRouter();

  const [openInviteLink, setOpenInviteLink] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!session?.user.id) return;
    toast({
      title: 'Sending invite',
      description: 'Please wait while we send the invite...',
    });

    // 🔥 FIREBASE
    // Get the number of users in the chat to check if the user is about to
    // exceed the PRO plan. Using chatMembersRef we can get a reference to the
    // members collection for the current chatId.
    const noOfUsersInChat = (await getDocs(chatMembersRef(chatId))).docs.map(
      (doc) => doc.data()
    ).length;
    // Check if the user is about to exceed the PRO plan which is 3 chats
    const isPro =
      subscription?.role === 'pro' && subscription.status === 'active';
    if (!isPro && noOfUsersInChat >= 2) {
      toast({
        title: 'Free plan limit exceeded',
        description: `You have exceeded the limit of users in a single chat for the Free plan.
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
      return;
    }
    // 🔥 FIREBASE
    // Get the user by email address. We can use the getUserByEmailRef function
    // to get a reference to the user by email address.
    const querySnapshot = await getDocs(getUserByEmailRef(values.email));
    if (querySnapshot.empty) {
      toast({
        title: 'User not found',
        description:
          'Please enter an email address of a registered user or send invitation once signed up!',
        variant: 'destructive',
      });

      return;
    } else {
      const user = querySnapshot.docs[0].data();
      // 🔥 FIREBASE & ADD THE USER TO THE CHAT
      // Otherwise, add the user to the chat. We can use the addChatRef function
      // to get a reference to the chat by chatId. We can then use the setDoc
      // function to add a new document to the members collection. This will
      // add the user to the members list of this chat.
      await setDoc(addChatRef(chatId, user.id), {
        userId: user.id!,
        email: user.email!,
        timestamp: serverTimestamp(),
        chatId: chatId,
        isAdmin: false, // 👈🏻 They did not create the chat so they not an Admin
        image: user.image || '',
      })
        .then(() => {
          setOpen(false);
          toast({
            title: 'Added to chat',
            description: 'The user has been added to the chat successfully!',
            className: 'bg-green-600 text-white',
            duration: 3000,
          });
          setOpenInviteLink(true);
        })
        .catch(() => {
          toast({
            title: 'Error',
            description:
              'Whoops... there was an error adding the user to the chat!',
            variant: 'destructive',
          });
          setOpen(false);
        });
    }
    form.reset();
  };

  return (
    adminId === session?.user.id && (
      <>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircleIcon className='mr-1' />
              Add User To Chat
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>Add User to Chat</DialogTitle>
              <DialogDescription>
                Simply enter another users email address to invite them to this
                chat!{' '}
                <span className='font-bold text-indigo-600'>
                  Note: user must be registered
                </span>
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex flex-col space-y-2'
              >
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder='john@doe.com' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className='w-full ml-auto sm:w-fit' type='submit'>
                  Add To Chat
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <ShareLink
          isOpen={openInviteLink}
          setIsOpen={setOpenInviteLink}
          chatId={chatId}
        />
      </>
    )
  );
}

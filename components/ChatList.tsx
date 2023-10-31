import { chatMembersCollectionGroupRef } from '@/lib/converters/ChatsMembers';
import { getDocs } from 'firebase/firestore';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/auth';
import ChatListRows from './ChatListRows';
import { toast } from './ui/use-toast';

export default async function ChatList() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    toast({
      title: 'Error',
      description: 'There was an error creating your chat!',
      variant: 'destructive',
    });
    return;
  }
  // 🔥 FIREBASE
  // Here we use the getDocs function to get a list of all the chats that the
  // current user is a member of. We use the chatMembersCollectionGroupRef to
  // query all chats that the current user is a member of.
  const chatsSnapshot = await getDocs(
    chatMembersCollectionGroupRef(session?.user.id!)
  );
  const initialChats = chatsSnapshot.docs.map((doc) => ({
    ...doc.data(),
    timestamp: null, // 👈🏻 transform and append timestamp
  }));

  return (
    <>
      <ChatListRows initialChats={initialChats} />
    </>
  );
}

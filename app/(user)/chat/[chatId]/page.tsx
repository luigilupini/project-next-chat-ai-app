import { authOptions } from '@/auth';
// import AdminControls from "@/components/AdminControls";
import ChatInput from '@/components/ChatInput';
import ChatMembersBadges from '@/components/ChatMembersBadges';
import ChatMessages from '@/components/ChatMessages';
// import ChatMembersBadges from "@/components/ChatMembersBadges";
// import ChatMessages from "@/components/ChatMessages";
import { chatMembersRef } from '@/lib/converters/ChatsMembers';
import { sortedMessagesRef } from '@/lib/converters/Message';
import { getDocs } from 'firebase/firestore';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

type Props = {
  params: {
    chatId: string;
  };
};

export default async function Chats({ params: { chatId } }: Props) {
  const session = await getServerSession(authOptions);

  // 🔥 FIREBASE
  // Get the messages for the current chatId. We use the sortedMessagesRef to
  // get a reference to the messages collection sorted by timestamp.
  const initialMessages = (await getDocs(sortedMessagesRef(chatId))).docs.map(
    (doc) => doc.data()
  );
  // 🔥 FIREBASE
  // Check if the current user has access to the chat. We do this by checking if
  // the current user is a member of the chat.
  const hasAccess = (await getDocs(chatMembersRef(chatId))).docs
    .map((doc) => doc.id)
    .includes(session?.user.id!);

  if (!hasAccess) redirect('/chat?error=permission');

  return (
    <>
      {/* <AdminControls chatId={chatId} /> */}
      <ChatMembersBadges chatId={chatId} />

      <div className='flex-1'>
        <ChatMessages
          chatId={chatId}
          session={session}
          initialMessages={initialMessages}
        />
      </div>

      <ChatInput chatId={chatId} />
    </>
  );
}

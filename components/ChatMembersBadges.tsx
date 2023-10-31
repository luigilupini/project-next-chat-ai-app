'use client';

import { Badge } from '@/components/ui/badge';
import useIsAdmin from '@/hooks/useIsAdmin';
import { ChatMembers, chatMembersRef } from '@/lib/converters/ChatsMembers';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import LoadingSpinner from './LoadingSpinner';
import { UserAvatar } from './UserAvatar';

export default function ChatMembersBadges({ chatId }: { chatId: string }) {
  // 🔥 FIREBASE & REACT-FIREBASE HOOKS
  // Here we use the useCollectionData hook to listen to the members collection
  // for the current chatId. The hook returns an array of members, a loading
  // state and an error. We use the chatMembersRef to get a reference to the
  // members collection for the current chatId. The hook is a realtime listener
  // so it will update automatically when a new member is added.
  const [members, loading, error] = useCollectionData<ChatMembers>(
    chatMembersRef(chatId)
  );
  // 🪝 HOOK & CONDITIONAL RENDERING
  // We use the useIsAdmin hook to get the adminId for the current chatId.
  const adminId = useIsAdmin({ chatId });

  if (loading && !members) return <LoadingSpinner />;

  return (
    !loading && (
      <div className='p-2 m-5 border rounded-xl'>
        <div className='flex flex-wrap items-center justify-center gap-2 p-2 md:justify-start'>
          {members?.map((member) => (
            <Badge
              variant='secondary'
              key={member.email}
              className='flex p-5 pl-2 pr-5 space-x-2 h-14'
            >
              <div className='flex items-center space-x-2'>
                <UserAvatar name={member.email} image={member.image} />
              </div>
              <div>
                <p>{member.email}</p>
                {member.userId === adminId ? (
                  <p className='font-medium text-indigo-400 animate-pulse'>
                    Admin
                  </p>
                ) : (
                  <p className='font-medium'>User</p>
                )}
              </div>
            </Badge>
          ))}
        </div>
      </div>
    )
  );
}

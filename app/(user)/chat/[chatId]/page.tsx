import ChatList from '@/components/ChatList';
import ChatPermissionError from '@/components/ChatPermissionError';

type Props = {
  params: {};
  searchParams: {
    error: string;
  };
};

export default async function Chats({ searchParams: { error } }: Props) {
  return (
    <div>
      {/* param if any error is produced */}
      {error && (
        <div className='m-2'>
          <ChatPermissionError />
        </div>
      )}
      <ChatList />
    </div>
  );
}

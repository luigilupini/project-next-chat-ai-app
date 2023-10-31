import DeleteChatButton from './DeleteChatButton';
import InviteUser from './InviteUser';

export default function AdminControls({ chatId }: { chatId: string }) {
  return (
    <div className='flex justify-end m-5 mb-0 space-x-2'>
      <InviteUser chatId={chatId} />
      <DeleteChatButton chatId={chatId} />
    </div>
  );
}

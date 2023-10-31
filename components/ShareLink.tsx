'use client';

import { Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dispatch, SetStateAction } from 'react';
import { useToast } from './ui/use-toast';

export function ShareLink({
  isOpen,
  chatId,
  setIsOpen,
}: {
  isOpen: boolean;
  chatId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { toast } = useToast();

  // get host
  const host = window.location.host;

  const linkToChat =
    process.env.NODE_ENV === 'development'
      ? `http://${host}/chat/${chatId}`
      : `https://${host}/chat/${chatId}`;

  // const linkToChat =
  //   process.env.NODE_ENV !== "development"
  //     ? `https://${process.env.VERCEL_URL}/chat/${chatId}`
  //     : `http://localhost:3000/chat/${chatId}`;

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(linkToChat);
      console.log('Text copied to clipboard');

      toast({
        title: 'Copied successfully',
        description:
          'Share this to the person you want to chat with! Note: They must be added to Chat as a member to access it!',
        className: 'bg-green-600 text-white',
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }

  return (
    <Dialog
      onOpenChange={(open) => setIsOpen(open)}
      open={isOpen}
      defaultOpen={isOpen}
    >
      <DialogTrigger asChild>
        <Button variant='outline'>
          <Copy className='mr-2' />
          Share Link
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Any <span className='font-bold text-indigo-600'>registered</span>{' '}
            user with access can use this link
          </DialogDescription>
        </DialogHeader>
        <div className='flex items-center space-x-2'>
          <div className='grid flex-1 gap-2'>
            <Label htmlFor='link' className='sr-only'>
              Link
            </Label>
            <Input id='link' defaultValue={linkToChat} readOnly />
          </div>
          <Button
            type='submit'
            onClick={() => copyToClipboard()}
            size='sm'
            className='px-3'
          >
            <span className='sr-only'>Copy</span>
            <Copy className='w-4 h-4' />
          </Button>
        </div>
        <DialogFooter className='sm:justify-start'>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

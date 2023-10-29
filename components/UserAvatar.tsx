import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function UserAvatar({
  name,
  image,
  className,
}: {
  name: string | null | undefined;
  image: string | null | undefined;
  className?: string;
}) {
  return (
    <Avatar
      className={cn('bg-white dark:bg-gray-900 text-gray-900', className)}
    >
      {/* <AvatarImage src='/rambo.jpeg' alt='@hastytoro' /> */}
      {image ? (
        <Image
          src={image}
          alt={name || ''}
          width={40}
          height={40}
          className='object-cover w-full h-full'
        />
      ) : (
        <AvatarFallback
          delayMs={1000}
          className='text-lg dark:bg-white dark:text-black'
        >
          {name
            ?.split(' ')
            .map((n) => n[0])
            .join('')}
        </AvatarFallback>
      )}
    </Avatar>
  );
}

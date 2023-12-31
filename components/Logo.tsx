// import LogoImage from '@/images/translate.svg';
// import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href='/' prefetch={false} className='overflow-hidden'>
      <div className='flex w-auto h-8 gap-1 px-2 place-items-center'>
        {/* <Image
          priority
          src={LogoImage}
          alt='logo'
          className='w-full h-full dark:filter dark:invert'
        /> */}
        <h1 className='text-xl font-medium'>chitchat app</h1>
      </div>
    </Link>
  );
}

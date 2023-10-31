import { ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  return (
    <main>
      <div className='relative isolate pt-14 dark:bg-gray-900'>
        {/* BACKGROUND TAILWIND BLOB */}
        <div
          className='absolute inset-x-0 overflow-hidden top-28 -z-10 transform-gpu blur-3xl'
          aria-hidden='true'
        >
          <div
            className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        {/* HERO SECTION */}
        <div className='py-12 sm:py-20 lg:pb-40'>
          <div className='px-6 mx-auto max-w-7xl lg:px-8'>
            <div className='max-w-2xl mx-auto text-center'>
              <h1 className='text-4xl font-bold tracking-tight sm:text-6xl'>
                Chat with Anyone, anywhere!
              </h1>
              <p className='mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300'>
                You speak your language, they speak their language.{' '}
                <span className='text-indigo-600 dark:text-indigo-500'>
                  Let AI handle the translation.
                </span>
              </p>
              <div className='flex items-center justify-center mt-10 gap-x-6'>
                <Link
                  href='/chat'
                  className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white dark:text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                >
                  Get started
                </Link>
                <Link
                  href='/pricing'
                  className='text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300'
                >
                  View Pricing <span aria-hidden='true'>→</span>
                </Link>
              </div>
            </div>

            <div className='flow-root mt-16 sm:mt-24'>
              <div className='p-2 -m-2 rounded-xl bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
                <ImageIcon className='w-full h-full opacity-50' />
              </div>
            </div>
          </div>
        </div>

        {/* BACKGROUND TAILWIND BLOB */}
        <div
          className='absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]'
          aria-hidden='true'
        >
          <div
            className='relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]'
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>
    </main>
  );
}

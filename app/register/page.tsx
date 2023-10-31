import { authOptions } from '@/auth';
import PricingCards from '@/components/PricingCards';
import { getServerSession } from 'next-auth';

export default async function Register() {
  const session = await getServerSession(authOptions);
  return (
    <div className='w-full h-full pb-40 overflow-hidden bg-gray-900 isolate'>
      <div className='px-6 pt-16 pb-12 mx-auto text-center text-white max-w-7xl lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          <p className='mt-2 text-4xl font-bold tracking-tight sm:text-5xl'>
            {session?.user?.name?.split(' ')?.[0]}, select a subscription
          </p>
        </div>
        <div className='relative'>
          <svg
            viewBox='0 0 1208 1024'
            className='absolute -top-10 left-1/2 -z-10 h-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:-top-12 md:-top-20 lg:-top-12 xl:top-0'
          >
            <ellipse
              cx={604}
              cy={512}
              fill='url(#radial-gradient)'
              rx={604}
              ry={512}
            />
            <defs>
              <radialGradient id='radial-gradient'>
                <stop stopColor='#7775D6' />
                <stop offset={1} stopColor='#E935C1' />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>

      <PricingCards redirect={false} />
    </div>
  );
}

import PricingCards from '@/components/PricingCards';

export default async function PricingPage() {
  return (
    <main className='overflow-hidden bg-gray-900 isolate'>
      <div className='px-6 pt-24 mx-auto text-center max-w-7xl pb-96 sm:pt-32 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          <h2 className='text-base font-semibold leading-7 text-indigo-400'>
            Pricing
          </h2>
          <p className='mt-2 text-4xl font-bold tracking-tight text-white sm:text-6xl'>
            The right price for you,{' '}
            <br className='hidden sm:inline lg:hidden' />
            whoever you are
          </p>
        </div>
        <div className='relative mt-6'>
          <p className='max-w-2xl mx-auto text-lg leading-8 text-white/60'>
            Were 99% sure we have a plan to match 100% of your needs
          </p>
          <svg
            viewBox='0 0 1208 1024'
            className='absolute -top-10 left-1/2 -z-10 h-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:-top-12 md:-top-20 lg:-top-12 xl:top-0'
          >
            <ellipse
              cx={604}
              cy={512}
              fill='url(#radial-gradient-pricing)'
              rx={604}
              ry={512}
            />
            <defs>
              <radialGradient id='radial-gradient-pricing'>
                <stop stopColor='#7775D6' />
                <stop offset={1} stopColor='#E935C1' />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className='flow-root pb-24 bg-white sm:pb-32'>
        <div className='-mt-80'>
          <PricingCards redirect={true} />
        </div>
      </div>
    </main>
  );
}

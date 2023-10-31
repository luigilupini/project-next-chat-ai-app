'use client';

import {
  LanguagesSupported,
  LanguagesSupportedMap,
  useLanguageStore,
  useSubscriptionStore,
} from '@/store/store';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';

export default function LanguageSelect() {
  const [language, setLanguage, getLanguages, getNotSupportedLanguages] =
    useLanguageStore((state) => [
      state.language,
      state.setLanguage,
      state.getLanguages,
      state.getNotSupportedLanguages,
    ]);
  const subscription = useSubscriptionStore((state) => state.subscription);
  const isPro =
    subscription?.role === 'pro' && subscription?.status === 'active';
  const pathName = usePathname();
  const isChatPage = pathName.includes('/chat');

  return (
    isChatPage && (
      <div>
        <Select
          onValueChange={(value: LanguagesSupported) => setLanguage(value)}
        >
          <SelectTrigger className='w-[150px] text-black dark:text-white'>
            <SelectValue
              placeholder={LanguagesSupportedMap[language]}
              className=''
            />
          </SelectTrigger>

          <SelectContent>
            {subscription === undefined ? (
              <LoadingSpinner />
            ) : (
              <>
                {getLanguages(isPro).map((language) => (
                  <SelectItem key={language} value={language}>
                    {LanguagesSupportedMap[language]}
                  </SelectItem>
                ))}
                {getNotSupportedLanguages(isPro).map((language) => (
                  <Link href={'/register'} key={language}>
                    <SelectItem
                      key={language}
                      value={language}
                      disabled
                      className='py-2 my-1 text-gray-500 bg-gray-300/50 dark:text-white'
                    >
                      {LanguagesSupportedMap[language]} (PRO)
                    </SelectItem>
                  </Link>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
      </div>
    )
  );
}

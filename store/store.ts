import { Subscription } from '@/types/Subscription';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';

export type LanguagesSupported =
  | 'en'
  | 'es'
  | 'de'
  | 'fr'
  | 'nl'
  | 'fi'
  | 'it'
  | 'ja'
  | 'no'
  | 'zu'
  | 'xh';

export const LanguagesSupportedMap: Record<LanguagesSupported, string> = {
  en: 'English',
  es: 'Spanish',
  de: 'German',
  fr: 'French',
  nl: 'Dutch',
  fi: 'Finnish',
  it: 'Italian',
  ja: 'Japanese',
  no: 'Norwegian',
  zu: 'Zulu',
  xh: 'Xhosa',
};

// ฅ՞•ﻌ•՞ฅ LANGUAGE STORE
interface LanguageState {
  language: LanguagesSupported;
  setLanguage: (language: LanguagesSupported) => void;
  getLanguages: (isPro: boolean) => LanguagesSupported[];
  getNotSupportedLanguages: (isPro: boolean) => LanguagesSupported[];
}

export const useLanguageStore = create<LanguageState>()((set, get) => ({
  language: 'en',
  setLanguage: (language: LanguagesSupported) => set({ language }),
  getLanguages: (isPro: boolean) => {
    // If the user is pro, return all supported languages
    if (isPro)
      return Object.keys(LanguagesSupportedMap) as LanguagesSupported[];

    // If not pro, return only the first two languages
    return Object.keys(LanguagesSupportedMap).slice(
      0,
      2
    ) as LanguagesSupported[];
  },
  getNotSupportedLanguages: (isPro: boolean) => {
    if (isPro) return []; // No unsupported languages for "pro" users
    return Object.keys(LanguagesSupportedMap).slice(2) as LanguagesSupported[]; // Excluding the first two supported languages
  },
}));

// Mount the store to the devtools in development mode:
if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('useLanguageStore', useLanguageStore);
}

// ฅ՞•ﻌ•՞ฅ SUBSCRIPTION STORE
interface SubscriptionState {
  subscription: Subscription | null | undefined;
  setSubscription: (subscription: Subscription | null) => void;
  isPro: () => boolean;
}

export const useSubscriptionStore = create<SubscriptionState>()((set, get) => ({
  subscription: undefined,
  setSubscription: (subscription: Subscription | null) => set({ subscription }),
  isPro: () => {
    const subscription = get().subscription;
    if (!subscription) return false;
    return subscription.status === 'active' && subscription.role === 'pro';
  },
}));

// Mount the store to the devtools in development mode:
if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('useSubscriptionStore', useSubscriptionStore);
}

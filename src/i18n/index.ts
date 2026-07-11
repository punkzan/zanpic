import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zh from './locales/zh.json'
import en from './locales/en.json'
import ja from './locales/ja.json'
import ko from './locales/ko.json'
import fr from './locales/fr.json'
import de from './locales/de.json'
import ru from './locales/ru.json'
import ar from './locales/ar.json'

export const SUPPORTED_LANGUAGES = [
  { code: 'zh', name: '简体中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
] as const

export type LangCode = (typeof SUPPORTED_LANGUAGES)[number]['code']

const STORAGE_KEY = 'zanpic-lang'

function getInitialLanguage(): string {
  // 1. Check localStorage
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
    return saved
  }
  // 2. Check browser language
  const browserLang = navigator.language.toLowerCase()
  for (const lang of SUPPORTED_LANGUAGES) {
    if (browserLang.startsWith(lang.code)) {
      return lang.code
    }
  }
  // 3. Default to English for international audience
  return 'en'
}

i18n.use(initReactI18next).init({
  resources: {
    zh: { translation: zh },
    en: { translation: en },
    ja: { translation: ja },
    ko: { translation: ko },
    fr: { translation: fr },
    de: { translation: de },
    ru: { translation: ru },
    ar: { translation: ar },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes
  },
  react: {
    useSuspense: false,
  },
})

// Set initial direction (RTL for Arabic)
document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'

// Persist language changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng)
  document.documentElement.lang = lng
  // RTL support for Arabic
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
})

export default i18n

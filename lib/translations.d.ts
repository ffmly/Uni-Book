declare type TranslationKey = `project.${string}`

declare interface TranslationFunction {
  (key: TranslationKey): string
}

declare module '@/lib/language-context' {
  export function useLanguage(): {
    language: 'en' | 'ar'
    setLanguage: (lang: 'en' | 'ar') => void
    toggleLanguage: () => void
    t: TranslationFunction
  }
} 
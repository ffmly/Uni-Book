"use client"

import { useLanguage } from "@/lib/language-context"
import SignUpForm from "@/components/signup-form"
import ThemeToggle from "@/components/theme-toggle"
import LanguageToggle from "@/components/language-toggle"

export default function SignUpPage() {
  const { language } = useLanguage()

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="absolute top-4 right-4 flex gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      <SignUpForm />
    </main>
  )
} 
"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { signIn } = useAuth()
  const { language } = useLanguage()
  const router = useRouter()

  const translations = {
    en: {
      email: "Email",
      password: "Password",
      login: "Login",
      signup: "Sign Up",
      error: "Invalid email or password",
    },
    ar: {
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      login: "تسجيل الدخول",
      signup: "إنشاء حساب",
      error: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    },
  }

  const t = (key: keyof typeof translations.en) => translations[language][key]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const { error } = await signIn(email, password)
    if (error) {
      setError(t("error"))
    } else {
      router.push("/")
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold tracking-tight">
          {t("login")}
        </h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4 rounded-md shadow-sm">
          <div>
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-500 text-center">{error}</div>
        )}

        <div>
          <Button type="submit" className="w-full">
            {t("login")}
          </Button>
        </div>

        <div className="text-center">
          <Button
            variant="link"
            onClick={() => router.push("/signup")}
            className="text-sm"
          >
            {t("signup")}
          </Button>
        </div>
      </form>
    </div>
  )
}


"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as const,
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { language } = useLanguage()
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError(language === "ar" ? "كلمات المرور غير متطابقة" : "Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const { error } = await signUp(formData.email, formData.password, {
        name: formData.name,
        role: formData.role,
      })

      if (error) {
        setError(error)
      } else {
        setSuccess(
          language === "ar"
            ? "تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول."
            : "Account created successfully! You can now log in."
        )
        // Clear the form
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "student",
        })
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    } catch (error) {
      setError(
        language === "ar"
          ? "حدث خطأ أثناء إنشاء الحساب"
          : "An error occurred while creating your account"
      )
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {language === "ar" ? "إنشاء حساب جديد" : "Create an account"}
        </CardTitle>
        <CardDescription>
          {language === "ar"
            ? "أدخل معلوماتك لإنشاء حساب جديد"
            : "Enter your information to create a new account"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              {language === "ar" ? "الاسم" : "Name"}
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder={language === "ar" ? "أدخل اسمك" : "Enter your name"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">
              {language === "ar" ? "البريد الإلكتروني" : "Email"}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder={language === "ar" ? "أدخل بريدك الإلكتروني" : "Enter your email"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">
              {language === "ar" ? "كلمة المرور" : "Password"}
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder={language === "ar" ? "أدخل كلمة المرور" : "Enter your password"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {language === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder={language === "ar" ? "أكد كلمة المرور" : "Confirm your password"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">
              {language === "ar" ? "الدور" : "Role"}
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value as "student" }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={language === "ar" ? "اختر الدور" : "Select role"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">
                  {language === "ar" ? "طالب" : "Student"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
          {success && (
            <p className="text-sm text-green-500 text-center">{success}</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? language === "ar"
                ? "جاري إنشاء الحساب..."
                : "Creating account..."
              : language === "ar"
              ? "إنشاء حساب"
              : "Create Account"}
          </Button>
          <p className="text-sm text-center">
            {language === "ar" ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => router.push("/login")}
            >
              {language === "ar" ? "تسجيل الدخول" : "Login"}
            </Button>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
} 
"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type UserRole = "student" | "main_admin" | "institution_admin"

export default function SignUp() {
  const { t } = useLanguage()
  const { signUp } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student" as UserRole,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signUp(formData.email, formData.password, {
        name: formData.name,
        role: formData.role,
      })
      toast({
        title: t("auth.signUpSuccess"),
        description: t("auth.signUpSuccessDescription"),
      })
    } catch (error) {
      toast({
        title: t("auth.error"),
        description: t("auth.signUpError"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-md py-8">
      <Card>
        <CardHeader>
          <CardTitle>{t("auth.signUp")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("auth.name")}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">{t("auth.role")}</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("auth.selectRole")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">{t("auth.roles.student")}</SelectItem>
                  <SelectItem value="main_admin">{t("auth.roles.mainAdmin")}</SelectItem>
                  <SelectItem value="institution_admin">
                    {t("auth.roles.institutionAdmin")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("auth.signingUp") : t("auth.signUp")}
            </Button>

            <div className="text-center text-sm">
              <span>{t("auth.haveAccount")} </span>
              <Link href="/signin" className="text-primary hover:underline">
                {t("auth.signIn")}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 
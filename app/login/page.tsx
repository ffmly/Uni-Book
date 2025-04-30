"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"

export default function Login() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Clear any existing user data before attempting to log in
      localStorage.removeItem('currentUser')
      
      const { error } = await signIn(formData.email, formData.password)
      
      if (error) {
        toast.error(error)
        return
      }

      // Get the user from localStorage
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}')

      // Redirect based on user role
      switch (user.role) {
        case 'student':
          router.push('/project/dashboard')
          break
        case 'organization':
          router.push('/organization/dashboard')
          break
        case 'admin':
          router.push('/admin/dashboard')
          break
        default:
          router.push('/')
      }

      toast.success('Logged in successfully!')
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Failed to log in')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <main className="container mx-auto flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Welcome to Uni-Book</h1>
            <p className="text-muted-foreground">Sign in to continue</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="mt-4 text-sm text-center">
            <p className="text-muted-foreground">Don't have an account?</p>
            <Button
              variant="link"
              onClick={() => router.push("/signup")}
              className="text-primary hover:underline"
            >
              Sign Up
            </Button>
          </div>
        </form>
      </Card>
    </main>
  )
} 
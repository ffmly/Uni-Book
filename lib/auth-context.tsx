"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { getUserByEmail, createUser } from "@/lib/local-storage"
import type { User } from "@/lib/types"

type AuthContextType = {
  user: User | null
  signUp: (email: string, password: string, userData: { name: string; role: 'admin' | 'organization' | 'student' }) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const signUp = async (
    email: string, 
    password: string, 
    userData: { 
      name: string; 
      role: 'admin' | 'organization' | 'student' 
    }
  ) => {
    try {
      const existingUser = getUserByEmail(email)
      if (existingUser) {
        return { error: "User already exists" }
      }

      const newUser = createUser({
        email,
        password,
        name: userData.name,
        role: userData.role
      })

      setUser(newUser)
      localStorage.setItem('currentUser', JSON.stringify(newUser))
      return { error: null }
    } catch (error) {
      console.error("Error in signUp:", error)
      return { error: "An unexpected error occurred" }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const user = getUserByEmail(email)
      if (!user || user.password !== password) {
        return { error: "Invalid email or password" }
      }

      setUser(user)
      localStorage.setItem('currentUser', JSON.stringify(user))
      return { error: null }
    } catch (error) {
      console.error("Error in signIn:", error)
      return { error: "An unexpected error occurred" }
    }
  }

  const signOut = async () => {
    try {
      setUser(null)
      localStorage.removeItem('currentUser')
      // Redirect to home page
      window.location.href = "/"
    } catch (error) {
      console.error("Error in signOut:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}


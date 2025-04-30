"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    router.push('/login')
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleLogout}
      className="gap-2"
    >
      <LogOut size={16} />
      Logout
    </Button>
  )
} 
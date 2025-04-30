"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function SuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user came from project submission
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null')
    if (!user) {
      router.push('/login')
      return
    }
  }, [router])

  return (
    <main className="container mx-auto flex min-h-screen items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-24 w-24 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold">Project Submitted Successfully!</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your project has been submitted and will be reviewed by the relevant organization. 
          You will be notified once there are updates.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
          <Button variant="outline" onClick={() => router.push('/admin/dashboard')}>
            Submit Another Project
          </Button>
        </div>
      </div>
    </main>
  )
} 
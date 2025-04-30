"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import ThemeToggle from "@/components/theme-toggle"
import LanguageToggle from "@/components/language-toggle"
import LogoutButton from "@/components/logout-button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Types
interface Project {
  id: string
  title: string
  department: string
  description: string
  leaderInfo: {
    firstName: string
    lastName: string
    studentId: string
    faculty: string
    fieldOfStudy: string
  }
  status: 'pending' | 'assigned' | 'rejected'
  assignedTo?: string
  createdAt: string
}

const organizations = [
  { id: 'org1', name: 'Organization 1' },
  { id: 'org2', name: 'Organization 2' },
  { id: 'org3', name: 'Organization 3' },
]

export default function AdminDashboard() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null')
    if (!user || user.role !== 'admin') {
      router.push('/login')
      return
    }

    // Load projects from localStorage
    const savedProjects = localStorage.getItem('projects')
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    }
    setLoading(false)
  }, [router])

  const handleAssignProject = (projectId: string, organizationId: string) => {
    setProjects(prevProjects => {
      const updatedProjects = prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            status: 'assigned' as const,
            assignedTo: organizationId
          }
        }
        return project
      })
      
      // Save to localStorage
      localStorage.setItem('projects', JSON.stringify(updatedProjects))
      return updatedProjects
    })

    toast.success('Project assigned successfully!')
  }

  const handleRejectProject = (projectId: string) => {
    setProjects(prevProjects => {
      const updatedProjects = prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            status: 'rejected' as const
          }
        }
        return project
      })
      
      // Save to localStorage
      localStorage.setItem('projects', JSON.stringify(updatedProjects))
      return updatedProjects
    })

    toast.success('Project rejected')
  }

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  return (
    <main dir={language === "ar" ? "rtl" : "ltr"} className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage project submissions</p>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>

      <div className="grid gap-6">
        {projects.length === 0 ? (
          <Card className="p-6">
            <p className="text-center text-muted-foreground">No projects submitted yet</p>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{project.title}</h2>
                  <p className="text-muted-foreground">Department: {project.department}</p>
                </div>
                <Badge
                  variant={
                    project.status === 'assigned'
                      ? 'default'
                      : project.status === 'rejected'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Project Description</h3>
                  <p>{project.description}</p>
                </div>

                <div>
                  <h3 className="font-medium">Team Leader</h3>
                  <p>
                    {project.leaderInfo.firstName} {project.leaderInfo.lastName} ({project.leaderInfo.studentId})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {project.leaderInfo.faculty} - {project.leaderInfo.fieldOfStudy}
                  </p>
                </div>

                {project.status === 'pending' && (
                  <div className="flex items-center gap-4">
                    <Select onValueChange={(value) => handleAssignProject(project.id, value)}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Assign to organization" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizations.map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="destructive"
                      onClick={() => handleRejectProject(project.id)}
                    >
                      Reject Project
                    </Button>
                  </div>
                )}

                {project.status === 'assigned' && (
                  <p className="text-sm">
                    Assigned to: {organizations.find(org => org.id === project.assignedTo)?.name}
                  </p>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </main>
  )
}


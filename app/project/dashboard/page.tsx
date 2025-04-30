"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import ThemeToggle from "@/components/theme-toggle"
import LanguageToggle from "@/components/language-toggle"
import LogoutButton from "@/components/logout-button"

type Project = {
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
  status: 'pending' | 'assigned' | 'rejected' | 'accepted'
  createdAt: string
  orgDecision?: string
  decisionDate?: string
  teamMembers?: {
    firstName: string
    lastName: string
    studentId: string
    faculty: string
    fieldOfStudy: string
  }[]
}

export default function StudentDashboard() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is student
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null')
    if (!user || user.role !== 'student') {
      router.push('/login')
      return
    }

    // Load projects from localStorage
    const savedProjects = JSON.parse(localStorage.getItem('projects') || '[]')
    setProjects(savedProjects)
    setLoading(false)
  }, [router])

  const getStatusMessage = (status: Project['status'], orgDecision?: string) => {
    if (status === 'pending') {
      return 'Your project is pending review'
    }
    if (status === 'assigned') {
      return orgDecision 
        ? `Organization has ${orgDecision} your project`
        : 'Your project is being reviewed by the organization'
    }
    if (status === 'accepted') {
      return 'Congratulations! Your project has been accepted'
    }
    if (status === 'rejected') {
      return 'Your project has been rejected'
    }
    return 'Unknown status'
  }

  const getStatusColor = (status: Project['status'], orgDecision?: string) => {
    if (status === 'pending') {
      return 'bg-yellow-500'
    }
    if (status === 'assigned') {
      if (orgDecision === 'accepted') return 'bg-green-500'
      if (orgDecision === 'rejected') return 'bg-red-500'
      return 'bg-blue-500'
    }
    if (status === 'accepted') {
      return 'bg-green-500'
    }
    if (status === 'rejected') {
      return 'bg-red-500'
    }
    return 'bg-gray-500'
  }

  return (
    <main className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Projects</h1>
          <p className="text-muted-foreground">View your submitted projects</p>
        </div>
        <div className="flex items-center gap-2">
          {projects.length === 0 && (
            <Button onClick={() => router.push('/project/submit')}>
              Submit New Project
            </Button>
          )}
          <LanguageToggle />
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading projects...</div>
      ) : projects.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Projects Yet</CardTitle>
            <CardDescription>
              You haven't submitted any projects yet. Click the button above to submit your first project.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-6">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>
                      Submitted on {new Date(project.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(project.status, project.orgDecision)}>
                    {project.orgDecision 
                      ? project.orgDecision.charAt(0).toUpperCase() + project.orgDecision.slice(1)
                      : project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Status</h3>
                    <p className="text-muted-foreground">
                      {getStatusMessage(project.status, project.orgDecision)}
                      {project.decisionDate && (
                        <span className="block text-sm">
                          Decision made on {new Date(project.decisionDate).toLocaleDateString()}
                        </span>
                      )}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold">Department</h3>
                    <p className="text-muted-foreground">{project.department}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold">Description</h3>
                    <p className="text-muted-foreground">{project.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold">Team Leader</h3>
                    <p className="text-muted-foreground">
                      {project.leaderInfo.firstName} {project.leaderInfo.lastName}
                      <br />
                      {project.leaderInfo.faculty} - {project.leaderInfo.fieldOfStudy}
                      <br />
                      Student ID: {project.leaderInfo.studentId}
                    </p>
                  </div>

                  {project.teamMembers && project.teamMembers.length > 0 && (
                    <div>
                      <h3 className="font-semibold">Team Members</h3>
                      <div className="space-y-2">
                        {project.teamMembers.map((member, index) => (
                          <div key={index} className="text-muted-foreground">
                            {member.firstName} {member.lastName} - {member.studentId}
                            <br />
                            <span className="text-sm">
                              {member.faculty} - {member.fieldOfStudy}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
} 
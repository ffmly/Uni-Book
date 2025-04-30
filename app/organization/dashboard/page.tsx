"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import ThemeToggle from "@/components/theme-toggle"
import LanguageToggle from "@/components/language-toggle"
import LogoutButton from "@/components/logout-button"

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
  teamMembers: Array<{
    firstName: string
    lastName: string
    birthDate: string
    birthPlace: string
    faculty: string
    studentId: string
    fieldOfStudy: string
  }>
  status: 'pending' | 'assigned' | 'rejected' | 'accepted'
  assignedTo: string
  createdAt: string
  orgDecision?: 'accepted' | 'rejected'
  decisionDate?: string
}

export default function OrganizationDashboard() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is organization
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null')
    if (!user || user.role !== 'organization') {
      router.push('/login')
      return
    }

    // Load projects from localStorage and filter for this organization
    const savedProjects = JSON.parse(localStorage.getItem('projects') || '[]')
    const orgProjects = savedProjects.filter(
      (project: Project) => project.status === 'assigned' && project.assignedTo === user.id
    )
    setProjects(orgProjects)
    setLoading(false)
  }, [router])

  const handleDecision = (projectId: string, decision: 'accepted' | 'rejected') => {
    // Update all projects in localStorage
    const allProjects = JSON.parse(localStorage.getItem('projects') || '[]')
    const updatedProjects = allProjects.map((project: Project) => {
      if (project.id === projectId) {
        return {
          ...project,
          status: decision,
          orgDecision: decision,
          decisionDate: new Date().toISOString()
        }
      }
      return project
    })
    localStorage.setItem('projects', JSON.stringify(updatedProjects))

    // Update local state
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          status: decision,
          orgDecision: decision,
          decisionDate: new Date().toISOString()
        }
      }
      return project
    }))

    toast.success(`Project ${decision === 'accepted' ? 'accepted' : 'rejected'} successfully`)
  }

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  return (
    <main className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Organization Dashboard</h1>
          <p className="text-muted-foreground">View assigned projects</p>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>

      {projects.length === 0 ? (
        <Card className="p-6">
          <p className="text-center text-muted-foreground">No projects assigned yet</p>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Team Leader</TableHead>
                <TableHead>Team Members</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{project.department}</TableCell>
                  <TableCell>
                    {project.leaderInfo.firstName} {project.leaderInfo.lastName}
                    <br />
                    <span className="text-sm text-muted-foreground">
                      {project.leaderInfo.faculty}
                    </span>
                  </TableCell>
                  <TableCell>
                    {project.teamMembers?.length > 0 ? (
                      <div className="space-y-1">
                        {project.teamMembers.map((member, index) => (
                          <div key={index} className="text-sm">
                            {member.firstName} {member.lastName}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">No team members</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(project.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {project.orgDecision ? (
                      <Badge
                        variant={project.orgDecision === 'accepted' ? 'default' : 'destructive'}
                      >
                        {project.orgDecision.charAt(0).toUpperCase() + project.orgDecision.slice(1)}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Pending Decision</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {!project.orgDecision && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="gap-1"
                          onClick={() => handleDecision(project.id, 'accepted')}
                        >
                          <Check size={16} />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-1"
                          onClick={() => handleDecision(project.id, 'rejected')}
                        >
                          <X size={16} />
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="mt-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Project Details</h2>
          {projects.map((project) => (
            <div key={project.id} className="mb-8 last:mb-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">{project.title}</h3>
                {project.orgDecision ? (
                  <div className="text-sm">
                    <Badge
                      variant={project.orgDecision === 'accepted' ? 'default' : 'destructive'}
                    >
                      {project.orgDecision.charAt(0).toUpperCase() + project.orgDecision.slice(1)}
                    </Badge>
                    {project.decisionDate && (
                      <p className="text-muted-foreground mt-1">
                        Decision made on {new Date(project.decisionDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="gap-1"
                      onClick={() => handleDecision(project.id, 'accepted')}
                    >
                      <Check size={16} />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-1"
                      onClick={() => handleDecision(project.id, 'rejected')}
                    >
                      <X size={16} />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Description</h4>
                  <p className="text-muted-foreground">{project.description}</p>
                </div>

                <div>
                  <h4 className="font-medium">Team Leader</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Name</p>
                      <p className="text-muted-foreground">
                        {project.leaderInfo.firstName} {project.leaderInfo.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Student ID</p>
                      <p className="text-muted-foreground">{project.leaderInfo.studentId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Faculty</p>
                      <p className="text-muted-foreground">{project.leaderInfo.faculty}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Field of Study</p>
                      <p className="text-muted-foreground">{project.leaderInfo.fieldOfStudy}</p>
                    </div>
                  </div>
                </div>

                {project.teamMembers && project.teamMembers.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Team Members</h4>
                    <div className="grid gap-4">
                      {project.teamMembers.map((member, index) => (
                        <Card key={index} className="p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Name</p>
                              <p className="text-muted-foreground">
                                {member.firstName} {member.lastName}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Student ID</p>
                              <p className="text-muted-foreground">{member.studentId}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Birth Date</p>
                              <p className="text-muted-foreground">{member.birthDate}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Birth Place</p>
                              <p className="text-muted-foreground">{member.birthPlace}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Faculty</p>
                              <p className="text-muted-foreground">{member.faculty}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Field of Study</p>
                              <p className="text-muted-foreground">{member.fieldOfStudy}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </main>
  )
} 
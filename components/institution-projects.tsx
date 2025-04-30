"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"
import { toast } from "@/components/ui/use-toast"
import { Edit, Check, X } from "lucide-react"
import type { Project, User } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"

export default function InstitutionProjects() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          team_members (*)
        `)
        .eq("institution_id", user?.institutionId)
        .order("created_at", { ascending: false })

      if (error) throw error

      setProjects(data || [])
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast({
        title: t("project.error"),
        description: t("project.errorDescription"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStatus = async (projectId: string, status: Project["status"]) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId)

      if (error) throw error

      setProjects(
        projects.map((project) =>
          project.id === projectId
            ? { ...project, status, updated_at: new Date().toISOString() }
            : project
        )
      )

      toast({
        title: t("project.statusUpdated"),
        description: t("project.statusUpdatedDescription"),
      })
    } catch (error) {
      console.error("Error updating project status:", error)
      toast({
        title: t("project.error"),
        description: t("project.errorDescription"),
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            {t("project.status.pending")}
          </Badge>
        )
      case "under_review":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            {t("project.status.underReview")}
          </Badge>
        )
      case "assigned_to_business_incubator":
      case "assigned_to_cde":
      case "assigned_to_cati":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            {t(`project.status.${status}`)}
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            {t("project.status.rejected")}
          </Badge>
        )
    }
  }

  if (isLoading) {
    return <div>{t("project.loading")}</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("project.title")}</TableHead>
                <TableHead>{t("project.status")}</TableHead>
                <TableHead>{t("project.submittedAt")}</TableHead>
                <TableHead className="w-[200px]">{t("project.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{getStatusBadge(project.status)}</TableCell>
                  <TableCell>
                    {new Date(project.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedProject(project)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {project.status === "under_review" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdateStatus(project.id, "assigned_to_business_incubator")}
                          >
                            <Check className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdateStatus(project.id, "rejected")}
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedProject.title}</DialogTitle>
              <DialogDescription>{selectedProject.description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <h4 className="font-medium">{t("project.teamMembers")}</h4>
              {selectedProject.team_members?.map((member) => (
                <div key={member.id} className="rounded-lg border p-4">
                  <p className="font-medium">
                    {member.first_name} {member.last_name}
                  </p>
                  <p>{member.student_id}</p>
                  <p>{member.faculty}</p>
                  <p>{member.field_of_study}</p>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button onClick={() => setSelectedProject(null)}>
                {t("project.close")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 
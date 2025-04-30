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
import type { Project, InstitutionType } from "@/lib/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/lib/supabase"

export default function AdminProjects() {
  const { t } = useLanguage()
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
        .order("submitted_at", { ascending: false })

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

  const handleAssignInstitution = async (projectId: string, institutionId: InstitutionType) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({
          institution_id: institutionId,
          status: "under_review",
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId)

      if (error) throw error

      setProjects(
        projects.map((project) =>
          project.id === projectId
            ? { ...project, institution_id: institutionId, status: "under_review" }
            : project
        )
      )

      toast({
        title: t("project.assigned"),
        description: t("project.assignedDescription"),
      })
    } catch (error) {
      console.error("Error assigning institution:", error)
      toast({
        title: t("project.error"),
        description: t("project.errorDescription"),
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "submitted":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            {t("project.status.submitted")}
          </Badge>
        )
      case "under_review":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            {t("project.status.underReview")}
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            {t("project.status.accepted")}
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
    return <div>{t("common.loading")}</div>
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
                <TableHead>{t("project.institution")}</TableHead>
                <TableHead>{t("project.submittedAt")}</TableHead>
                <TableHead className="w-[150px]">{t("project.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{getStatusBadge(project.status)}</TableCell>
                  <TableCell>
                    {project.institution_id ? (
                      <span>{project.institution_id}</span>
                    ) : (
                      <Select
                        onValueChange={(value) => handleAssignInstitution(project.id, value as InstitutionType)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("project.selectInstitution")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engineering">كلية الهندسة</SelectItem>
                          <SelectItem value="science">كلية العلوم</SelectItem>
                          <SelectItem value="medicine">كلية الطب</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(project.submitted_at).toLocaleDateString()}
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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 
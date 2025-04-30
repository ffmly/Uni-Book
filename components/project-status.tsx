"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { getProjects } from "@/lib/local-storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ProjectStatus() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const [project, setProject] = useState<any>(null)

  useEffect(() => {
    const projectId = searchParams.get("projectId")
    if (projectId) {
      const projects = getProjects()
      const projectData = projects.find(p => p.id === projectId)
      setProject(projectData)
    }
  }, [searchParams])

  if (!project) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-500"
      case "underReview":
        return "bg-yellow-500"
      case "assigned":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {t("project.submitted")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{t("project.title")}</h3>
            <p>{project.title}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t("project.description")}</h3>
            <p>{project.description}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t("project.department")}</h3>
            <p>{t(`project.departments.${project.department}`)}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t("project.status")}</h3>
            <Badge className={getStatusColor(project.status)}>
              {t(`project.status.${project.status}`)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
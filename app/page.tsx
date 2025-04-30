"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { getProjects, getOrganizationById } from "@/lib/local-storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ProjectSubmission from "@/components/project-submission"
import { CheckCircle2, LogOut, Clock, AlertCircle } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const [project, setProject] = useState<any>(null)
  const [showSubmission, setShowSubmission] = useState(true)
  const [userProjects, setUserProjects] = useState<any[]>([])

  useEffect(() => {
    // Check user role and redirect if needed
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
    if (currentUser) {
      if (currentUser.role === 'admin') {
        router.push('/admin/dashboard')
        return
      } else if (currentUser.role === 'organization') {
        router.push('/organization/dashboard')
        return
      } else {
        // Load user's projects
        const allProjects = getProjects()
        const userProjects = allProjects.filter(p => p.owner_id === currentUser.id)
        setUserProjects(userProjects)
      }
    } else {
      router.push('/login')
      return
    }

    const projectId = searchParams.get("projectId")
    const status = searchParams.get("status")
    
    if (projectId && status === "success") {
      const projects = getProjects()
      const projectData = projects.find(p => p.id === projectId)
      if (projectData) {
        setProject(projectData)
        setShowSubmission(false)
      }
    }
  }, [searchParams, router])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    router.push('/login')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_review':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">{t('project.status.pending')}</Badge>
      case 'under_review':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">{t('project.status.underReview')}</Badge>
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">{t('project.status.approved')}</Badge>
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">{t('project.status.rejected')}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_review':
        return <Clock className="h-8 w-8 text-yellow-500" />
      case 'under_review':
        return <Clock className="h-8 w-8 text-blue-500" />
      case 'approved':
        return <CheckCircle2 className="h-8 w-8 text-green-500" />
      case 'rejected':
        return <AlertCircle className="h-8 w-8 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Uni-Book</h1>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="mr-2 h-4 w-4" />
          {t('auth.logout')}
        </Button>
      </div>

      {showSubmission ? (
        <ProjectSubmission />
      ) : project ? (
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-t-lg">
              <div className="flex items-center justify-center space-x-3">
                {getStatusIcon(project.status)}
                <CardTitle className="text-2xl font-bold text-center">
                  {t("project.submitted")}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("project.title")}
                  </h3>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {project.title}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("project.department")}
                  </h3>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t(`project.departments.${project.department}`)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("project.description")}
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {project.description}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("project.status")}
                </h3>
                <div className="flex items-center gap-2">
                  {getStatusBadge(project.status)}
                </div>
              </div>

              {project.organization_id && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("project.organization")}
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {getOrganizationById(project.organization_id)?.name}
                  </p>
                </div>
              )}

              <div className="flex justify-center pt-4">
                <Button onClick={() => setShowSubmission(true)}>
                  {t("project.submitAnother")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">{t("project.myProjects")}</h2>
          <div className="grid gap-4">
            {userProjects.map(project => (
              <Card key={project.id} className="shadow-md">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="text-sm text-gray-600">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(project.status)}
                    </div>
                  </div>
                  
                  {project.organization_id && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        {t("project.reviewedBy")}: {getOrganizationById(project.organization_id)?.name}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {userProjects.length === 0 && (
              <p className="text-center text-gray-500 py-4">{t("project.noProjects")}</p>
            )}
            
            <div className="flex justify-center pt-4">
              <Button onClick={() => setShowSubmission(true)}>
                {t("project.submitNew")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


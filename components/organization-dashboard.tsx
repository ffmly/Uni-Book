"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/language-context'
import { getProjects, updateProjectStatus, getUserById } from '@/lib/local-storage'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

export default function OrganizationDashboard() {
  const router = useRouter()
  const { t } = useLanguage()
  const [projects, setProjects] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("under_review")
  const [reviewComments, setReviewComments] = useState<Record<string, string>>({})

  useEffect(() => {
    // Check if user is organization member
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null')
    if (!user || user.role !== 'organization') {
      router.push('/login')
      return
    }
    setCurrentUser(user)

    // Load projects assigned to this organization
    const allProjects = getProjects()
    const orgProjects = allProjects.filter(p => p.organization_id === user.organization_id)
    setProjects(orgProjects)
  }, [router])

  const handleStatusUpdate = (projectId: string, status: string) => {
    const project = projects.find(p => p.id === projectId)
    if (project && project.status === 'under_review') {
      const updatedProject = updateProjectStatus(projectId, status, currentUser.organization_id)
      if (updatedProject) {
        setProjects(projects.map(p => p.id === projectId ? updatedProject : p))
        toast.success(t('org.projectUpdated'))
      }
    } else {
      toast.error(t('org.statusLocked'))
    }
  }

  const handleCommentChange = (projectId: string, comment: string) => {
    setReviewComments(prev => ({
      ...prev,
      [projectId]: comment
    }))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'under_review':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">{t('org.status.underReview')}</Badge>
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">{t('org.status.approved')}</Badge>
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">{t('org.status.rejected')}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredProjects = projects.filter(project => {
    if (activeTab === "under_review") return project.status === 'under_review'
    if (activeTab === "approved") return project.status === 'approved'
    if (activeTab === "rejected") return project.status === 'rejected'
    return true
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('org.dashboard')}</h1>

      <Tabs defaultValue="under_review" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="under_review">{t('org.status.underReview')}</TabsTrigger>
          <TabsTrigger value="approved">{t('org.status.approved')}</TabsTrigger>
          <TabsTrigger value="rejected">{t('org.status.rejected')}</TabsTrigger>
        </TabsList>

        <TabsContent value="under_review">
          <div className="grid gap-4">
            {filteredProjects.map(project => {
              const owner = getUserById(project.owner_id)
              return (
                <div key={project.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="text-sm text-gray-600">{project.description}</p>
                      <p className="text-sm">Owner: {owner?.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(project.status)}
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-4">
                    <Textarea
                      placeholder={t('org.reviewComments')}
                      value={reviewComments[project.id] || ''}
                      onChange={(e) => handleCommentChange(project.id, e.target.value)}
                      className="min-h-[100px]"
                    />
                    
                    <div className="flex gap-2">
                      <Select
                        value={project.status}
                        onValueChange={(value) => handleStatusUpdate(project.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('org.selectStatus')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="approved">{t('org.status.approved')}</SelectItem>
                          <SelectItem value="rejected">{t('org.status.rejected')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )
            })}
            {filteredProjects.length === 0 && (
              <p className="text-center text-gray-500 py-4">{t('org.noUnderReviewProjects')}</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="approved">
          <div className="grid gap-4">
            {filteredProjects.map(project => {
              const owner = getUserById(project.owner_id)
              return (
                <div key={project.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="text-sm text-gray-600">{project.description}</p>
                      <p className="text-sm">Owner: {owner?.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(project.status)}
                    </div>
                  </div>
                </div>
              )
            })}
            {filteredProjects.length === 0 && (
              <p className="text-center text-gray-500 py-4">{t('org.noApprovedProjects')}</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rejected">
          <div className="grid gap-4">
            {filteredProjects.map(project => {
              const owner = getUserById(project.owner_id)
              return (
                <div key={project.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="text-sm text-gray-600">{project.description}</p>
                      <p className="text-sm">Owner: {owner?.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(project.status)}
                    </div>
                  </div>
                </div>
              )
            })}
            {filteredProjects.length === 0 && (
              <p className="text-center text-gray-500 py-4">{t('org.noRejectedProjects')}</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 
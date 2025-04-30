"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/language-context'
import { 
  getProjects, 
  updateProjectStatus, 
  getAllOrganizations,
  getUserById,
  getOrganizationById
} from '@/lib/local-storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

export default function AdminDashboard() {
  const router = useRouter()
  const { t } = useLanguage()
  const [projects, setProjects] = useState<any[]>([])
  const [organizations, setOrganizations] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("pending")
  const [newOrg, setNewOrg] = useState({
    name: '',
    email: '',
    description: ''
  })

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null')
    if (!user || user.role !== 'admin') {
      router.push('/login')
      return
    }

    // Load data
    setProjects(getProjects())
    setOrganizations(getAllOrganizations())
  }, [router])

  const handleProjectStatusUpdate = (projectId: string, status: string, organizationId?: string) => {
    const updatedProject = updateProjectStatus(projectId, status as any, organizationId)
    if (updatedProject) {
      setProjects(projects.map(p => p.id === projectId ? updatedProject : p))
      toast.success(t('admin.projectUpdated'))
    }
  }

  const handleAssignToOrganization = (projectId: string, organizationId: string) => {
    const updatedProject = updateProjectStatus(projectId, 'under_review', organizationId)
    if (updatedProject) {
      setProjects(projects.map(p => p.id === projectId ? updatedProject : p))
      toast.success(t('admin.projectAssigned'))
    }
  }

  const handleCreateOrganization = () => {
    if (!newOrg.name || !newOrg.email) {
      toast.error(t('admin.orgRequiredFields'))
      return
    }

    createOrganization(newOrg)
    setOrganizations(getAllOrganizations())
    setNewOrg({ name: '', email: '', description: '' })
    toast.success(t('admin.orgCreated'))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_review':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">{t('admin.status.pending')}</Badge>
      case 'under_review':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">{t('admin.status.underReview')}</Badge>
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">{t('admin.status.approved')}</Badge>
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">{t('admin.status.rejected')}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredProjects = projects.filter(project => {
    if (activeTab === "pending") return project.status === 'pending_review'
    if (activeTab === "under_review") return project.status === 'under_review'
    if (activeTab === "approved") return project.status === 'approved'
    if (activeTab === "rejected") return project.status === 'rejected'
    return true
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('admin.dashboard')}</h1>

      <Tabs defaultValue="pending" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="pending">{t('admin.status.pending')}</TabsTrigger>
          <TabsTrigger value="under_review">{t('admin.status.underReview')}</TabsTrigger>
          <TabsTrigger value="approved">{t('admin.status.approved')}</TabsTrigger>
          <TabsTrigger value="rejected">{t('admin.status.rejected')}</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
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
                  
                  <div className="mt-4 space-y-2">
                    <Select
                      value={project.organization_id || ''}
                      onValueChange={(value) => handleAssignToOrganization(project.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('admin.assignOrg')} />
                      </SelectTrigger>
                      <SelectContent>
                        {organizations.map(org => (
                          <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )
            })}
            {filteredProjects.length === 0 && (
              <p className="text-center text-gray-500 py-4">{t('admin.noPendingProjects')}</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="under_review">
          <div className="grid gap-4">
            {filteredProjects.map(project => {
              const owner = getUserById(project.owner_id)
              const org = getOrganizationById(project.organization_id || '')
              return (
                <div key={project.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="text-sm text-gray-600">{project.description}</p>
                      <p className="text-sm">Owner: {owner?.name}</p>
                      <p className="text-sm text-gray-600">
                        {t('admin.assignedTo')}: {org?.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(project.status)}
                    </div>
                  </div>
                </div>
              )
            })}
            {filteredProjects.length === 0 && (
              <p className="text-center text-gray-500 py-4">{t('admin.noUnderReviewProjects')}</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="approved">
          <div className="grid gap-4">
            {filteredProjects.map(project => {
              const owner = getUserById(project.owner_id)
              const org = getOrganizationById(project.organization_id || '')
              return (
                <div key={project.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="text-sm text-gray-600">{project.description}</p>
                      <p className="text-sm">Owner: {owner?.name}</p>
                      <p className="text-sm text-gray-600">
                        {t('admin.assignedTo')}: {org?.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(project.status)}
                    </div>
                  </div>
                </div>
              )
            })}
            {filteredProjects.length === 0 && (
              <p className="text-center text-gray-500 py-4">{t('admin.noApprovedProjects')}</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rejected">
          <div className="grid gap-4">
            {filteredProjects.map(project => {
              const owner = getUserById(project.owner_id)
              const org = getOrganizationById(project.organization_id || '')
              return (
                <div key={project.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="text-sm text-gray-600">{project.description}</p>
                      <p className="text-sm">Owner: {owner?.name}</p>
                      <p className="text-sm text-gray-600">
                        {t('admin.assignedTo')}: {org?.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(project.status)}
                    </div>
                  </div>
                </div>
              )
            })}
            {filteredProjects.length === 0 && (
              <p className="text-center text-gray-500 py-4">{t('admin.noRejectedProjects')}</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Organizations Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t('admin.organizations')}</h2>
        
        {/* Create Organization Form */}
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="font-semibold mb-4">{t('admin.createOrg')}</h3>
          <div className="grid gap-4">
            <Input
              placeholder={t('admin.orgName')}
              value={newOrg.name}
              onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
            />
            <Input
              type="email"
              placeholder={t('admin.orgEmail')}
              value={newOrg.email}
              onChange={(e) => setNewOrg({ ...newOrg, email: e.target.value })}
            />
            <Textarea
              placeholder={t('admin.orgDescription')}
              value={newOrg.description}
              onChange={(e) => setNewOrg({ ...newOrg, description: e.target.value })}
            />
            <Button onClick={handleCreateOrganization}>
              {t('admin.createOrg')}
            </Button>
          </div>
        </div>

        {/* Organizations List */}
        <div className="grid gap-4">
          {organizations.map(org => (
            <div key={org.id} className="border p-4 rounded-lg">
              <h3 className="font-semibold">{org.name}</h3>
              <p className="text-sm text-gray-600">{org.description}</p>
              <p className="text-sm">{org.email}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 
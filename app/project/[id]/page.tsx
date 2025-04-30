'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

interface Project {
  id: string
  title: string
  description: string
  ownerId: string
  status: 'draft' | 'in_progress' | 'completed'
  createdAt: string
  updatedAt: string
}

export default function ProjectDetails({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
    if (!currentUser) {
      router.push('/login')
      return
    }

    // Get project from localStorage
    const allProjects = JSON.parse(localStorage.getItem('projects') || '[]')
    const project = allProjects.find((p: any) => p.id === params.id)
    
    if (!project) {
      toast.error('Project not found')
      router.push('/project/dashboard')
      return
    }

    // Check if user owns this project
    if (project.ownerId !== currentUser.id) {
      toast.error('You do not have permission to view this project')
      router.push('/project/dashboard')
      return
    }

    setProject(project)
    setLoading(false)
  }, [params.id, router])

  const handleDelete = () => {
    if (!project) return

    if (window.confirm('Are you sure you want to delete this project?')) {
      const allProjects = JSON.parse(localStorage.getItem('projects') || '[]')
      const updatedProjects = allProjects.filter((p: any) => p.id !== project.id)
      localStorage.setItem('projects', JSON.stringify(updatedProjects))
      toast.success('Project deleted successfully')
      router.push('/project/dashboard')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!project) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <div className="space-x-4">
            <button
              onClick={() => router.push(`/project/${project.id}/edit`)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{project.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Status</h2>
            <span className={`px-3 py-1 rounded-full text-sm ${
              project.status === 'draft' ? 'bg-gray-200' :
              project.status === 'in_progress' ? 'bg-yellow-200' :
              'bg-green-200'
            }`}>
              {project.status.replace('_', ' ').charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Created</h2>
            <p className="text-gray-700">{new Date(project.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 
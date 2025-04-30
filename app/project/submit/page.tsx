"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { Plus, Minus } from "lucide-react"
import LogoutButton from "@/components/logout-button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import LanguageToggle from "@/components/language-toggle"
import ThemeToggle from "@/components/theme-toggle"

type TeamMember = {
  firstName: string
  lastName: string
  birthDate: string
  birthPlace: string
  faculty: string
  studentId: string
  fieldOfStudy: string
}

const emptyMember: TeamMember = {
  firstName: "",
  lastName: "",
  birthDate: "",
  birthPlace: "",
  faculty: "",
  studentId: "",
  fieldOfStudy: ""
}

export default function SubmitProject() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    description: "",
    firstName: "",
    lastName: "",
    studentId: "",
    faculty: "",
    fieldOfStudy: ""
  })
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if user is student
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null')
    if (!user || user.role !== 'student') {
      router.push('/login')
      return
    }

    // Check if student already has a project
    const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]')
    const userProjects = existingProjects.filter((project: any) => project.ownerId === user.id)
    if (userProjects.length > 0) {
      toast.error('You can only submit one project')
      router.push('/project/dashboard')
      return
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Get current user
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
      if (!currentUser) {
        toast.error('Please log in to submit a project')
        router.push('/login')
        return
      }

      // Create new project object
      const newProject = {
        id: Date.now().toString(),
        title: formData.title,
        department: formData.department,
        description: formData.description,
        leaderInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          studentId: formData.studentId,
          faculty: formData.faculty,
          fieldOfStudy: formData.fieldOfStudy
        },
        teamMembers: teamMembers,
        status: 'pending',
        createdAt: new Date().toISOString(),
        ownerId: currentUser.id
      }

      const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]')
      const updatedProjects = [...existingProjects, newProject]
      localStorage.setItem('projects', JSON.stringify(updatedProjects))

      toast.success('Project submitted successfully!')
      router.push('/project/dashboard')
    } catch (error) {
      console.error('Error submitting project:', error)
      toast.error('Failed to submit project')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddMember = () => {
    if (teamMembers.length < 6) {
      setTeamMembers([...teamMembers, { ...emptyMember }])
    } else {
      toast.error('Maximum 6 team members allowed')
    }
  }

  const handleRemoveMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index))
  }

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    setTeamMembers(teamMembers.map((member, i) => {
      if (i === index) {
        return { ...member, [field]: value }
      }
      return member
    }))
  }

  return (
    <main className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Submit New Project</h1>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>

      <Card className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Project Details</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleInputChange('department', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer_science">Computer Science</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="medicine">Medicine</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Team Leader Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">الاسم</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                  dir="rtl"
                />
              </div>
              
              <div>
                <Label htmlFor="lastName">اللقب</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                  dir="rtl"
                />
              </div>

              <div>
                <Label htmlFor="studentId">رقم الطالب</Label>
                <Input
                  id="studentId"
                  value={formData.studentId}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                  required
                  dir="rtl"
                />
              </div>

              <div>
                <Label htmlFor="faculty">الكلية</Label>
                <Input
                  id="faculty"
                  value={formData.faculty}
                  onChange={(e) => handleInputChange('faculty', e.target.value)}
                  required
                  dir="rtl"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="fieldOfStudy">التخصص</Label>
                <Input
                  id="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={(e) => handleInputChange('fieldOfStudy', e.target.value)}
                  required
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Team Members</h2>
              <Button
                type="button"
                onClick={handleAddMember}
                disabled={teamMembers.length >= 6}
                className="gap-2"
              >
                <Plus size={16} />
                Add Member
              </Button>
            </div>

            {teamMembers.map((member, index) => (
              <Card key={index} className="p-4 mb-4">
                <div className="flex justify-between mb-4">
                  <h3 className="font-semibold">Team Member {index + 1}</h3>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveMember(index)}
                    className="gap-2"
                  >
                    <Minus size={16} />
                    Remove
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>الاسم</Label>
                    <Input
                      value={member.firstName}
                      onChange={(e) => handleMemberChange(index, 'firstName', e.target.value)}
                      required
                      dir="rtl"
                    />
                  </div>
                  
                  <div>
                    <Label>اللقب</Label>
                    <Input
                      value={member.lastName}
                      onChange={(e) => handleMemberChange(index, 'lastName', e.target.value)}
                      required
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <Label>تاريخ الميلاد</Label>
                    <Input
                      type="date"
                      value={member.birthDate}
                      onChange={(e) => handleMemberChange(index, 'birthDate', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>مكان الميلاد</Label>
                    <Input
                      value={member.birthPlace}
                      onChange={(e) => handleMemberChange(index, 'birthPlace', e.target.value)}
                      required
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <Label>الكلية</Label>
                    <Input
                      value={member.faculty}
                      onChange={(e) => handleMemberChange(index, 'faculty', e.target.value)}
                      required
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <Label>رقم الطالب</Label>
                    <Input
                      value={member.studentId}
                      onChange={(e) => handleMemberChange(index, 'studentId', e.target.value)}
                      required
                      dir="rtl"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>التخصص</Label>
                    <Input
                      value={member.fieldOfStudy}
                      onChange={(e) => handleMemberChange(index, 'fieldOfStudy', e.target.value)}
                      required
                      dir="rtl"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Project"}
          </Button>
        </form>
      </Card>
    </main>
  )
} 
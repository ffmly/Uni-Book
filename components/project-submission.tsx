"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/language-context'
import { createProject, createTeamMember } from '@/lib/local-storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default function ProjectSubmission() {
  const router = useRouter()
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    project: {
      title: "",
      description: "",
      department: "",
      status: "pending_review" as const,
      institution_id: "default-institution",
      is_status_confirmed: false
    },
    leader: {
      first_name: "",
      last_name: "",
      date_of_birth: "",
      place_of_birth: "",
      faculty: "",
      student_id: "",
      field_of_study: "",
      is_leader: true
    }
  })

  const handleInputChange = (section: "project" | "leader", field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const validateStep = (step: number) => {
    if (step === 1) {
      const { title, description, department } = formData.project
      if (!title || !description || !department) {
        toast.error(t("project.requiredFields"))
        return false
      }
    } else if (step === 2) {
      const { first_name, last_name, date_of_birth, place_of_birth, faculty, student_id, field_of_study } = formData.leader
      if (!first_name || !last_name || !date_of_birth || !place_of_birth || !faculty || !student_id || !field_of_study) {
        toast.error(t("project.leaderRequired"))
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    if (typeof window !== 'undefined') {
      console.log("Next button clicked, current step:", currentStep)
      if (validateStep(currentStep)) {
        console.log("Validation passed, moving to next step")
        setCurrentStep(prev => {
          console.log("Setting step to:", prev + 1)
          return prev + 1
        })
      } else {
        console.log("Validation failed")
      }
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)
    try {
      // Create project
      const project = await createProject({
        ...formData.project,
        owner_id: "current-user-id", // Replace with actual user ID
        status: "pending" as const,
        is_status_confirmed: false
      })

      // Create team leader
      await createTeamMember({
        ...formData.leader,
        project_id: project.id
      })

      toast.success(t("project.submitted"))
      // Redirect to home page with success message
      router.push("/?status=success&projectId=" + project.id)
    } catch (error) {
      console.error("Submission error:", error)
      toast.error(t("project.submitError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = (currentStep / 2) * 100

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center mb-4">
            {t('project.submit')}
          </CardTitle>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">{t('project.step1')}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('project.title')}
                  </label>
                  <Input
                    value={formData.project.title}
                    onChange={(e) => handleInputChange('project', 'title', e.target.value)}
                    placeholder={t('project.titlePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('project.description')}
                  </label>
                  <Textarea
                    value={formData.project.description}
                    onChange={(e) => handleInputChange('project', 'description', e.target.value)}
                    placeholder={t('project.descriptionPlaceholder')}
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('project.department')}
                  </label>
                  <Select
                    value={formData.project.department}
                    onValueChange={(value) => handleInputChange('project', 'department', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('project.selectDepartment')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">{t('project.departments.engineering')}</SelectItem>
                      <SelectItem value="science">{t('project.departments.science')}</SelectItem>
                      <SelectItem value="arts">{t('project.departments.arts')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">{t('project.leader')}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("project.firstName")}
                  </label>
                  <Input
                    value={formData.leader.first_name}
                    onChange={(e) => handleInputChange("leader", "first_name", e.target.value)}
                    placeholder={t("project.firstNamePlaceholder")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("project.lastName")}
                  </label>
                  <Input
                    value={formData.leader.last_name}
                    onChange={(e) => handleInputChange("leader", "last_name", e.target.value)}
                    placeholder={t("project.lastNamePlaceholder")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("project.dateOfBirth")}
                  </label>
                  <Input
                    type="date"
                    value={formData.leader.date_of_birth}
                    onChange={(e) => handleInputChange("leader", "date_of_birth", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("project.placeOfBirth")}
                  </label>
                  <Input
                    value={formData.leader.place_of_birth}
                    onChange={(e) => handleInputChange("leader", "place_of_birth", e.target.value)}
                    placeholder={t("project.placeOfBirthPlaceholder")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("project.faculty")}
                  </label>
                  <Input
                    value={formData.leader.faculty}
                    onChange={(e) => handleInputChange("leader", "faculty", e.target.value)}
                    placeholder={t("project.facultyPlaceholder")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("project.studentId")}
                  </label>
                  <Input
                    value={formData.leader.student_id}
                    onChange={(e) => handleInputChange("leader", "student_id", e.target.value)}
                    placeholder={t("project.studentIdPlaceholder")}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    {t("project.fieldOfStudy")}
                  </label>
                  <Input
                    value={formData.leader.field_of_study}
                    onChange={(e) => handleInputChange("leader", "field_of_study", e.target.value)}
                    placeholder={t("project.fieldOfStudyPlaceholder")}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isSubmitting}
              >
                {t("project.previous")}
              </Button>
            )}
            {currentStep < 2 ? (
              <Button
                className="ml-auto"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                {t("project.next")}
              </Button>
            ) : (
              <Button
                className="ml-auto"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? t("project.submitting") : t("project.submit")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
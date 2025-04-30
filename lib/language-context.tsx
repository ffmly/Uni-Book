"use client"

import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "fr" | "ar"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (key: string) => string
}

const translations = {
  en: {
    project: {
      submit: "Submit Project",
      submitting: "Submitting...",
      submitted: "Project submitted successfully",
      submitError: "Failed to submit project. Please try again.",
      requiredFields: "Please fill in all required fields for the project",
      leaderRequired: "Please fill in all required fields for the team leader",
      step1: "Project Information",
      title: "Project Title",
      titlePlaceholder: "Enter project title",
      description: "Project Description",
      descriptionPlaceholder: "Enter project description",
      department: "Department",
      selectDepartment: "Select department",
      departments: {
        engineering: "Engineering",
        science: "Science",
        arts: "Arts"
      },
      leader: "Team Leader Information",
      firstName: "First Name",
      firstNamePlaceholder: "Enter first name",
      lastName: "Last Name",
      lastNamePlaceholder: "Enter last name",
      dateOfBirth: "Date of Birth",
      placeOfBirth: "Place of Birth",
      placeOfBirthPlaceholder: "Enter place of birth",
      faculty: "Faculty",
      facultyPlaceholder: "Enter faculty",
      studentId: "Student ID",
      studentIdPlaceholder: "Enter student ID",
      fieldOfStudy: "Field of Study",
      fieldOfStudyPlaceholder: "Enter field of study",
      next: "Next",
      previous: "Previous"
    },
    admin: {
      dashboard: "Admin Dashboard",
      clubs: "Clubs",
      stadiums: "Stadiums",
      timeSlots: "Time Slots",
      reservations: "Reservations",
      autoAssign: "Auto Assign",
      logout: "Logout"
    }
  },
  fr: {
    project: {
      submit: "Soumettre le Projet",
      submitting: "Soumission en cours...",
      submitted: "Projet soumis avec succès",
      submitError: "Échec de la soumission du projet. Veuillez réessayer.",
      requiredFields: "Veuillez remplir tous les champs obligatoires pour le projet",
      leaderRequired: "Veuillez remplir tous les champs obligatoires pour le chef d'équipe",
      step1: "Informations du Projet",
      title: "Titre du Projet",
      titlePlaceholder: "Entrez le titre du projet",
      description: "Description du Projet",
      descriptionPlaceholder: "Entrez la description du projet",
      department: "Département",
      selectDepartment: "Sélectionnez un département",
      departments: {
        engineering: "Ingénierie",
        science: "Sciences",
        arts: "Arts"
      },
      leader: "Informations du Chef d'Équipe",
      firstName: "Prénom",
      firstNamePlaceholder: "Entrez le prénom",
      lastName: "Nom",
      lastNamePlaceholder: "Entrez le nom",
      dateOfBirth: "Date de Naissance",
      placeOfBirth: "Lieu de Naissance",
      placeOfBirthPlaceholder: "Entrez le lieu de naissance",
      faculty: "Faculté",
      facultyPlaceholder: "Entrez la faculté",
      studentId: "Numéro d'Étudiant",
      studentIdPlaceholder: "Entrez le numéro d'étudiant",
      fieldOfStudy: "Domaine d'Étude",
      fieldOfStudyPlaceholder: "Entrez le domaine d'étude",
      next: "Suivant",
      previous: "Précédent"
    },
    admin: {
      dashboard: "Tableau de Bord Admin",
      clubs: "Clubs",
      stadiums: "Stades",
      timeSlots: "Créneaux Horaires",
      reservations: "Réservations",
      autoAssign: "Attribution Auto",
      logout: "Déconnexion"
    }
  },
  ar: {
    project: {
      submit: "تقديم المشروع",
      submitting: "جاري التقديم...",
      submitted: "تم تقديم المشروع بنجاح",
      submitError: "فشل في تقديم المشروع. يرجى المحاولة مرة أخرى.",
      requiredFields: "يرجى ملء جميع الحقول المطلوبة للمشروع",
      leaderRequired: "يرجى ملء جميع الحقول المطلوبة لقائد الفريق",
      step1: "معلومات المشروع",
      title: "عنوان المشروع",
      titlePlaceholder: "أدخل عنوان المشروع",
      description: "وصف المشروع",
      descriptionPlaceholder: "أدخل وصف المشروع",
      department: "القسم",
      selectDepartment: "اختر القسم",
      departments: {
        engineering: "الهندسة",
        science: "العلوم",
        arts: "الفنون"
      },
      leader: "معلومات قائد الفريق",
      firstName: "الاسم الأول",
      firstNamePlaceholder: "أدخل الاسم الأول",
      lastName: "اسم العائلة",
      lastNamePlaceholder: "أدخل اسم العائلة",
      dateOfBirth: "تاريخ الميلاد",
      placeOfBirth: "مكان الميلاد",
      placeOfBirthPlaceholder: "أدخل مكان الميلاد",
      faculty: "الكلية",
      facultyPlaceholder: "أدخل الكلية",
      studentId: "رقم الطالب",
      studentIdPlaceholder: "أدخل رقم الطالب",
      fieldOfStudy: "مجال الدراسة",
      fieldOfStudyPlaceholder: "أدخل مجال الدراسة",
      next: "التالي",
      previous: "السابق"
    },
    admin: {
      dashboard: "لوحة تحكم المشرف",
      clubs: "الأندية",
      stadiums: "الملاعب",
      timeSlots: "المواعيد",
      reservations: "الحجوزات",
      autoAssign: "التعيين التلقائي",
      logout: "تسجيل الخروج"
    }
  }
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string) => key
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const toggleLanguage = () => {
    setLanguageState(prev => {
      if (prev === "en") return "fr"
      if (prev === "fr") return "ar"
      return "en"
    })
  }

  const t = (key: string) => {
    const keys = key.split('.')
    let value: any = translations[language]
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  if (!mounted) {
    return null
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}


export type ProjectStatus = 
  | 'pending' 
  | 'under_review'
  | 'assigned_to_business_incubator'
  | 'assigned_to_cde'
  | 'assigned_to_cati'
  | 'rejected'

export type InstitutionType = 'engineering' | 'science' | 'medicine';

export type OrganizationType = 
  | 'business_incubator'
  | 'cde'
  | 'cati'

export interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  place_of_birth: string;
  faculty: string;
  student_id: string;
  field_of_study: string;
  project_id: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  department: string;
  status: ProjectStatus;
  institution_id: string | null;
  organization_id?: string;
  created_at: string;
  updated_at: string;
  is_status_confirmed: boolean;
  csv_data?: string; // For CSV/Excel data
  training_program_pdf?: string; // For training program PDF
  owner_id: string;
  team_members?: TeamMember[];
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  type: OrganizationType;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Added for local storage authentication
  role: 'admin' | 'organization' | 'student';
  organization_id?: string;
  created_at: string;
  updated_at: string;
  institutionId?: InstitutionType;
} 
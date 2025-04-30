import { Project, Organization, User, ProjectStatus, OrganizationType } from './types'

// Types
export interface Project {
  id: string;
  title: string;
  description: string;
  department: string;
  status: 'pending_review' | 'under_review' | 'approved' | 'rejected';
  owner_id: string;
  organization_id?: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  project_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  place_of_birth: string;
  faculty: string;
  student_id: string;
  field_of_study: string;
  is_leader: boolean;
  created_at: string;
  updated_at: string;
}

// Local Storage Keys
const PROJECTS_KEY = 'uni-book-projects';
const TEAM_MEMBERS_KEY = 'uni-book-team-members';

// Helper functions
const getStoredData = <T>(key: string): T[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setStoredData = <T>(key: string, data: T[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9)

// Project functions
export const getProjects = (): Project[] => {
  const projects = localStorage.getItem('projects');
  return projects ? JSON.parse(projects) : [];
};

export const getProjectById = (id: string): Project | null => {
  const projects = getProjects();
  return projects.find(p => p.id === id) || null;
};

export const createProject = (data: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Project => {
  const projects = getProjects();
  const newProject: Project = {
    id: generateId(),
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  setStoredData(PROJECTS_KEY, [...projects, newProject]);
  return newProject;
};

export const updateProject = (projectId: string, updates: Partial<Project>): Project | null => {
  const projects = getProjects();
  const projectIndex = projects.findIndex(p => p.id === projectId);
  
  if (projectIndex === -1) return null;
  
  const updatedProject = {
    ...projects[projectIndex],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  projects[projectIndex] = updatedProject;
  localStorage.setItem('projects', JSON.stringify(projects));
  
  return updatedProject;
};

export const updateProjectStatus = (projectId: string, status: Project['status'], organizationId?: string): Project | null => {
  return updateProject(projectId, {
    status,
    organization_id: organizationId
  });
};

export const deleteProject = (id: string): boolean => {
  const projects = getProjects();
  const filtered = projects.filter(p => p.id !== id);
  setStoredData(PROJECTS_KEY, filtered);
  return filtered.length < projects.length;
};

// Team Member functions
export const getTeamMembers = (): TeamMember[] => {
  return getStoredData<TeamMember>(TEAM_MEMBERS_KEY);
};

export const getTeamMembersByProjectId = (projectId: string): TeamMember[] => {
  return getTeamMembers().filter(member => member.project_id === projectId);
};

export const createTeamMember = (member: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>): TeamMember => {
  const members = getTeamMembers();
  const newMember: TeamMember = {
    ...member,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  setStoredData(TEAM_MEMBERS_KEY, [...members, newMember]);
  return newMember;
};

export const updateTeamMember = (id: string, updates: Partial<TeamMember>): TeamMember | null => {
  const members = getTeamMembers();
  const index = members.findIndex(m => m.id === id);
  if (index === -1) return null;
  
  const updatedMember = {
    ...members[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  members[index] = updatedMember;
  setStoredData(TEAM_MEMBERS_KEY, members);
  return updatedMember;
};

// Organization functions
export const createOrganization = (data: Omit<Organization, 'id' | 'created_at' | 'updated_at'>): Organization => {
  const organizations = getAllOrganizations();
  const newOrg: Organization = {
    id: generateId(),
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  localStorage.setItem('organizations', JSON.stringify([...organizations, newOrg]));
  return newOrg;
};

export const getAllOrganizations = (): Organization[] => {
  const organizations = localStorage.getItem('organizations');
  return organizations ? JSON.parse(organizations) : [];
};

export const getOrganizationById = (id: string): Organization | null => {
  const organizations = getAllOrganizations();
  return organizations.find(o => o.id === id) || null;
};

// User functions
export const createUser = (data: Omit<User, 'id' | 'created_at' | 'updated_at'>): User => {
  const users = getAllUsers();
  const newUser: User = {
    id: generateId(),
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  localStorage.setItem('users', JSON.stringify([...users, newUser]));
  return newUser;
};

export const getAllUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const getUserById = (id: string): User | null => {
  const users = getAllUsers();
  return users.find(u => u.id === id) || null;
};

export const getUserByEmail = (email: string): User | null => {
  const users = getAllUsers();
  return users.find(u => u.email === email) || null;
};

// Initialize default data
export const initializeDefaultData = () => {
  // Create default organizations if they don't exist
  const organizations = getAllOrganizations();
  if (organizations.length === 0) {
    const businessIncubator = createOrganization({
      name: 'Business Incubator',
      email: 'incubator@university.edu',
      type: 'business_incubator',
      description: 'Business Incubator organization'
    });

    const cde = createOrganization({
      name: 'Center for Enterprise Development',
      email: 'cde@university.edu',
      type: 'cde',
      description: 'Center for Enterprise Development organization'
    });

    const cati = createOrganization({
      name: 'Center for Innovation and Technology Support',
      email: 'cati@university.edu',
      type: 'cati',
      description: 'Center for Innovation and Technology Support organization'
    });

    // Create admin users for each organization
    createUser({
      name: 'Business Incubator Admin',
      email: 'incubator.admin@university.edu',
      password: 'incubator123',
      role: 'organization',
      organization_id: businessIncubator.id
    });

    createUser({
      name: 'CDE Admin',
      email: 'cde.admin@university.edu',
      password: 'cde123',
      role: 'organization',
      organization_id: cde.id
    });

    createUser({
      name: 'CATI Admin',
      email: 'cati.admin@university.edu',
      password: 'cati123',
      role: 'organization',
      organization_id: cati.id
    });

    // Create super admin
    createUser({
      name: 'Super Admin',
      email: 'admin@university.edu',
      password: 'admin123',
      role: 'admin'
    });
  }
}; 
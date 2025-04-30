import { createOrganization, createUser } from './local-storage'

export function initializeDefaultOrganizations() {
  // Create Business Incubator
  const businessIncubator = createOrganization({
    name: 'Business Incubator',
    email: 'incubator@university.edu',
    description: 'Business Incubator organization'
  })

  // Create Center for Enterprise Development
  const cde = createOrganization({
    name: 'Center for Enterprise Development',
    email: 'cde@university.edu',
    description: 'Center for Enterprise Development organization'
  })

  // Create Center for Innovation and Technology Support
  const cati = createOrganization({
    name: 'Center for Innovation and Technology Support',
    email: 'cati@university.edu',
    description: 'Center for Innovation and Technology Support organization'
  })

  // Create admin user for each organization
  createUser({
    name: 'Business Incubator Admin',
    email: 'incubator.admin@university.edu',
    password: 'incubator123',
    role: 'organization',
    organization_id: businessIncubator.id
  })

  createUser({
    name: 'CDE Admin',
    email: 'cde.admin@university.edu',
    password: 'cde123',
    role: 'organization',
    organization_id: cde.id
  })

  createUser({
    name: 'CATI Admin',
    email: 'cati.admin@university.edu',
    password: 'cati123',
    role: 'organization',
    organization_id: cati.id
  })

  // Create super admin
  createUser({
    name: 'Super Admin',
    email: 'admin@university.edu',
    password: 'admin123',
    role: 'admin'
  })
} 
// Test accounts for local development
export const testAccounts = {
  student: {
    email: 'student@uni-book.com',
    password: 'student123',
    role: 'student',
    name: 'Test Student'
  },
  admin: {
    email: 'admin@uni-book.com',
    password: 'admin123',
    role: 'admin',
    name: 'Test Admin'
  },
  organizations: [
    {
      id: 'org1',
      email: 'org1@uni-book.com',
      password: 'org1123',
      role: 'organization',
      name: 'Organization 1'
    },
    {
      id: 'org2',
      email: 'org2@uni-book.com',
      password: 'org2123',
      role: 'organization',
      name: 'Organization 2'
    },
    {
      id: 'org3',
      email: 'org3@uni-book.com',
      password: 'org3123',
      role: 'organization',
      name: 'Organization 3'
    }
  ]
}

// Helper function to check credentials
export function validateCredentials(email: string, password: string) {
  // Check admin
  if (email === testAccounts.admin.email && password === testAccounts.admin.password) {
    return testAccounts.admin
  }

  // Check student
  if (email === testAccounts.student.email && password === testAccounts.student.password) {
    return testAccounts.student
  }

  // Check organizations
  const org = testAccounts.organizations.find(
    org => org.email === email && org.password === password
  )
  if (org) {
    return org
  }

  return null
} 
# Uni-Book - University Project Management System

🏆 **Coding Master National Version 2025 - 7th Place & Special Jury Award** 🏆

## Project Overview
Uni-Book is a comprehensive university project management system designed to streamline the process of submitting, reviewing, and managing student projects. The system facilitates collaboration between students, organizations, and administrators in a university setting.

## Achievement
This project was developed for the Coding Master National Version 2025 competition, where it achieved:
- 7th Place in the National Competition
- Special Jury Award (جائزة لجنة التحكيم)

## Technical Implementation
The current version is implemented with:
- Next.js
- TypeScript
- Tailwind CSS
- Local Storage for data persistence

**Note:** The project is designed to work with Supabase as the backend database. The Supabase integration is already prepared but not currently linked. The current version uses local storage for demonstration purposes.

## Features

### For Students
- Project submission with detailed information
- Team management (up to 6 members)
- Project status tracking
- Real-time updates on project reviews

### For Organizations
- Project review and evaluation
- Decision making (approve/reject)
- Detailed project information access
- Review comments and feedback

### For Administrators
- Project management and oversight
- Organization management
- User management
- System-wide monitoring

## System Architecture

### User Types
1. **Students**
   - Submit projects
   - Manage team information
   - Track project status

2. **Organizations**
   - Business Incubator
   - Center for Enterprise Development
   - Center for Innovation and Technology Support

3. **Administrators**
   - System management
   - User oversight
   - Project assignment

### Project Workflow
1. Student submits project
2. Admin reviews and assigns to organization
3. Organization reviews and makes decision
4. Student receives feedback and status update

## Technical Stack
- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: React Hooks
- **Data Storage**: Local Storage (Supabase ready)
- **Authentication**: Local authentication (Supabase Auth ready)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Default Accounts

### Admin
- Email: admin@university.edu
- Password: admin123

### Organization Accounts
1. Business Incubator
   - Email: incubator.admin@university.edu
   - Password: incubator123

2. Center for Enterprise Development
   - Email: cde.admin@university.edu
   - Password: cde123

3. Center for Innovation and Technology Support
   - Email: cati.admin@university.edu
   - Password: cati123

## Future Enhancements
- Supabase integration for production
- Real-time notifications
- File upload capabilities
- Advanced reporting features
- Mobile application

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Coding Master National Version 2025 organizers
- Project mentors and advisors
- All contributors and supporters

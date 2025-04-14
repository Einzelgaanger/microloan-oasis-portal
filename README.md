
# MicroLoan Oasis - Micro-Lending Platform

![MicroLoan Oasis](https://lovable.dev/projects/774813e3-4be9-4c79-8791-a29d5d7ddfe9/thumbnail)

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Authentication Flow](#authentication-flow)
- [Key Components](#key-components)
- [API Services](#api-services)
- [Styling and UI](#styling-and-ui)
- [Development Guide](#development-guide)
- [Deployment](#deployment)

## Overview

MicroLoan Oasis is a comprehensive micro-lending platform designed to provide accessible financial solutions to individuals in Kenya. The platform allows users to apply for small loans, track their loan applications, and manage their repayments through an intuitive web interface.

The application features a responsive UI with a modern design, role-based access control (user vs admin), comprehensive user profile management, and a complete loan application workflow.

## Features

### User Features
- **Authentication**: Secure login, registration, and profile management
- **User Profiles**: Multi-step profile completion with sections for personal, contact, employment, banking, and next of kin information
- **Loan Applications**: Simple loan application process with amount selection and purpose specification
- **Dashboard**: Track active loans, repayment schedules, and application status
- **Document Upload**: Secure upload system for ID verification, proof of income, and bank statements

### Admin Features
- **Admin Dashboard**: Overview of all loan applications and system metrics
- **Application Review**: Approve, reject, or request more information for loan applications
- **User Management**: View and manage user profiles and their loan histories
- **Reporting**: Generate reports on loan disbursement, repayments, and default rates

## Project Structure

The project follows a standard React application structure with module-based organization:

```
src/
├── components/            # Reusable UI components
│   ├── auth/              # Authentication related components
│   ├── home/              # Homepage components (Hero, Features, etc.)
│   ├── layout/            # Layout components (MainLayout, Navbar, Footer)
│   └── ui/                # UI components (buttons, cards, etc. from shadcn-ui)
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and context providers
├── integrations/          # External service integrations (Supabase)
├── pages/                 # Page components for routes
├── services/              # API services and data handling
└── styles/                # Global styles and theme configuration
```

## Tech Stack

### Frontend
- **React**: UI library (v18.3.1)
- **TypeScript**: Type-safe JavaScript
- **React Router**: Client-side routing (v6.26.2)
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Component library built on Radix UI
- **Lucide React**: Icon library
- **React Query**: Data fetching and state management
- **React Hook Form**: Form handling and validation
- **Sonner**: Toast notifications

### Backend (via Supabase)
- **Supabase Auth**: Authentication and user management
- **Supabase Database**: PostgreSQL database for data storage
- **Supabase Storage**: File storage for documents and images
- **Row Level Security**: Data protection and access control

### Development Tools
- **Vite**: Fast build tool and development server
- **SWC**: JavaScript/TypeScript compiler
- **ESLint**: Code quality and style enforcement
- **PNPM/NPM**: Package management

## Authentication Flow

The authentication system uses Supabase Auth with the following flow:

1. **Registration**: Users sign up with email/password and basic profile info
2. **Login**: Email/password authentication with session persistence
3. **Session Management**: JWT-based sessions with auto-refresh
4. **Role-Based Access**: Different routes for users vs admins
5. **Protected Routes**: Routes wrapped in `<ProtectedRoute>` and `<AdminRoute>` components

Authentication state is managed via the `AuthContext` provider in `/src/lib/auth.tsx`, which provides:
- User state (logged in user information)
- Sign in, sign up, and sign out methods
- Loading state for auth operations
- Protected route components

## Key Components

### Layout Components
- `MainLayout`: Base layout with navigation and footer
- `Navbar`: Navigation bar with dynamic menu based on auth state
- `Footer`: Site footer with links and copyright

### Home Page Components
- `Hero`: Landing page hero section with call-to-action
- `Features`: Product features highlights
- `HowItWorks`: Step-by-step process explanation
- `Testimonials`: User testimonials carousel
- `CallToAction`: Final CTA section with apply button

### Authentication Components
- `AuthLayout`: Shared layout for login/registration pages
- `Login`: Login form with error handling
- `Register`: Registration form with multi-step process

### User Components
- `Dashboard`: User dashboard with loan summary
- `UserProfile`: Comprehensive profile management
- `LoanApplication`: Loan application form and process

### Admin Components
- `AdminDashboard`: Admin overview of system
- `AdminLogin`: Specialized login for administrators

## API Services

The application uses a service layer to abstract data operations:

- `authService`: Authentication operations
- `profileService`: User profile management
- `loanService`: Loan application and management
- `paymentService`: Payment tracking and processing
- `roleService`: User role management

In development mode, the app uses mock services with hardcoded data (in `mockDataService.ts`). In production, these services connect to Supabase.

Sample API call:
```typescript
// Get user profile
const profile = await dataService.profiles.getProfile(userId);

// Create new loan application
await dataService.loans.createLoan({
  user_id: userId,
  amount: 5000,
  purpose: 'Business',
  term: 30,
  status: 'pending'
});
```

## Styling and UI

The app uses Tailwind CSS with custom theming:

### Color Scheme
- **Primary**: Kenya-inspired blue (#005DAA) - Used for buttons, key actions
- **Secondary**: Green (#228B22) - Used for success states, approved indicators
- **Accent**: Gold (#FFB71B) - Used for highlights and accents
- **Destructive**: Red (#D70A0A) - Used for error states and rejections
- **Background**: Light gray (#F9FAFB) - Main background color
- **Black/White**: For text and contrast elements

### Component Design
- **Cards**: Rounded corners, subtle shadows, white backgrounds
- **Buttons**: Prominent with hover effects, clear action colors
- **Forms**: Clean inputs with proper spacing and validation states
- **Animations**: Subtle fade-ins and transitions for better UX

### Responsive Design
The UI is fully responsive with tailored layouts for:
- Mobile (< 640px)
- Tablet (640px - 1024px)
- Desktop (> 1024px)

## Development Guide

### Prerequisites
- Node.js (v18+)
- npm, yarn, or pnpm

### Installation

```sh
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd microloan-oasis

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env` file with:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### Adding New Components

1. Create component file in the appropriate directory
2. Import necessary dependencies and components
3. Define and export the component
4. Add types and props as needed
5. Import and use in the appropriate pages

### Adding New Routes

1. Add the new route in `App.tsx` in the `Routes` component
2. Create the corresponding page component in `/src/pages`
3. Add navigation links in the `Navbar` component if needed

### Database Schema (Supabase)

The primary tables in the database are:

1. **profiles**:
   - id (PK)
   - user_id (FK to auth.users)
   - first_name
   - last_name
   - id_number
   - phone_number
   - email
   - date_of_birth
   - gender
   - marital_status
   - nationality
   - address
   - county
   - sub_county
   - village
   - landmark
   - employment_status
   - occupation
   - employer_name
   - employer_contact
   - monthly_income
   - bank_name
   - bank_branch
   - account_number
   - mpesa_number
   - kin_name
   - kin_relationship
   - kin_phone
   - kin_id_number
   - kin_address
   - created_at
   - updated_at

2. **loans**:
   - id (PK)
   - user_id (FK to auth.users)
   - amount
   - interest_rate
   - term
   - purpose
   - status
   - application_date
   - approval_date
   - disbursement_date
   - due_date
   - created_at
   - updated_at

3. **payments**:
   - id (PK)
   - loan_id (FK to loans)
   - amount
   - payment_date
   - payment_method
   - reference_number
   - status
   - created_at

4. **documents**:
   - id (PK)
   - user_id (FK to auth.users)
   - document_type
   - file_path
   - upload_date
   - verified
   - created_at
   - updated_at

## Deployment

The application can be deployed using:

1. **Lovable's Built-in Deployment**:
   - Click on Share -> Publish in the Lovable editor
   - Set up a custom domain if needed

2. **Manual Deployment**:
   - Build the app with `npm run build`
   - Deploy the `dist` folder to any static hosting service

### Production Considerations

1. **Authentication**: Ensure proper Supabase authentication is configured
2. **Environment Variables**: Set up required variables in your deployment platform
3. **Database**: Ensure proper RLS policies are in place for data security
4. **Analytics**: Consider adding analytics tracking for production
5. **Error Tracking**: Implement error logging solution for production monitoring

---

**Project URL**: https://lovable.dev/projects/774813e3-4be9-4c79-8791-a29d5d7ddfe9

Built with [Lovable](https://lovable.dev)

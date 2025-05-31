
// Mock data service for development and testing
// This would be replaced by actual API calls to Supabase in production

import { Loan, Payment, Profile } from '@/types/loan';

// Mock users
const mockUsers = [
  {
    id: '1',
    email: 'user@example.com',
    first_name: 'John',
    last_name: 'Doe',
  },
  {
    id: '2',
    email: 'admin@elaracapital.co.ke',
    first_name: 'Admin',
    last_name: 'User',
    is_admin: true,
  },
];

// Mock profiles
const mockProfiles: Profile[] = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'user@example.com',
    phone_number: '+254712345678',
    id_number: '12345678',
    date_of_birth: '1990-01-01',
    gender: 'male',
    marital_status: 'single',
    nationality: 'Kenyan',
    county: 'Nairobi',
    employment_status: 'employed',
    employer_name: 'ABC Company',
    monthly_income: 50000,
    mpesa_number: '+254712345678',
    kin_name: 'Jane Doe',
    kin_phone: '+254712345679',
    kin_relationship: 'spouse',
    id_document_url: '/mock-images/id-sample.jpg',
    selfie_url: '/mock-images/selfie-sample.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock loans
const mockLoans: Loan[] = [
  {
    id: '1',
    user_id: '1',
    amount: 100000,
    purpose: 'Business expansion',
    duration: 3,
    term_days: 90,
    interest_rate: 25,
    monthly_payment: 36667,
    processing_fee: 5000,
    total_amount: 130000,
    employment_status: 'employed',
    employer_name: 'ABC Company',
    monthly_income: 50000,
    county: 'Nairobi',
    mpesa_number: '+254712345678',
    phone_number: '+254712345678',
    kin_name: 'Jane Doe',
    kin_phone: '+254712345679',
    kin_relationship: 'spouse',
    status: 'pending',
    is_repaid: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock payments
const mockPayments: Payment[] = [
  {
    id: '1',
    loan_id: '1',
    user_id: '1',
    amount: 36667,
    payment_method: 'mpesa',
    status: 'completed',
    created_at: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    updated_at: new Date(new Date().setDate(new Date().getDate() - 29)).toISOString(),
  },
];

// Helper to generate UUID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Mock service functions
export const mockService = {
  // Authentication
  auth: {
    getUser: () => mockUsers[0],
    login: (email: string, password: string) => {
      // Handle admin login
      if (email === 'admin@elaracapital.co.ke' && password === 'admin123') {
        return mockUsers[1];
      }
      
      // Handle regular user login
      if (email === 'user@example.com' && password === 'password123') {
        return mockUsers[0];
      }
      
      return null;
    },
    register: (userData: any) => {
      const newUser = { id: generateId(), ...userData };
      mockUsers.push(newUser);
      return newUser;
    },
    isAdmin: (userId: string) => {
      const user = mockUsers.find(u => u.id === userId);
      return user?.is_admin || false;
    },
  },

  // Profiles
  profiles: {
    getProfile: (userId: string) => {
      return mockProfiles.find(p => p.id === userId) || null;
    },
    updateProfile: (userId: string, data: Partial<Profile>) => {
      const index = mockProfiles.findIndex(p => p.id === userId);
      if (index === -1) {
        const newProfile: Profile = {
          id: userId,
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phone_number: data.phone_number || '',
          id_number: data.id_number || '',
          date_of_birth: data.date_of_birth || '',
          gender: data.gender || 'male',
          marital_status: data.marital_status || 'single',
          nationality: data.nationality || '',
          county: data.county || '',
          employment_status: data.employment_status || '',
          employer_name: data.employer_name || '',
          monthly_income: data.monthly_income || 0,
          mpesa_number: data.mpesa_number || '',
          kin_name: data.kin_name || '',
          kin_phone: data.kin_phone || '',
          kin_relationship: data.kin_relationship || '',
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString(),
        };
        mockProfiles.push(newProfile);
        return newProfile;
      } else {
        mockProfiles[index] = { ...mockProfiles[index], ...data, updated_at: new Date().toISOString() };
        return mockProfiles[index];
      }
    },
  },

  // Loans
  loans: {
    getUserLoans: (userId: string) => {
      return mockLoans.filter(loan => loan.user_id === userId);
    },
    getAllLoans: () => mockLoans,
    getLoan: (loanId: string) => {
      return mockLoans.find(loan => loan.id === loanId) || null;
    },
    createLoan: (loanData: Omit<Loan, 'id' | 'created_at' | 'updated_at'>) => {
      const newLoan: Loan = {
        id: generateId(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...loanData,
      };
      mockLoans.push(newLoan);
      return newLoan;
    },
    updateLoan: (loanId: string, data: Partial<Loan>) => {
      const index = mockLoans.findIndex(loan => loan.id === loanId);
      if (index !== -1) {
        mockLoans[index] = { ...mockLoans[index], ...data, updated_at: new Date().toISOString() };
        return mockLoans[index];
      }
      return null;
    },
  },

  // Payments
  payments: {
    getLoanPayments: (loanId: string) => {
      return mockPayments.filter(payment => payment.loan_id === loanId);
    },
    createPayment: (paymentData: Omit<Payment, 'id'>) => {
      const newPayment: Payment = {
        id: generateId(),
        ...paymentData,
      };
      mockPayments.push(newPayment);
      return newPayment;
    },
  },
};

export default mockService;


// Mock data service for development and testing
// This would be replaced by actual API calls to Supabase in production

import { Loan, Payment, Profile, KYCProfile } from '@/types/loan';

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
    email: 'admin@example.com',
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
    created_at: new Date().toISOString(),
    phone_number: '+254712345678',
    id_number: '12345678',
    address: '123 Main St',
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
  },
];

// Mock loans
const mockLoans: Loan[] = [
  {
    id: '1',
    user_id: '1',
    amount: 100000,
    purpose: 'Business expansion',
    status: 'pending',
    term_days: 90,
    interest_rate: 25,
    monthly_payment: 36667,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    employment_status: 'employed',
    employer_name: 'ABC Company',
    monthly_income: 50000,
    county: 'Nairobi',
    mpesa_number: '+254712345678',
    next_of_kin_name: 'Jane Doe',
    next_of_kin_phone: '+254712345679',
    next_of_kin_relation: 'spouse',
    id_document_url: '/mock-images/id-sample.jpg',
    proof_of_income_url: '/mock-images/payslip-sample.pdf',
    selfie_url: '/mock-images/selfie-sample.jpg',
    other_documents_url: ['/mock-images/other-doc.pdf'],
  },
];

// Mock payments
const mockPayments: Payment[] = [
  {
    id: '1',
    loan_id: '1',
    amount: 36667,
    status: 'completed',
    due_date: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    payment_date: new Date(new Date().setDate(new Date().getDate() - 29)).toISOString(),
    payment_method: 'mpesa',
    transaction_id: 'MPESA123456',
  },
];

// Mock KYC profiles
const mockKycProfiles: KYCProfile[] = [
  {
    id: '1',
    user_id: '1',
    status: 'approved',
    submitted_at: new Date(new Date().setDate(new Date().getDate() - 35)).toISOString(),
    reviewed_at: new Date(new Date().setDate(new Date().getDate() - 34)).toISOString(),
    reviewed_by: '2',
    national_id_number: '12345678',
    date_of_birth: '1990-01-01',
    address: '123 Main St',
    city: 'Nairobi',
    state: 'Nairobi',
    zip_code: '00100',
    phone_number: '+254712345678',
    employment_status: 'employed',
    employer_name: 'ABC Company',
    monthly_income: 50000,
    purpose_of_loan: 'Business expansion',
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
      const user = mockUsers.find(u => u.email === email);
      return user || null;
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
        const newProfile = {
          id: userId,
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          created_at: new Date().toISOString(),
          ...data,
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

  // KYC
  kyc: {
    getKycProfile: (userId: string) => {
      return mockKycProfiles.find(profile => profile.user_id === userId) || null;
    },
    createKycProfile: (kycData: Omit<KYCProfile, 'id'>) => {
      const newProfile: KYCProfile = {
        id: generateId(),
        ...kycData,
      };
      mockKycProfiles.push(newProfile);
      return newProfile;
    },
    updateKycStatus: (kycId: string, status: 'pending' | 'approved' | 'rejected', reason?: string) => {
      const index = mockKycProfiles.findIndex(profile => profile.id === kycId);
      if (index !== -1) {
        mockKycProfiles[index] = {
          ...mockKycProfiles[index],
          status,
          rejection_reason: reason,
          reviewed_at: new Date().toISOString(),
        };
        return mockKycProfiles[index];
      }
      return null;
    },
  },
};

export default mockService;

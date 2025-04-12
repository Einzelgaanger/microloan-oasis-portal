
// Mock data and service functions for development use

export interface Profile {
  id: string;
  user_id: string;
  avatar_url?: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  city: string;
  zip_code: string;
  
  // Additional Kenyan-specific fields
  id_number?: string;
  date_of_birth?: string;
  gender?: string;
  marital_status?: string;
  nationality?: string;
  id_document_url?: string;
  selfie_photo_url?: string;
  
  // Contact & Residential Information
  county?: string;
  sub_county?: string;
  village?: string;
  landmark?: string;
  permanent_address?: string;
  alternative_phone?: string;
  email?: string;
  years_at_address?: string;
  
  // Employment & Income Details
  employment_status?: string;
  occupation?: string;
  employer_name?: string;
  employer_contact?: string;
  monthly_income?: number;
  secondary_income?: string;
  pay_frequency?: string;
  work_location?: string;
  payslip_document_url?: string;
  
  // Banking & Mobile Money Details
  bank_name?: string;
  bank_branch?: string;
  account_number?: string;
  mpesa_number?: string;
  statements_document_url?: string;
  preferred_disbursement?: string;
  
  // Credit History & Loan Behavior
  previous_loans?: string;
  outstanding_loans?: string;
  credit_score_consent?: boolean;
  purpose_of_loan?: string;
  requested_amount?: string;
  repayment_period?: string;
  repayment_channel?: string;
  
  // Next of Kin / Guarantor Details
  kin_name?: string;
  kin_relationship?: string;
  kin_phone?: string;
  kin_id_number?: string;
  kin_address?: string;
  guarantor_consent?: boolean;
  
  // Digital Footprint
  smartphone_ownership?: string;
  social_media_handles?: string;
  app_permissions_consent?: boolean;
  
  // Legal & Compliance
  kyc_consent?: boolean;
  terms_agreement?: boolean;
  data_usage_consent?: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
}

export interface Loan {
  id: string;
  user_id: string;
  amount: number;
  purpose: string;
  duration: number;
  interest_rate: number;
  monthly_payment: number;
  employment_status: string;
  employer_name: string;
  monthly_income: number;
  
  // KYC Documents
  id_document_url: string;
  proof_of_income_url: string;
  selfie_url: string;
  other_documents_url?: string;
  
  // Additional loan fields
  county?: string;
  mpesa_number?: string;
  next_of_kin_name?: string;
  next_of_kin_phone?: string;
  next_of_kin_relation?: string;
  
  status: "pending" | "approved" | "rejected";
  approved_at?: string;
  rejected_at?: string;
  rejected_reason?: string;
  is_repaid: boolean;
  
  created_at: string;
  updated_at: string;
}

// Add Payment interface
export interface Payment {
  id: string;
  user_id: string;
  loan_id: string;
  amount: number;
  payment_date: string;
  status: "pending" | "completed" | "failed";
  transaction_id: string;
  payment_method: string;
}

// Mock profiles
const mockProfiles: Profile[] = [
  {
    id: "profile1",
    user_id: "user1",
    first_name: "John",
    last_name: "Kamau",
    phone_number: "+254722000001",
    address: "Moi Avenue",
    city: "Nairobi",
    zip_code: "00100",
    id_number: "12345678",
    nationality: "Kenyan",
    county: "Nairobi",
    sub_county: "Westlands",
    village: "Parklands",
    employment_status: "employed",
    employer_name: "Safaricom PLC",
    monthly_income: 70000,
    bank_name: "Equity Bank",
    mpesa_number: "+254722000001",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "profile2",
    user_id: "user2",
    first_name: "Mary",
    last_name: "Wanjiku",
    phone_number: "+254722000002",
    address: "Ngong Road",
    city: "Nairobi",
    zip_code: "00200",
    id_number: "23456789",
    nationality: "Kenyan",
    county: "Nairobi",
    sub_county: "Kibra",
    village: "Kibera",
    employment_status: "self-employed",
    employer_name: "Own Business",
    monthly_income: 45000,
    bank_name: "KCB",
    mpesa_number: "+254722000002",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Mock user roles
const mockUserRoles: UserRole[] = [
  {
    id: "1",
    user_id: "1",
    role: "user"
  },
  {
    id: "2",
    user_id: "2",
    role: "user"
  },
  {
    id: "3",
    user_id: "admin",
    role: "admin"
  }
];

// Mock loans
const mockLoans: Loan[] = [
  {
    id: "loan1",
    user_id: "user1",
    amount: 20000,
    purpose: "Business expansion",
    duration: 3,
    interest_rate: 15,
    monthly_payment: 7189,
    employment_status: "employed",
    employer_name: "Safaricom PLC",
    monthly_income: 70000,
    id_document_url: "/mock-documents/id-doc1.jpg",
    proof_of_income_url: "/mock-documents/income-proof1.pdf",
    selfie_url: "/mock-documents/selfie1.jpg",
    mpesa_number: "+254722000001",
    county: "Nairobi",
    next_of_kin_name: "Jane Kamau",
    next_of_kin_phone: "+254722000003",
    next_of_kin_relation: "Spouse",
    status: "approved",
    approved_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    is_repaid: false,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "loan2",
    user_id: "user1",
    amount: 5000,
    purpose: "Medical emergency",
    duration: 1,
    interest_rate: 10,
    monthly_payment: 5083,
    employment_status: "employed",
    employer_name: "Safaricom PLC",
    monthly_income: 70000,
    id_document_url: "/mock-documents/id-doc1.jpg",
    proof_of_income_url: "/mock-documents/income-proof1.pdf",
    selfie_url: "/mock-documents/selfie1.jpg",
    mpesa_number: "+254722000001",
    county: "Nairobi",
    status: "rejected",
    rejected_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    rejected_reason: "Incomplete documentation",
    is_repaid: false,
    created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "loan3",
    user_id: "user2",
    amount: 15000,
    purpose: "School fees",
    duration: 3,
    interest_rate: 12,
    monthly_payment: 5270,
    employment_status: "self-employed",
    employer_name: "Own Business",
    monthly_income: 45000,
    id_document_url: "/mock-documents/id-doc2.jpg",
    proof_of_income_url: "/mock-documents/income-proof2.pdf",
    selfie_url: "/mock-documents/selfie2.jpg",
    mpesa_number: "+254722000002",
    county: "Nairobi",
    status: "pending",
    is_repaid: false,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Mock payments
const mockPayments: Payment[] = [
  {
    id: "1",
    user_id: "1",
    loan_id: "1",
    amount: 428.04,
    payment_date: "2025-02-10T09:30:00Z",
    status: "completed",
    transaction_id: "tx_123456",
    payment_method: "credit_card"
  },
  {
    id: "2",
    user_id: "1",
    loan_id: "1",
    amount: 428.04,
    payment_date: "2025-03-10T10:15:00Z",
    status: "completed",
    transaction_id: "tx_234567",
    payment_method: "bank_transfer"
  }
];

// Local storage keys
const STORAGE_KEYS = {
  PROFILES: 'microloan_profiles',
  USER_ROLES: 'microloan_user_roles',
  LOANS: 'microloan_loans',
  PAYMENTS: 'microloan_payments',
  CURRENT_USER: 'microloan_current_user'
};

// Initialize local storage with mock data
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(mockProfiles));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.USER_ROLES)) {
    localStorage.setItem(STORAGE_KEYS.USER_ROLES, JSON.stringify(mockUserRoles));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.LOANS)) {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(mockLoans));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(mockPayments));
  }
};

// Initialize storage on load
initializeStorage();

// Get data from local storage
const getDataFromStorage = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Save data to local storage
const saveDataToStorage = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Mock service functions for profiles
export const profileService = {
  getProfile: (userId: string): Promise<Profile | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const profiles = getDataFromStorage<Profile>(STORAGE_KEYS.PROFILES);
        const profile = profiles.find(p => p.user_id === userId || p.id === userId);
        resolve(profile || null);
      }, 300);
    });
  },
  
  updateProfile: (userId: string, data: Partial<Profile>): Promise<Profile> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const profiles = getDataFromStorage<Profile>(STORAGE_KEYS.PROFILES);
        const index = profiles.findIndex(p => p.user_id === userId || p.id === userId);
        
        if (index >= 0) {
          profiles[index] = { ...profiles[index], ...data, updated_at: new Date().toISOString() };
        } else {
          profiles.push({ 
            id: userId, 
            user_id: userId, 
            first_name: '', 
            last_name: '', 
            phone_number: '', 
            address: '', 
            city: '', 
            zip_code: '', 
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...data 
          });
        }
        
        saveDataToStorage(STORAGE_KEYS.PROFILES, profiles);
        resolve(profiles[index >= 0 ? index : profiles.length - 1]);
      }, 300);
    });
  }
};

// Mock service functions for user roles
export const roleService = {
  getUserRole: (userId: string): Promise<UserRole | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const roles = getDataFromStorage<UserRole>(STORAGE_KEYS.USER_ROLES);
        const role = roles.find(r => r.user_id === userId);
        resolve(role || null);
      }, 300);
    });
  },
  
  isAdmin: (userId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const roles = getDataFromStorage<UserRole>(STORAGE_KEYS.USER_ROLES);
        const role = roles.find(r => r.user_id === userId && r.role === 'admin');
        resolve(!!role);
      }, 300);
    });
  }
};

// Mock service functions for loans
export const loanService = {
  getUserLoans: (userId: string): Promise<Loan[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const loans = getDataFromStorage<Loan>(STORAGE_KEYS.LOANS);
        resolve(loans.filter(loan => loan.user_id === userId));
      }, 300);
    });
  },
  
  getAllLoans: (): Promise<Loan[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const loans = getDataFromStorage<Loan>(STORAGE_KEYS.LOANS);
        resolve(loans);
      }, 300);
    });
  },
  
  createLoan: (loanData: Omit<Loan, 'id' | 'created_at' | 'updated_at'>): Promise<Loan> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const loans = getDataFromStorage<Loan>(STORAGE_KEYS.LOANS);
        const newLoan: Loan = {
          ...loanData,
          id: `loan_${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        loans.push(newLoan);
        saveDataToStorage(STORAGE_KEYS.LOANS, loans);
        resolve(newLoan);
      }, 300);
    });
  },
  
  updateLoan: (loanId: string, data: Partial<Loan>): Promise<Loan> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const loans = getDataFromStorage<Loan>(STORAGE_KEYS.LOANS);
        const index = loans.findIndex(loan => loan.id === loanId);
        
        if (index >= 0) {
          loans[index] = { 
            ...loans[index], 
            ...data,
            updated_at: new Date().toISOString() 
          };
          saveDataToStorage(STORAGE_KEYS.LOANS, loans);
          resolve(loans[index]);
        } else {
          throw new Error('Loan not found');
        }
      }, 300);
    });
  }
};

// Mock service functions for payments
export const paymentService = {
  getLoanPayments: (loanId: string): Promise<Payment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const payments = getDataFromStorage<Payment>(STORAGE_KEYS.PAYMENTS);
        resolve(payments.filter(payment => payment.loan_id === loanId));
      }, 300);
    });
  },
  
  createPayment: (paymentData: Omit<Payment, 'id'>): Promise<Payment> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const payments = getDataFromStorage<Payment>(STORAGE_KEYS.PAYMENTS);
        const newPayment: Payment = {
          ...paymentData,
          id: `payment_${Date.now()}`
        };
        
        payments.push(newPayment);
        saveDataToStorage(STORAGE_KEYS.PAYMENTS, payments);
        resolve(newPayment);
      }, 300);
    });
  }
};

// Mock authentication service
export const mockAuthService = {
  signIn: async (email: string, password: string) => {
    console.log('Mock Auth: signIn', email, password);
    
    // For development, allow any credentials
    return {
      id: 'user1',
      email: email || 'john.kamau@example.com'
    };
  },
  
  signUp: async (email: string, password: string, userData: any) => {
    console.log('Mock Auth: signUp', email, password, userData);
    
    // Create a new mock user
    return {
      id: 'new-user-' + Date.now(),
      email: email || 'new.user@example.com'
    };
  },
  
  signOut: async () => {
    console.log('Mock Auth: signOut');
    return true;
  },
  
  getSession: async () => {
    console.log('Mock Auth: getSession');
    
    // For development, always return a session
    return { 
      user: {
        id: 'user1',
        email: 'john.kamau@example.com'
      }
    };
  }
};

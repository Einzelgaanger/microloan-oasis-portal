
// Mock data and service functions for development use

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  address?: string;
  city?: string;
  zip_code?: string;
  avatar_url?: string;
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
  employer_name?: string;
  monthly_income: number;
  id_document_url?: string;
  proof_of_income_url?: string;
  selfie_url?: string;
  other_documents_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_at?: string;
  rejected_at?: string;
  rejected_reason?: string;
  created_at: string;
  updated_at: string;
  is_repaid: boolean;
}

export interface Payment {
  id: string;
  user_id: string;
  loan_id: string;
  amount: number;
  payment_date: string;
  status: 'pending' | 'completed' | 'failed';
  transaction_id?: string;
  payment_method: string;
}

// Mock profiles
const mockProfiles: Profile[] = [
  {
    id: "1",
    first_name: "John",
    last_name: "Doe",
    phone_number: "+1234567890",
    address: "123 Main St",
    city: "New York",
    zip_code: "10001",
    avatar_url: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    id: "2",
    first_name: "Jane",
    last_name: "Smith",
    phone_number: "+0987654321",
    address: "456 Park Ave",
    city: "Los Angeles",
    zip_code: "90001",
    avatar_url: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: "admin",
    first_name: "Admin",
    last_name: "User",
    phone_number: "+1122334455",
    address: "789 Admin St",
    city: "Chicago",
    zip_code: "60001",
    avatar_url: "https://randomuser.me/api/portraits/men/10.jpg"
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
    id: "1",
    user_id: "1",
    amount: 5000,
    purpose: "Home Improvement",
    duration: 12,
    interest_rate: 5,
    monthly_payment: 428.04,
    employment_status: "Employed",
    employer_name: "Tech Corp",
    monthly_income: 5000,
    id_document_url: "/documents/id1.pdf",
    proof_of_income_url: "/documents/income1.pdf",
    selfie_url: "/documents/selfie1.jpg",
    status: "approved",
    approved_at: "2025-01-15T10:00:00Z",
    created_at: "2025-01-10T08:30:00Z",
    updated_at: "2025-01-15T10:00:00Z",
    is_repaid: false
  },
  {
    id: "2",
    user_id: "1",
    amount: 2000,
    purpose: "Education",
    duration: 6,
    interest_rate: 4,
    monthly_payment: 339.93,
    employment_status: "Employed",
    employer_name: "Tech Corp",
    monthly_income: 5000,
    id_document_url: "/documents/id1.pdf",
    proof_of_income_url: "/documents/income1.pdf",
    selfie_url: "/documents/selfie1.jpg",
    status: "pending",
    created_at: "2025-03-05T14:20:00Z",
    updated_at: "2025-03-05T14:20:00Z",
    is_repaid: false
  },
  {
    id: "3",
    user_id: "2",
    amount: 10000,
    purpose: "Business",
    duration: 24,
    interest_rate: 6,
    monthly_payment: 443.20,
    employment_status: "Self-employed",
    monthly_income: 8000,
    id_document_url: "/documents/id2.pdf",
    proof_of_income_url: "/documents/income2.pdf",
    selfie_url: "/documents/selfie2.jpg",
    status: "rejected",
    rejected_at: "2025-02-20T16:45:00Z",
    rejected_reason: "Insufficient income documentation",
    created_at: "2025-02-15T11:10:00Z",
    updated_at: "2025-02-20T16:45:00Z",
    is_repaid: false
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
        const profile = profiles.find(p => p.id === userId);
        resolve(profile || null);
      }, 300);
    });
  },
  
  updateProfile: (userId: string, data: Partial<Profile>): Promise<Profile> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const profiles = getDataFromStorage<Profile>(STORAGE_KEYS.PROFILES);
        const index = profiles.findIndex(p => p.id === userId);
        
        if (index >= 0) {
          profiles[index] = { ...profiles[index], ...data };
        } else {
          profiles.push({ id: userId, first_name: '', last_name: '', ...data });
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
  currentUser: null as { id: string; email: string } | null,
  
  signIn: (email: string, password: string): Promise<{ id: string; email: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // For demo, allow any email/password combination
        // In a real app, this would validate credentials
        let userId = "1"; // Default to first mock user
        
        // Check if it's the admin email
        if (email.toLowerCase().includes('admin')) {
          userId = "admin";
        } else if (email.toLowerCase().includes('jane') || email.toLowerCase().includes('smith')) {
          userId = "2";
        }
        
        const user = { id: userId, email };
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        mockAuthService.currentUser = user;
        resolve(user);
      }, 500);
    });
  },
  
  signUp: (email: string, password: string, userData: any): Promise<{ id: string; email: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // For demo, simulate successful signup
        const userId = `user_${Date.now()}`;
        const user = { id: userId, email };
        
        // Create a profile for the new user
        const profiles = getDataFromStorage<Profile>(STORAGE_KEYS.PROFILES);
        const newProfile: Profile = {
          id: userId,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
        };
        profiles.push(newProfile);
        saveDataToStorage(STORAGE_KEYS.PROFILES, profiles);
        
        // Assign user role
        const roles = getDataFromStorage<UserRole>(STORAGE_KEYS.USER_ROLES);
        const newRole: UserRole = {
          id: `role_${Date.now()}`,
          user_id: userId,
          role: 'user'
        };
        roles.push(newRole);
        saveDataToStorage(STORAGE_KEYS.USER_ROLES, roles);
        
        // Set as current user
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        mockAuthService.currentUser = user;
        resolve(user);
      }, 500);
    });
  },
  
  signOut: (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        mockAuthService.currentUser = null;
        resolve();
      }, 300);
    });
  },
  
  getSession: (): Promise<{ user: { id: string; email: string } | null }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        const user = userJson ? JSON.parse(userJson) : null;
        mockAuthService.currentUser = user;
        resolve({ user });
      }, 300);
    });
  }
};

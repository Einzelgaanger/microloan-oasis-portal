import { supabase } from '@/integrations/supabase/client';
import {
  Profile,
  Loan,
  Payment,
  profileService,
  loanService,
  paymentService,
  roleService,
  mockAuthService
} from './mockDataService';

// Helper to determine if we should use mock data
// Always use mock data until Supabase is properly configured
const useMockData = () => {
  return true; // Always use mock data for development
};

// Auth service
export const authService = useMockData() ? mockAuthService : {
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  },
  
  signUp: async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: userData }
    });
    if (error) throw error;
    return data.user;
  },
  
  signOut: async () => {
    await supabase.auth.signOut();
  },
  
  getSession: async () => {
    const { data } = await supabase.auth.getSession();
    return { user: data.session?.user || null };
  }
};

// Since we're using mock data, we don't need to worry about the TypeScript errors
// from Supabase client, as that code path is never executed
export const dataService = {
  profiles: profileService,
  roles: roleService,
  loans: loanService,
  payments: paymentService
};

/* 
 * The code below would be used once we have proper Supabase tables set up,
 * but for now we're using the mock services above.
 *
 * This avoids TypeScript errors because we're not actually using the Supabase client
 * with these table names yet.

export const dataService = {
  profiles: useMockData() ? profileService : {
    getProfile: async (userId: string) => {
      // Supabase implementation
    },
    
    updateProfile: async (userId: string, profileData: Partial<Profile>) => {
      // Supabase implementation
    }
  },
  
  roles: useMockData() ? roleService : {
    getUserRole: async (userId: string) => {
      // Supabase implementation
    },
    
    isAdmin: async (userId: string) => {
      // Supabase implementation
    }
  },
  
  loans: useMockData() ? loanService : {
    getUserLoans: async (userId: string) => {
      // Supabase implementation
    },
    
    getAllLoans: async () => {
      // Supabase implementation
    },
    
    createLoan: async (loanData: Omit<Loan, 'id' | 'created_at' | 'updated_at'>) => {
      // Supabase implementation
    },
    
    updateLoan: async (loanId: string, loanData: Partial<Loan>) => {
      // Supabase implementation
    }
  },
  
  payments: useMockData() ? paymentService : {
    getLoanPayments: async (loanId: string) => {
      // Supabase implementation
    },
    
    createPayment: async (paymentData: Omit<Payment, 'id'>) => {
      // Supabase implementation
    }
  }
};
*/

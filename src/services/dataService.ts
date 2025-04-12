

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

// Data services - always use mock data for now
export const dataService = {
  profiles: useMockData() ? profileService : {
    getProfile: async (userId: string) => {
      console.log('Using real database for profiles.getProfile');
      return null;
    },
    
    updateProfile: async (userId: string, profileData: Partial<Profile>) => {
      console.log('Using real database for profiles.updateProfile');
      throw new Error('Supabase not configured');
    }
  },
  
  roles: useMockData() ? roleService : {
    getUserRole: async (userId: string) => {
      console.log('Using real database for roles.getUserRole');
      return null;
    },
    
    isAdmin: async (userId: string) => {
      console.log('Using real database for roles.isAdmin');
      return false;
    }
  },
  
  loans: useMockData() ? loanService : {
    getUserLoans: async (userId: string) => {
      console.log('Using real database for loans.getUserLoans');
      return [];
    },
    
    getAllLoans: async () => {
      console.log('Using real database for loans.getAllLoans');
      return [];
    },
    
    createLoan: async (loanData: Omit<Loan, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Using real database for loans.createLoan');
      throw new Error('Supabase not configured');
    },
    
    updateLoan: async (loanId: string, loanData: Partial<Loan>) => {
      console.log('Using real database for loans.updateLoan');
      throw new Error('Supabase not configured');
    }
  },
  
  payments: useMockData() ? paymentService : {
    getLoanPayments: async (loanId: string) => {
      console.log('Using real database for payments.getLoanPayments');
      return [];
    },
    
    createPayment: async (paymentData: Omit<Payment, 'id'>) => {
      console.log('Using real database for payments.createPayment');
      throw new Error('Supabase not configured');
    }
  }
};


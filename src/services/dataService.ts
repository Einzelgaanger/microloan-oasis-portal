
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
      // This code will not run because useMockData() is true
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    },
    
    updateProfile: async (userId: string, profileData: Partial<Profile>) => {
      console.log('Using real database for profiles.updateProfile');
      // This code will not run because useMockData() is true
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },
  
  roles: useMockData() ? roleService : {
    getUserRole: async (userId: string) => {
      console.log('Using real database for roles.getUserRole');
      // This code will not run because useMockData() is true
      const { data, error } = await supabase
        .from('user_roles')
        .select()
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      return data;
    },
    
    isAdmin: async (userId: string) => {
      console.log('Using real database for roles.isAdmin');
      // This code will not run because useMockData() is true
      const { data, error } = await supabase
        .from('user_roles')
        .select()
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();
      
      if (error) return false;
      return !!data;
    }
  },
  
  loans: useMockData() ? loanService : {
    getUserLoans: async (userId: string) => {
      console.log('Using real database for loans.getUserLoans');
      // This code will not run because useMockData() is true
      const { data, error } = await supabase
        .from('loans')
        .select()
        .eq('user_id', userId);
      
      if (error) throw error;
      return data || [];
    },
    
    getAllLoans: async () => {
      console.log('Using real database for loans.getAllLoans');
      // This code will not run because useMockData() is true
      const { data, error } = await supabase
        .from('loans')
        .select();
      
      if (error) throw error;
      return data || [];
    },
    
    createLoan: async (loanData: Omit<Loan, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Using real database for loans.createLoan');
      // This code will not run because useMockData() is true
      const { data, error } = await supabase
        .from('loans')
        .insert(loanData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    
    updateLoan: async (loanId: string, loanData: Partial<Loan>) => {
      console.log('Using real database for loans.updateLoan');
      // This code will not run because useMockData() is true
      const { data, error } = await supabase
        .from('loans')
        .update(loanData)
        .eq('id', loanId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },
  
  payments: useMockData() ? paymentService : {
    getLoanPayments: async (loanId: string) => {
      console.log('Using real database for payments.getLoanPayments');
      // This code will not run because useMockData() is true
      const { data, error } = await supabase
        .from('payments')
        .select()
        .eq('loan_id', loanId);
      
      if (error) throw error;
      return data || [];
    },
    
    createPayment: async (paymentData: Omit<Payment, 'id'>) => {
      console.log('Using real database for payments.createPayment');
      // This code will not run because useMockData() is true
      const { data, error } = await supabase
        .from('payments')
        .insert(paymentData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  }
};

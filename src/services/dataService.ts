
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
// For now, always use mock data for development
const useMockData = () => {
  return true; // Change this when ready to use real database
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

// Data services - when using mock data, we bypass Supabase calls entirely
export const dataService = {
  profiles: useMockData() ? profileService : {
    getProfile: async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) throw error;
        return data as Profile | null;
      } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
    },
    
    updateProfile: async (userId: string, profileData: Partial<Profile>) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', userId)
          .select()
          .single();
        
        if (error) throw error;
        return data as Profile;
      } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
    }
  },
  
  roles: useMockData() ? roleService : {
    getUserRole: async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
      } catch (error) {
        console.error('Error fetching user role:', error);
        return null;
      }
    },
    
    isAdmin: async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .eq('role', 'admin')
          .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return !!data;
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
    }
  },
  
  loans: useMockData() ? loanService : {
    getUserLoans: async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('loans')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as Loan[];
      } catch (error) {
        console.error('Error fetching user loans:', error);
        return [];
      }
    },
    
    getAllLoans: async () => {
      try {
        const { data, error } = await supabase
          .from('loans')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as Loan[];
      } catch (error) {
        console.error('Error fetching all loans:', error);
        return [];
      }
    },
    
    createLoan: async (loanData: Omit<Loan, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const { data, error } = await supabase
          .from('loans')
          .insert(loanData)
          .select()
          .single();
        
        if (error) throw error;
        return data as Loan;
      } catch (error) {
        console.error('Error creating loan:', error);
        throw error;
      }
    },
    
    updateLoan: async (loanId: string, loanData: Partial<Loan>) => {
      try {
        const { data, error } = await supabase
          .from('loans')
          .update(loanData)
          .eq('id', loanId)
          .select()
          .single();
        
        if (error) throw error;
        return data as Loan;
      } catch (error) {
        console.error('Error updating loan:', error);
        throw error;
      }
    }
  },
  
  payments: useMockData() ? paymentService : {
    getLoanPayments: async (loanId: string) => {
      try {
        const { data, error } = await supabase
          .from('payments')
          .select('*')
          .eq('loan_id', loanId);
        
        if (error) throw error;
        return data as Payment[];
      } catch (error) {
        console.error('Error fetching loan payments:', error);
        return [];
      }
    },
    
    createPayment: async (paymentData: Omit<Payment, 'id'>) => {
      try {
        const { data, error } = await supabase
          .from('payments')
          .insert(paymentData)
          .select()
          .single();
        
        if (error) throw error;
        return data as Payment;
      } catch (error) {
        console.error('Error creating payment:', error);
        throw error;
      }
    }
  }
};

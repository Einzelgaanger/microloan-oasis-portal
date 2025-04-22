
// Mocked data service for demonstration purposes
// In a real application, this would be replaced by actual API calls to Supabase

import { supabase } from '@/integrations/supabase/client';

// Auth service for handling authentication
export const authService = {
  // Get the current session
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data;
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.user;
  },

  // Sign up with email and password
  signUp: async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    if (error) throw error;
    return data.user;
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};

// Data service for handling data operations
export const dataService = {
  // Loan related operations
  loans: {
    // Get all loans (for admin)
    getAllLoans: async () => {
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },

    // Get user loans
    getUserLoans: async (userId: string) => {
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },

    // Create a loan application
    createLoan: async (loanData: any) => {
      const { data, error } = await supabase
        .from('loans')
        .insert([loanData])
        .select();
      
      if (error) throw error;
      return data[0];
    },

    // Update a loan
    updateLoan: async (loanId: string, updateData: any) => {
      const { data, error } = await supabase
        .from('loans')
        .update(updateData)
        .eq('id', loanId)
        .select();
      
      if (error) throw error;
      return data[0];
    },

    // Get loan details
    getLoan: async (loanId: string) => {
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .eq('id', loanId)
        .single();
      
      if (error) throw error;
      return data;
    },
  },

  // Profile related operations
  profiles: {
    // Get user profile
    getProfile: async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        // Return default profile if not found
        return {
          id: userId,
          first_name: '',
          last_name: '',
        };
      }
      
      return data;
    },

    // Update user profile
    updateProfile: async (userId: string, profileData: any) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId)
        .select();
      
      if (error) throw error;
      return data[0];
    },
  },

  // KYC related operations
  kyc: {
    // Create KYC profile
    createKycProfile: async (kycData: any) => {
      const { data, error } = await supabase
        .from('kyc_profiles')
        .insert([kycData])
        .select();
      
      if (error) throw error;
      return data[0];
    },

    // Get KYC profile for a user
    getKycProfile: async (userId: string) => {
      const { data, error } = await supabase
        .from('kyc_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // Not found is okay
      return data;
    },

    // Update KYC profile status
    updateKycStatus: async (kycId: string, status: 'pending' | 'approved' | 'rejected', reason?: string) => {
      const { data, error } = await supabase
        .from('kyc_profiles')
        .update({
          status,
          rejection_reason: reason || null,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', kycId)
        .select();
      
      if (error) throw error;
      return data[0];
    },
  },

  // Role related operations
  roles: {
    // Check if user is admin
    isAdmin: async (userId: string) => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }
      
      return !!data;
    },

    // Get user roles
    getUserRoles: async (userId: string) => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data.map(item => item.role);
    },
  },

  // Payment related operations
  payments: {
    // Get loan payments
    getLoanPayments: async (loanId: string) => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('loan_id', loanId)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  },
};

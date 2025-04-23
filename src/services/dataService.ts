
// Data service for handling data operations
// Currently using mock data, will be replaced with Supabase in production

import { supabase } from '@/integrations/supabase/client';
import mockService from './mockDataService';

// Auth service for handling authentication
export const authService = {
  // Get the current session
  getSession: async () => {
    try {
      // Use Supabase when connected
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting session:', error);
      // Fallback to mock data for development
      return {
        session: {
          user: mockService.auth.getUser()
        }
      };
    }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    try {
      // Use Supabase when connected
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data.user;
    } catch (error) {
      console.error('Sign in error:', error);
      // Fallback to mock data for development
      const user = mockService.auth.login(email, password);
      if (!user) throw new Error('Invalid email or password');
      return user;
    }
  },

  // Sign up with email and password
  signUp: async (email: string, password: string, userData: any) => {
    try {
      // Use Supabase when connected
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      if (error) throw error;
      return data.user;
    } catch (error) {
      console.error('Sign up error:', error);
      // Fallback to mock data for development
      return mockService.auth.register({ email, ...userData });
    }
  },

  // Sign out
  signOut: async () => {
    try {
      // Use Supabase when connected
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      // No fallback needed for sign out
    }
  },
};

// Data service for handling data operations
export const dataService = {
  // Loan related operations
  loans: {
    // Get all loans (for admin)
    getAllLoans: async () => {
      try {
        // Use Supabase when connected
        const { data, error } = await supabase
          .from('loans')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching all loans:', error);
        // Fallback to mock data for development
        return mockService.loans.getAllLoans();
      }
    },

    // Get user loans
    getUserLoans: async (userId: string) => {
      try {
        // Use Supabase when connected
        const { data, error } = await supabase
          .from('loans')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching user loans:', error);
        // Fallback to mock data for development
        return mockService.loans.getUserLoans(userId);
      }
    },

    // Create a loan application
    createLoan: async (loanData: any) => {
      try {
        // Use Supabase when connected
        const { data, error } = await supabase
          .from('loans')
          .insert([loanData])
          .select();
        
        if (error) throw error;
        return data[0];
      } catch (error) {
        console.error('Error creating loan:', error);
        // Fallback to mock data for development
        return mockService.loans.createLoan(loanData);
      }
    },

    // Update a loan
    updateLoan: async (loanId: string, updateData: any) => {
      try {
        // Use Supabase when connected
        const { data, error } = await supabase
          .from('loans')
          .update(updateData)
          .eq('id', loanId)
          .select();
        
        if (error) throw error;
        return data[0];
      } catch (error) {
        console.error('Error updating loan:', error);
        // Fallback to mock data for development
        return mockService.loans.updateLoan(loanId, updateData);
      }
    },

    // Get loan details
    getLoan: async (loanId: string) => {
      try {
        // Use Supabase when connected
        const { data, error } = await supabase
          .from('loans')
          .select('*')
          .eq('id', loanId)
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching loan:', error);
        // Fallback to mock data for development
        return mockService.loans.getLoan(loanId);
      }
    },
  },

  // Profile related operations
  profiles: {
    // Get user profile
    getProfile: async (userId: string) => {
      try {
        // Use Supabase when connected
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
            created_at: new Date().toISOString()
          };
        }
        
        return data;
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Fallback to mock data for development
        return mockService.profiles.getProfile(userId);
      }
    },

    // Update user profile
    updateProfile: async (userId: string, profileData: any) => {
      try {
        // Use Supabase when connected
        const { data, error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', userId)
          .select();
        
        if (error) throw error;
        return data[0];
      } catch (error) {
        console.error('Error updating profile:', error);
        // Fallback to mock data for development
        return mockService.profiles.updateProfile(userId, profileData);
      }
    },
  },

  // KYC related operations
  kyc: {
    // Create KYC profile
    createKycProfile: async (kycData: any) => {
      try {
        // Use Supabase when connected
        const { data, error } = await supabase
          .from('kyc_profiles')
          .insert([kycData])
          .select();
        
        if (error) throw error;
        return data[0];
      } catch (error) {
        console.error('Error creating KYC profile:', error);
        // Fallback to mock data for development
        return mockService.kyc.createKycProfile(kycData);
      }
    },

    // Get KYC profile for a user
    getKycProfile: async (userId: string) => {
      try {
        // Use Supabase when connected
        const { data, error } = await supabase
          .from('kyc_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (error && error.code !== 'PGRST116') throw error; // Not found is okay
        return data;
      } catch (error) {
        console.error('Error fetching KYC profile:', error);
        // Fallback to mock data for development
        return mockService.kyc.getKycProfile(userId);
      }
    },

    // Update KYC profile status
    updateKycStatus: async (kycId: string, status: 'pending' | 'approved' | 'rejected', reason?: string) => {
      try {
        // Use Supabase when connected
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
      } catch (error) {
        console.error('Error updating KYC status:', error);
        // Fallback to mock data for development
        return mockService.kyc.updateKycStatus(kycId, status, reason);
      }
    },
  },

  // Role related operations
  roles: {
    // Check if user is admin
    isAdmin: async (userId: string) => {
      try {
        // Use Supabase when connected
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
      } catch (error) {
        console.error('Error checking admin role:', error);
        // Fallback to mock data for development
        return mockService.auth.isAdmin(userId);
      }
    },

    // Get user roles
    getUserRoles: async (userId: string) => {
      try {
        // Use Supabase when connected
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId);
        
        if (error) throw error;
        return data.map(item => item.role);
      } catch (error) {
        console.error('Error fetching user roles:', error);
        // Fallback to mock data for development
        return mockService.auth.isAdmin(userId) ? ['admin'] : ['user'];
      }
    },
  },

  // Payment related operations
  payments: {
    // Get loan payments
    getLoanPayments: async (loanId: string) => {
      try {
        // Use Supabase when connected
        const { data, error } = await supabase
          .from('payments')
          .select('*')
          .eq('loan_id', loanId)
          .order('due_date', { ascending: true });
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching payments:', error);
        // Fallback to mock data for development
        return mockService.payments.getLoanPayments(loanId);
      }
    },
    
    // Create payment
    createPayment: async (paymentData: any) => {
      try {
        // Use Supabase when connected
        const { data, error } = await supabase
          .from('payments')
          .insert([paymentData])
          .select();
        
        if (error) throw error;
        return data[0];
      } catch (error) {
        console.error('Error creating payment:', error);
        // Fallback to mock data for development
        return mockService.payments.createPayment(paymentData);
      }
    },
  },
};

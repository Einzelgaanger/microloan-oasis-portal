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
      // Check if this is an admin login attempt
      if (email === 'admin@elaracapital.co.ke' && password === 'admin123') {
        // Return a mock admin user for development
        return mockService.auth.login(email, password);
      }
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
          data: userData,
          emailRedirectTo: `${window.location.origin}/`
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

  // Reset password
  resetPassword: async (email: string) => {
    try {
      // Use Supabase when connected
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      console.error('Reset password error:', error);
      // For mock service, just simulate success
      if (error.message && error.message.includes('supabase')) {
        // Simulate success for development
        return;
      }
      throw error;
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
        // Fallback to mock data for development since no tables exist
        return mockService.loans.getAllLoans();
      } catch (error) {
        console.error('Error fetching all loans:', error);
        return mockService.loans.getAllLoans();
      }
    },

    // Get user loans
    getUserLoans: async (userId: string) => {
      try {
        // Fallback to mock data for development since no tables exist
        return mockService.loans.getUserLoans(userId);
      } catch (error) {
        console.error('Error fetching user loans:', error);
        return mockService.loans.getUserLoans(userId);
      }
    },

    // Create a loan application
    createLoan: async (loanData: any) => {
      try {
        // Fallback to mock data for development since no tables exist
        return mockService.loans.createLoan(loanData);
      } catch (error) {
        console.error('Error creating loan:', error);
        return mockService.loans.createLoan(loanData);
      }
    },

    // Update a loan
    updateLoan: async (loanId: string, updateData: any) => {
      try {
        // Fallback to mock data for development since no tables exist
        return mockService.loans.updateLoan(loanId, updateData);
      } catch (error) {
        console.error('Error updating loan:', error);
        return mockService.loans.updateLoan(loanId, updateData);
      }
    },

    // Get loan details
    getLoan: async (loanId: string) => {
      try {
        // Fallback to mock data for development since no tables exist
        return mockService.loans.getLoan(loanId);
      } catch (error) {
        console.error('Error fetching loan:', error);
        return mockService.loans.getLoan(loanId);
      }
    },
  },

  // Profile related operations
  profiles: {
    // Get user profile
    getProfile: async (userId: string) => {
      try {
        // Fallback to mock data for development since no tables exist
        return mockService.profiles.getProfile(userId);
      } catch (error) {
        console.error('Error fetching profile:', error);
        return mockService.profiles.getProfile(userId);
      }
    },

    // Update user profile
    updateProfile: async (userId: string, profileData: any) => {
      try {
        // Fallback to mock data for development since no tables exist
        return mockService.profiles.updateProfile(userId, profileData);
      } catch (error) {
        console.error('Error updating profile:', error);
        return mockService.profiles.updateProfile(userId, profileData);
      }
    },
  },

  // Role related operations
  roles: {
    // Check if user is admin
    isAdmin: async (userId: string) => {
      try {
        // Fallback to mock data for development since no tables exist
        return mockService.auth.isAdmin(userId);
      } catch (error) {
        console.error('Error checking admin role:', error);
        return mockService.auth.isAdmin(userId);
      }
    },

    // Get user roles
    getUserRoles: async (userId: string) => {
      try {
        // Fallback to mock data for development since no tables exist
        return mockService.auth.isAdmin(userId) ? ['admin'] : ['user'];
      } catch (error) {
        console.error('Error fetching user roles:', error);
        return mockService.auth.isAdmin(userId) ? ['admin'] : ['user'];
      }
    },
  },

  // Payment related operations
  payments: {
    // Get loan payments
    getLoanPayments: async (loanId: string) => {
      try {
        // Fallback to mock data for development since no tables exist
        return mockService.payments.getLoanPayments(loanId);
      } catch (error) {
        console.error('Error fetching payments:', error);
        return mockService.payments.getLoanPayments(loanId);
      }
    },
    
    // Create payment
    createPayment: async (paymentData: any) => {
      try {
        // Fallback to mock data for development since no tables exist
        return mockService.payments.createPayment(paymentData);
      } catch (error) {
        console.error('Error creating payment:', error);
        return mockService.payments.createPayment(paymentData);
      }
    },
  },
};

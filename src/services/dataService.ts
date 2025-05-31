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
    console.log('Attempting sign in with:', email);
    
    // First try demo credentials immediately
    if (email === 'user@example.com' && password === 'password123') {
      console.log('Using demo user credentials');
      return mockService.auth.login(email, password);
    }
    
    if (email === 'admin@elaracapital.co.ke' && password === 'admin123') {
      console.log('Using demo admin credentials');
      return mockService.auth.login(email, password);
    }
    
    try {
      // Try Supabase authentication
      console.log('Trying Supabase authentication...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Supabase sign in error:', error);
        throw new Error('Invalid email or password. Please check your credentials or use the demo credentials provided.');
      }
      
      console.log('Supabase sign in successful');
      return data.user;
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      // If it's already a formatted error, throw it as is
      if (error.message && !error.message.includes('fetch') && !error.message.includes('NetworkError')) {
        throw error;
      }
      
      // For network or connection errors, fall back to mock
      console.log('Falling back to mock authentication due to connection error');
      throw new Error('Unable to connect to authentication service. Please use demo credentials: user@example.com / password123');
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
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        console.error('Supabase sign up error:', error);
        throw new Error(error.message);
      }
      
      return data.user;
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      // If it's already a formatted error, throw it as is
      if (error.message && !error.message.includes('fetch')) {
        throw error;
      }
      
      // Fallback to mock data for development
      return mockService.auth.register({ email, ...userData });
    }
  },

  // Reset password
  resetPassword: async (email: string) => {
    try {
      // Use Supabase when connected
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
    } catch (error: any) {
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
    } catch (error: any) {
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

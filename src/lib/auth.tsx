
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService, dataService } from '@/services/dataService';
import { User } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

interface AuthContextProps {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const sessionData = await authService.getSession();
        if (sessionData && sessionData.session && sessionData.session.user) {
          const supabaseUser = sessionData.session.user as User;
          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email || 'user@example.com',
            username: supabaseUser.user_metadata?.username,
            first_name: supabaseUser.user_metadata?.first_name,
            last_name: supabaseUser.user_metadata?.last_name
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const authUser = await authService.signIn(email, password);
      if (authUser) {
        const supabaseUser = authUser as User;
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || email, 
          username: supabaseUser.user_metadata?.username,
          first_name: supabaseUser.user_metadata?.first_name,
          last_name: supabaseUser.user_metadata?.last_name
        });
        
        // Check if user is admin and redirect accordingly
        const isAdmin = await dataService.roles.isAdmin(supabaseUser.id);
        toast.success('Signed in successfully');
        
        // Handle navigation based on admin status
        if (isAdmin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Error signing in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      const authUser = await authService.signUp(email, password, userData);
      if (authUser) {
        const supabaseUser = authUser as User;
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || email,
          username: userData.username,
          first_name: userData.first_name,
          last_name: userData.last_name
        });
        toast.success('Account created successfully');
        navigate('/kyc'); // Redirect to KYC form for verification
      }
    } catch (error: any) {
      toast.error(error.message || 'Error creating account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await authService.resetPassword(email);
      toast.success('Password reset email sent. Please check your inbox.');
    } catch (error: any) {
      toast.error(error.message || 'Error sending reset email');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await authService.signOut();
      setUser(null);
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    toast.error('Please sign in to access this page');
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkIfAdmin = async () => {
      if (!user) return;
      
      try {
        const isUserAdmin = await dataService.roles.isAdmin(user.id);
        setIsAdmin(isUserAdmin);
      } catch (error) {
        setIsAdmin(false);
        console.error('Error checking admin status:', error);
      } finally {
        setCheckingAdmin(false);
      }
    };

    if (!loading) {
      if (!user) {
        setCheckingAdmin(false);
      } else {
        checkIfAdmin();
      }
    }
  }, [user, loading]);

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    toast.error('Please sign in to access this page');
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    toast.error('You do not have permission to access this page');
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

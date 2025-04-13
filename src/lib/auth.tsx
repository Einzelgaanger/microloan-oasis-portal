
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService, dataService } from '@/services/dataService';

interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextProps {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user: authUser } = await authService.getSession();
        if (authUser) {
          setUser({
            id: authUser.id,
            email: authUser.email || 'user@example.com' // Ensure email is never undefined
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
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
        setUser({
          id: authUser.id,
          email: authUser.email || email // Use provided email if not returned
        });
        
        // Check if user is admin and redirect accordingly
        const isAdmin = await dataService.roles.isAdmin(authUser.id);
        toast.success('Signed in successfully');
        
        // Return the isAdmin status so the login page can redirect accordingly
        return isAdmin;
      }
    } catch (error: any) {
      toast.error(error.message || 'Error signing in');
      throw error;
    } finally {
      setLoading(false);
    }
    
    return false;
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      const authUser = await authService.signUp(email, password, userData);
      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email || email // Use provided email if not returned
        });
        toast.success('Account created successfully');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error creating account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await authService.signOut();
      setUser(null);
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
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
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please sign in to access this page');
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lending-primary"></div>
      </div>
    );
  }

  return user ? <>{children}</> : null;
};

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
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
        navigate('/login');
        toast.error('Please sign in to access this page');
        setCheckingAdmin(false);
      } else {
        checkIfAdmin();
      }
    }
  }, [user, loading, navigate]);

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lending-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    toast.error('You do not have permission to access this page');
    navigate('/dashboard');
    return null;
  }

  return <>{children}</>;
};


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Lock, Shield, Info } from 'lucide-react';
import { FadeIn } from '@/components/ui/animations';
import { useAuth } from '@/lib/auth';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('admin@elaracapital.co.ke');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Try to sign in with the provided credentials
      await signIn(email, password);
      // The signIn function will handle the admin redirect
    } catch (error: any) {
      console.error('Admin login error:', error);
      toast.error('Invalid admin credentials');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <FadeIn className="w-full max-w-md">
          <Card className="border-2 border-lending-primary/20 shadow-xl">
            <CardHeader className="space-y-1 text-center bg-gradient-to-r from-lending-primary/10 to-blue-500/10">
              <div className="flex justify-center mb-2">
                <Shield className="h-12 w-12 text-lending-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
              <CardDescription>
                Sign in with admin credentials to access the admin dashboard
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4 pt-6">
                {/* Demo credentials info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start space-x-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-800">Demo Admin Credentials</p>
                      <p className="text-blue-600">Email: <code className="bg-blue-100 px-1 rounded">admin@elaracapital.co.ke</code></p>
                      <p className="text-blue-600">Password: <code className="bg-blue-100 px-1 rounded">admin123</code></p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Admin Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Admin Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-lending-primary hover:bg-lending-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Access Admin Panel'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </FadeIn>
      </div>
    </MainLayout>
  );
};

export default AdminLogin;

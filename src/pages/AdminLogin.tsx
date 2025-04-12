
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Lock, Shield } from 'lucide-react';
import { FadeIn } from '@/components/ui/animations';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // For demo purposes, hardcoded admin password
  const ADMIN_PASSWORD = 'admin123';
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        toast.success('Admin login successful');
        navigate('/admin/dashboard');
      } else {
        toast.error('Invalid admin password');
      }
      setIsLoading(false);
    }, 1000);
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
                Enter admin password to access the admin dashboard
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
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
                  {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
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

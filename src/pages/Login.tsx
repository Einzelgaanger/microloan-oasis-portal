
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, loading } = useAuth();
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signIn(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      description="Sign in to access your account" 
      mode="login"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-sm text-lending-secondary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-lending-primary focus:ring-lending-primary"
          />
          <Label htmlFor="rememberMe" className="text-sm text-gray-600">Remember me</Label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-lending-primary hover:bg-lending-primary/90"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
        
        {/* OR divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        {/* Social login buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lending-primary"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.1711 8.36788H17.4998V8.33329H9.99984V11.6666H14.7094C14.0223 13.607 12.1761 14.9999 9.99984 14.9999C7.23859 14.9999 4.99984 12.7612 4.99984 9.99996C4.99984 7.23871 7.23859 4.99996 9.99984 4.99996C11.2744 4.99996 12.4344 5.48079 13.3169 6.26621L15.6744 3.90871C14.1886 2.52204 12.2061 1.66663 9.99984 1.66663C5.39775 1.66663 1.6665 5.39788 1.6665 9.99996C1.6665 14.602 5.39775 18.3333 9.99984 18.3333C14.6019 18.3333 18.3332 14.602 18.3332 9.99996C18.3332 9.44121 18.2757 8.89579 18.1711 8.36788Z" fill="#FFC107"/>
              <path d="M2.62744 6.12121L5.36536 8.12913C6.10619 6.29538 7.90036 4.99996 9.99994 4.99996C11.2745 4.99996 12.4345 5.48079 13.317 6.26621L15.6745 3.90871C14.1887 2.52204 12.2062 1.66663 9.99994 1.66663C6.74869 1.66663 3.91036 3.47371 2.62744 6.12121Z" fill="#FF3D00"/>
              <path d="M10 18.3334C12.1512 18.3334 14.0887 17.5167 15.5629 16.1992L12.9879 13.9876C12.1369 14.6409 11.0802 15.0001 10 15.0001C7.83211 15.0001 5.99044 13.6184 5.29627 11.6901L2.5755 13.8251C3.84627 16.5109 6.71794 18.3334 10 18.3334Z" fill="#4CAF50"/>
              <path d="M18.1713 8.36796H17.5V8.33337H10V11.6667H14.7096C14.3809 12.5902 13.7889 13.3917 13.0113 13.9876L13.0129 13.9867L15.5879 16.1984C15.4096 16.3567 18.3333 14.1667 18.3333 10.0001C18.3333 9.44129 18.2758 8.89587 18.1713 8.36796Z" fill="#1976D2"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lending-primary"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.3332 10.0001C18.3332 5.39795 14.6019 1.66675 9.99984 1.66675C5.39775 1.66675 1.6665 5.39795 1.6665 10.0001C1.6665 14.1334 4.71568 17.5893 8.69317 18.2501V12.3059H6.4873V10.0001H8.69317V8.23892C8.69317 6.23142 9.9415 5.07508 11.7686 5.07508C12.6394 5.07508 13.5477 5.22925 13.5477 5.22925V7.37508H12.5519C11.5727 7.37508 11.3065 8.09383 11.3065 8.83342V10.0001H13.4582L13.1518 12.3059H11.3065V18.2501C15.284 17.5893 18.3332 14.1334 18.3332 10.0001Z" fill="#1877F2"/>
              <path d="M13.1518 12.3059L13.4582 10.0001H11.3065V8.83342C11.3065 8.09383 11.5727 7.37508 12.5519 7.37508H13.5477V5.22925C13.5477 5.22925 12.6394 5.07508 11.7686 5.07508C9.9415 5.07508 8.69317 6.23142 8.69317 8.23892V10.0001H6.4873V12.3059H8.69317V18.2501C9.12638 18.3168 9.56984 18.3334 10.0002 18.3334C10.4305 18.3334 10.874 18.3168 11.3072 18.2501V12.3059H13.1518Z" fill="white"/>
            </svg>
            Facebook
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;

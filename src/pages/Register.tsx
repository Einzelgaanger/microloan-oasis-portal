
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { PhoneInput } from '@/components/ui/phone-input';

const Register = () => {
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    city: '',
    zipCode: '',
    agreeTerms: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      phoneNumber: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    
    if (!formData.agreeTerms) {
      toast.error("You must agree to the terms and conditions.");
      return;
    }
    
    try {
      const userData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
        address: formData.address,
        city: formData.city,
        zip_code: formData.zipCode
      };

      await signUp(formData.email, formData.password, userData);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <AuthLayout 
      title="Create an account" 
      description="Sign up to get started with MicroLoan Oasis" 
      mode="register"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="John"
              required
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Doe"
              required
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>
        
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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <PhoneInput
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={handlePhoneChange}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            placeholder="123 Main St"
            required
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              placeholder="New York"
              required
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input
              id="zipCode"
              name="zipCode"
              placeholder="10001"
              required
              value={formData.zipCode}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="agreeTerms"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            className="h-4 w-4 mt-1 rounded border-gray-300 text-lending-primary focus:ring-lending-primary"
          />
          <Label htmlFor="agreeTerms" className="text-sm text-gray-600">
            I agree to the <a href="/terms" className="text-lending-primary underline">Terms of Service</a> and <a href="/privacy" className="text-lending-primary underline">Privacy Policy</a>
          </Label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-lending-primary hover:bg-lending-primary/90"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Register;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthLayout from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { CheckCircle, Mail } from 'lucide-react';

// Define the registration form schema with Zod
const registerSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });
  
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      setRegistrationError(null);
      
      // Prepare user data for registration
      const userData = {
        first_name: data.firstName,
        last_name: data.lastName,
        username: data.username,
      };
      
      await signUp(data.email, data.password, userData);
      
      // Show email confirmation message instead of redirecting
      setUserEmail(data.email);
      setShowEmailConfirmation(true);
      toast.success('Account created successfully! Please check your email to confirm your account.');
      
    } catch (error: any) {
      setRegistrationError(error.message || 'Registration failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (showEmailConfirmation) {
    return (
      <AuthLayout title="Check Your Email" mode="register">
        <Card className="w-full max-w-md border shadow-md">
          <CardHeader className="space-y-2 bg-gradient-to-r from-gold-600 to-gold-500 text-black text-center">
            <div className="flex justify-center mb-2">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Account Created!</CardTitle>
            <CardDescription className="text-black/80">
              Please verify your email to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 pt-6 text-center">
            <div className="flex justify-center mb-4">
              <Mail className="h-16 w-16 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold">Check your email</h3>
            <p className="text-gray-600">
              We've sent a confirmation email to:
            </p>
            <p className="font-medium text-blue-600">{userEmail}</p>
            <p className="text-sm text-gray-500">
              Click the link in the email to verify your account, then you can proceed to complete your KYC verification.
            </p>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button 
              onClick={() => {
                setShowEmailConfirmation(false);
                form.reset();
                setUserEmail('');
              }}
              variant="outline"
              className="w-full"
            >
              Register Another Account
            </Button>
            
            <p className="text-sm text-center text-gray-500">
              Already verified?{' '}
              <Link to="/login" className="text-gold-600 hover:text-gold-700 font-medium">
                Sign in here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create Your Account" mode="register">
      <Card className="w-full max-w-md border shadow-md">
        <CardHeader className="space-y-2 bg-gradient-to-r from-gold-600 to-gold-500 text-black">
          <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
          <CardDescription className="text-center text-black/80">
            Create your account to get started
          </CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 pt-6">
              {registrationError && (
                <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
                  {registrationError}
                </div>
              )}
              
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-gold-600 to-gold-500 text-black hover:from-gold-700 hover:to-gold-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
              
              <p className="text-sm text-center text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="text-gold-600 hover:text-gold-700 font-medium">
                  Sign in
                </Link>
              </p>
              
              <p className="text-xs text-center text-gray-500">
                By signing up, you agree to our{' '}
                <Link to="/terms" className="text-gold-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-gold-600 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </AuthLayout>
  );
};

export default Register;

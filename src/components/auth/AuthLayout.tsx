
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  mode: 'login' | 'register';
}

const AuthLayout = ({ children, title, description, mode }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 bg-white animate-fade-in">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="flex items-center">
              <div className="bg-lending-primary rounded-lg p-1 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-banknote">
                  <rect width="20" height="12" x="2" y="6" rx="2"/>
                  <circle cx="12" cy="12" r="2"/>
                  <path d="M6 12h.01M18 12h.01"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-lending-primary">MicroLoan Oasis</span>
            </Link>
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-lending-primary mb-2">{title}</h1>
            {description && <p className="text-gray-600">{description}</p>}
          </div>
          
          {children}
          
          <div className="mt-8 text-center">
            {mode === 'login' ? (
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-lending-primary font-semibold hover:underline">
                  Sign up
                </Link>
              </p>
            ) : (
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-lending-primary font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Right side - Image/Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-lending-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-lending-primary to-lending-primary/70"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <div className="max-w-md text-center">
            <div className="mb-8">
              <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="14" x="2" y="5" rx="2"/>
                  <line x1="2" x2="22" y1="10" y2="10"/>
                </svg>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-4">Financial Solutions at Your Fingertips</h2>
            <p className="mb-8 opacity-80">
              Access quick and secure micro loans tailored to meet your personal and business financial needs.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="font-bold text-2xl mb-1">5 Min</div>
                <div className="text-sm opacity-80">Application Time</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="font-bold text-2xl mb-1">24 Hr</div>
                <div className="text-sm opacity-80">Fast Approval</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="font-bold text-2xl mb-1">100%</div>
                <div className="text-sm opacity-80">Secure Process</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="font-bold text-2xl mb-1">24/7</div>
                <div className="text-sm opacity-80">Customer Support</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-lending-primary/80 to-transparent"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-lending-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-lending-secondary/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default AuthLayout;

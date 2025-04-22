
import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  mode: 'login' | 'register';
}

const AuthLayout = ({ children, title, description, mode }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 bg-white animate-fade-in">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-black">MicroLoan</span>
            </Link>
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">{title}</h1>
            {description && <p className="text-gray-600">{description}</p>}
          </div>
          
          {children}
        </div>
      </div>
      
      {/* Right side - Image/Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-800"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <div className="max-w-md text-center">
            <h2 className="text-3xl font-bold mb-4">Financial Solutions at Your Fingertips</h2>
            <p className="mb-8 opacity-80">
              Access quick and secure loans tailored to meet your personal and business financial needs.
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
      </div>
    </div>
  );
};

export default AuthLayout;

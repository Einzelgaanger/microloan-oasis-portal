
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="hero-pattern relative py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-lending-primary mb-6">
              Quick, Secure, and Accessible Micro Loans
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Get the financial support you need to grow your business or manage your personal expenses with our hassle-free micro lending solutions.
            </p>
            
            <div className="space-y-4 mb-8">
              {[
                'Fast approval process',
                'Competitive interest rates',
                'Flexible repayment options',
                'No hidden fees'
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center animate-fade-in" 
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <CheckCircle className="h-5 w-5 text-lending-secondary mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/apply">
                <Button size="lg" className="bg-lending-primary hover:bg-lending-primary/90 btn-pulse">
                  Apply for a Loan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="lg:w-1/2 animate-scale-in">
            <div className="relative">
              <div className="absolute inset-0 bg-lending-primary/5 rounded-2xl -rotate-6 transform-gpu"></div>
              <div className="relative bg-white p-6 md:p-8 rounded-xl shadow-xl card-shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h3 className="text-lending-primary font-semibold mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                      Business Loans
                    </h3>
                    <p className="text-sm text-gray-600">Up to $25,000 for your business needs with tailored repayment plans.</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h3 className="text-lending-secondary font-semibold mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
                      Personal Loans
                    </h3>
                    <p className="text-sm text-gray-600">Quick personal loans up to $10,000 with competitive rates.</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h3 className="text-lending-accent font-semibold mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                      Emergency Loans
                    </h3>
                    <p className="text-sm text-gray-600">Same-day emergency funding when you need it most.</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h3 className="text-lending-primary font-semibold mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z"/><rect x="3" y="14" width="7" height="7" rx="1"/><circle cx="17.5" cy="17.5" r="3.5"/></svg>
                      Group Loans
                    </h3>
                    <p className="text-sm text-gray-600">Collaborative financing options for community projects.</p>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">Average approval time: <span className="font-semibold text-lending-primary">24 hours</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default Hero;

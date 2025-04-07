
import React from 'react';
import { cn } from '@/lib/utils';

const steps = [
  {
    number: '01',
    title: 'Complete Application',
    description: 'Fill out our simple online application form with your personal and financial details.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h4"/></svg>
    )
  },
  {
    number: '02',
    title: 'Verification Process',
    description: 'We verify your identity and assess your loan eligibility based on the provided information.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 14 2 2 4-4"/></svg>
    )
  },
  {
    number: '03',
    title: 'Loan Approval',
    description: 'Receive loan approval and review the terms and conditions before accepting the offer.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
    )
  },
  {
    number: '04',
    title: 'Receive Funds',
    description: 'Once approved and accepted, funds are quickly disbursed to your bank account.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
    )
  }
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-lending-primary mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 text-lg">
            Get the financial support you need in just a few simple steps.
          </p>
        </div>
        
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-lending-primary/30 transform -translate-x-1/2 z-0"></div>
          
          <div className="space-y-12 lg:space-y-0 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex flex-col lg:flex-row items-center lg:items-start",
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                )}
              >
                <div className={cn(
                  "lg:w-1/2 flex",
                  index % 2 === 0 ? "lg:justify-end lg:pr-12" : "lg:justify-start lg:pl-12"
                )}>
                  <div className={cn(
                    "bg-white rounded-xl shadow-lg p-6 max-w-md animate-fade-in border border-gray-200",
                    index % 2 === 0 ? "animate-slide-in-right" : "animate-slide-in-left"
                  )}
                  style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="flex items-start">
                      <div className="w-12 h-12 flex items-center justify-center bg-lending-primary/10 rounded-full mr-4 text-lending-primary flex-shrink-0">
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-lending-primary mb-2">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center lg:w-16 my-4 lg:my-0">
                  <div className="w-12 h-12 rounded-full bg-lending-primary text-white flex items-center justify-center text-xl font-semibold shadow-md">
                    {step.number}
                  </div>
                </div>
                
                <div className="lg:w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

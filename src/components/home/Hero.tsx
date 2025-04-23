
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import LoanCalculator from './LoanCalculator';

interface HeroProps {
  onApply: () => void;
}

const Hero = ({ onApply }: HeroProps) => {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-white hero-gradient-overlay">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black mb-6">
              Empowering Your<br/>Financial Journey
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Elara Capital provides tailored financial solutions to help you achieve your goals with confidence and clarity.
            </p>
            
            <div className="space-y-4 mb-8">
              {[
                'Loans from KES 50,000 to 500,000',
                'Quick approval and disbursement',
                'Flexible repayment periods up to 6 months',
                'Dedicated customer support'
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center" 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                >
                  <div className="h-5 w-5 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 mr-2 flex items-center justify-center">
                    <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-800">{feature}</span>
                </motion.div>
              ))}
            </div>
            
            <Button 
              size="lg"
              onClick={onApply}
              className="bg-blue-600 hover:bg-blue-700 text-white group shadow-lg"
            >
              Apply for a Loan
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
          
          <div className="lg:w-1/2">
            <LoanCalculator />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

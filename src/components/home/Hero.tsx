
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import LoanCalculator from './LoanCalculator';
import { useAuth } from '@/lib/auth';

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleApplyClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/apply');
    }
  };

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black mb-6">
              Easy Access to<br/>Financial Freedom
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Get the financial support you need with our hassle-free lending solutions designed specifically for you.
            </p>
            
            <div className="space-y-4 mb-8">
              {[
                'Fast approval within 24 hours',
                'Competitive interest rates',
                'Simple repayment options',
                'No hidden fees'
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center" 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                >
                  <div className="h-5 w-5 rounded-full bg-gradient-to-r from-gold-600 to-gold-500 mr-2 flex items-center justify-center">
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
              variant="secondary"
              onClick={handleApplyClick}
              className="group shadow-lg"
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

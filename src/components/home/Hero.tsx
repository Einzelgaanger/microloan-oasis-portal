
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import LoanCalculator from './LoanCalculator';
import { WavingFlag, KenyaFloatingElements } from '@/components/ui/floating-animations';

interface HeroProps {
  onApplyClick?: () => void;
}

const Hero = ({ onApplyClick }: HeroProps) => {
  return (
    <section className="hero-pattern relative py-16 md:py-24 overflow-hidden">
      {/* Add floating elements for visual interest */}
      <div className="hidden md:block">
        <KenyaFloatingElements count={4} />
      </div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-4">
              <WavingFlag size={36} />
              <h2 className="text-lg font-medium ml-2 text-lending-primary">Kenya's Trusted Microlender</h2>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-lending-primary mb-6">
              Quick, Secure, and<br/>Accessible Micro Loans
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Get the financial support you need with our hassle-free lending solutions designed for Kenyan businesses and individuals.
            </p>
            
            <div className="space-y-4 mb-8">
              {[
                'Fast approval within hours',
                'Competitive interest rates from 15%',
                'M-Pesa disbursement and repayment',
                'No hidden fees or charges'
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center" 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                >
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 btn-pulse"
                onClick={onApplyClick}
              >
                Apply for a Loan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link to="/register">
                <Button variant="outline" size="lg" className="border-lending-primary text-lending-primary hover:bg-lending-primary/10">
                  Register Now
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <div className="lg:w-1/2">
            <LoanCalculator />
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default Hero;

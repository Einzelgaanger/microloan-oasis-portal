
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import LoanCalculator from './LoanCalculator';
import { useAuth } from '@/lib/auth';
import { WavingFlag, KenyaFloatingElements } from '@/components/ui/floating-animations';

interface HeroProps {
  onApplyClick?: () => void;
}

const Hero = ({ onApplyClick }: HeroProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleApplyClick = () => {
    if (onApplyClick) {
      onApplyClick();
    } else {
      if (!user) {
        navigate('/login');
      } else {
        navigate('/apply');
      }
    }
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-white">
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
              <h2 className="text-lg font-medium ml-2 text-black">Kenya's Trusted Microlender</h2>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black mb-6">
              Quick, Secure, and<br/>Accessible Micro Loans
            </h1>
            <p className="text-xl text-gray-700 mb-8">
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
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-800">{feature}</span>
                </motion.div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleApplyClick}
              >
                Apply for a Loan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link to={user ? "/dashboard" : "/register"}>
                <Button variant="outline" size="lg" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50">
                  {user ? "My Dashboard" : "Register Now"}
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

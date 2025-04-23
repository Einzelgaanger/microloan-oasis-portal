
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CallToActionProps {
  onApply: () => void;
}

const CallToAction = ({ onApply }: CallToActionProps) => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-800 to-blue-600 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">
            Ready to Achieve Your Financial Goals?
          </h2>
          <p className="text-xl opacity-90 mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
            Apply for a loan today and take the first step towards your financial freedom.
          </p>
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={onApply}
              className="bg-gold-500 hover:bg-gold-600 text-black group"
            >
              Apply for a Loan
              <ArrowRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          <p className="mt-6 text-sm opacity-80 animate-fade-in" style={{ animationDelay: '300ms' }}>
            Loans from KES 50,000 to KES 500,000 with competitive interest rates.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;

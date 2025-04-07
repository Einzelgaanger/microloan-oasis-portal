
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-lending-primary to-lending-primary/80 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">
            Ready to Apply for Your Micro Loan?
          </h2>
          <p className="text-xl opacity-90 mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
            Take the first step towards achieving your financial goals today. Our application process is quick, secure, and user-friendly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Link to="/apply">
              <Button size="lg" variant="secondary" className="bg-white text-lending-primary hover:bg-gray-100 btn-pulse">
                Apply Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm opacity-80 animate-fade-in" style={{ animationDelay: '300ms' }}>
            No obligation and no impact on your credit score to explore your options.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;

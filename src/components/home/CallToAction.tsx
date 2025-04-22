
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleApply = () => {
    if (user) {
      navigate('/apply');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-black to-gray-800 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">
            Ready to Join Our Financial Community?
          </h2>
          <p className="text-xl opacity-90 mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
            Take the first step towards achieving your financial goals today. Create an account to get started.
          </p>
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={handleApply}
              className="group"
            >
              Apply for a Loan
              <ArrowRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            {!user && (
              <div className="mt-4">
                <Link to="/register">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Create Account
                  </Button>
                </Link>
              </div>
            )}
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


import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="py-16 bg-black text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">
            Ready to Join Our Financial Community?
          </h2>
          <p className="text-xl opacity-90 mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
            Take the first step towards achieving your financial goals today. Create an account to get started.
          </p>
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Create Account
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

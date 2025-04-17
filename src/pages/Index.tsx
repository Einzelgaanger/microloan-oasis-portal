
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import CallToAction from '@/components/home/CallToAction';
import { useAuth } from '@/lib/auth';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleApplyNow = () => {
    // Always redirect to login if user is not logged in
    if (!user) {
      navigate('/login');
    } else {
      // Only if logged in, redirect to apply page
      navigate('/apply');
    }
  };

  return (
    <MainLayout applyHandler={handleApplyNow}>
      <Hero onApplyClick={handleApplyNow} />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CallToAction onApplyClick={handleApplyNow} />
    </MainLayout>
  );
};

export default Index;

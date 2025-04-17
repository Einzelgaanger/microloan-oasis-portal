
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  applyHandler?: () => void;
}

const MainLayout = ({ children, applyHandler }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar applyHandler={applyHandler} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

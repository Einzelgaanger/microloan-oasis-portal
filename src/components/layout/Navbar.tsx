
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, Home, FileText, HelpCircle, Phone, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home className="w-4 h-4 mr-1" /> },
    { name: 'Apply', path: '/apply', icon: <FileText className="w-4 h-4 mr-1" /> },
    { name: 'About Us', path: '/about', icon: <HelpCircle className="w-4 h-4 mr-1" /> },
    { name: 'Contact', path: '/contact', icon: <Phone className="w-4 h-4 mr-1" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="bg-lending-primary rounded-lg p-1 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-banknote">
                  <rect width="20" height="12" x="2" y="6" rx="2"/>
                  <circle cx="12" cy="12" r="2"/>
                  <path d="M6 12h.01M18 12h.01"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-lending-primary">MicroLoan Oasis</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive(link.path)
                    ? "bg-lending-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            
            <div className="ml-4 flex items-center">
              <Link to="/login">
                <Button variant="outline" size="sm" className="mr-2">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-lending-primary hover:bg-lending-primary/90">
                  Register
                </Button>
              </Link>
            </div>
          </nav>
          
          {/* Mobile Navigation Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-lending-primary hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={cn("md:hidden", isOpen ? "block" : "hidden")}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg border-t border-gray-200 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors",
                isActive(link.path)
                  ? "bg-lending-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
              onClick={toggleMenu}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          <div className="flex flex-col pt-2 space-y-2">
            <Link to="/login" onClick={toggleMenu}>
              <Button variant="outline" className="w-full">
                Login
              </Button>
            </Link>
            <Link to="/register" onClick={toggleMenu}>
              <Button className="w-full bg-lending-primary hover:bg-lending-primary/90">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

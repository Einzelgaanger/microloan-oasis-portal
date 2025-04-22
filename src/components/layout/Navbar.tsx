
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { Menu, X, ChevronDown, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleApply = () => {
    if (user) {
      navigate('/apply');
    } else {
      navigate('/login');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="border-b border-gray-100 py-4 bg-white/90 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-gold-600 to-gold-500 bg-clip-text text-transparent">MicroLoan</span>
          <span className="text-2xl font-bold">Oasis</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-gold-600 transition-colors">Home</Link>
          <div className="relative group">
            <button className="flex items-center text-gray-700 hover:text-gold-600 transition-colors">
              About <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden transform opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 origin-top-left z-50">
              <Link to="/about-us" className="block px-4 py-2 hover:bg-gray-100">Our Story</Link>
              <Link to="/how-it-works" className="block px-4 py-2 hover:bg-gray-100">How It Works</Link>
              <Link to="/testimonials" className="block px-4 py-2 hover:bg-gray-100">Testimonials</Link>
            </div>
          </div>
          <Link to="/faq" className="text-gray-700 hover:text-gold-600 transition-colors">FAQ</Link>
          <Link to="/contact" className="text-gray-700 hover:text-gold-600 transition-colors">Contact</Link>
          
          {user ? (
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-gold-600 transition-colors">
                Account <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden transform opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 origin-top-right z-50">
                <Link to="/dashboard" className="flex items-center px-4 py-2 hover:bg-gray-100">
                  <User className="mr-2 h-4 w-4" /> Dashboard
                </Link>
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                <button 
                  onClick={signOut} 
                  className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="hover:text-gold-600" 
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </div>
          )}
          
          <Button 
            onClick={handleApply}
            className="bg-gradient-to-r from-gold-600 to-gold-500 text-black hover:from-gold-700 hover:to-gold-600"
          >
            Apply Now
          </Button>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden py-4 px-4 bg-white border-t">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="text-gray-700 hover:text-gold-600 transition-colors" onClick={toggleMenu}>Home</Link>
            <Link to="/about-us" className="text-gray-700 hover:text-gold-600 transition-colors" onClick={toggleMenu}>Our Story</Link>
            <Link to="/how-it-works" className="text-gray-700 hover:text-gold-600 transition-colors" onClick={toggleMenu}>How It Works</Link>
            <Link to="/testimonials" className="text-gray-700 hover:text-gold-600 transition-colors" onClick={toggleMenu}>Testimonials</Link>
            <Link to="/faq" className="text-gray-700 hover:text-gold-600 transition-colors" onClick={toggleMenu}>FAQ</Link>
            <Link to="/contact" className="text-gray-700 hover:text-gold-600 transition-colors" onClick={toggleMenu}>Contact</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-gold-600 transition-colors" onClick={toggleMenu}>Dashboard</Link>
                <Link to="/profile" className="text-gray-700 hover:text-gold-600 transition-colors" onClick={toggleMenu}>Profile</Link>
                <button 
                  onClick={() => {
                    signOut();
                    toggleMenu();
                  }}
                  className="text-left text-red-600 hover:text-red-700 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-gold-600 transition-colors" onClick={toggleMenu}>Sign In</Link>
                <Link to="/register" className="text-gray-700 hover:text-gold-600 transition-colors" onClick={toggleMenu}>Register</Link>
              </>
            )}
            
            <Button 
              onClick={() => {
                handleApply();
                toggleMenu();
              }}
              className="bg-gradient-to-r from-gold-600 to-gold-500 text-black hover:from-gold-700 hover:to-gold-600"
            >
              Apply Now
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

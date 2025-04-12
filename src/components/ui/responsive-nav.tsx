
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Menu } from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

interface ResponsiveNavProps {
  logo?: React.ReactNode;
  items: NavItem[];
  rightContent?: React.ReactNode;
  className?: string;
}

export const ResponsiveNav: React.FC<ResponsiveNavProps> = ({
  logo,
  items,
  rightContent,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`w-full bg-white shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav - visible on all screens */}
          <div className="flex">
            {/* Logo */}
            {logo && (
              <div className="flex-shrink-0 flex items-center">
                {logo}
              </div>
            )}
            
            {/* Main nav - hidden on mobile */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {items.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors"
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right content area */}
          <div className="hidden sm:flex sm:items-center">
            {rightContent}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <motion.div 
          className="sm:hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="pt-2 pb-3 space-y-1">
            {items.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="block py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center">
                  {item.icon && <span className="mr-3">{item.icon}</span>}
                  {item.title}
                </div>
              </Link>
            ))}
          </div>
          
          {/* Mobile view of right content */}
          {rightContent && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                {rightContent}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </nav>
  );
};

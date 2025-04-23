
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h3 className="text-xl font-semibold mb-4">Elara Capital</h3>
            <p className="text-gray-300 mb-4">
              Providing innovative financial solutions to individuals, helping them achieve their goals and secure their future.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/apply" className="text-gray-300 hover:text-blue-400 transition-colors">Apply for Loan</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <h3 className="text-xl font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-blue-400 transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-blue-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-blue-400 transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/loan-terms" className="text-gray-300 hover:text-blue-400 transition-colors">Loan Terms</Link>
              </li>
            </ul>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail size={18} className="mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-300">support@elaracapital.com</span>
              </li>
              <li className="flex items-start">
                <Phone size={18} className="mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-300">+254 700 000 000</span>
              </li>
              <li>
                <address className="text-gray-300 not-italic">
                  123 Business District,<br />
                  Suite 456,<br />
                  Nairobi, Kenya
                </address>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Elara Capital. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-400">
                Licensed and regulated financial institution
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, Home, FileText, HelpCircle, Phone, User, CreditCard, LogOut, Settings, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { dataService } from '@/services/dataService';

interface NavbarProps {
  applyHandler?: () => void;
}

const Navbar = ({ applyHandler }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [userName, setUserName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const profile = await dataService.profiles.getProfile(user.id);
          if (profile) {
            setUserName(`${profile.first_name} ${profile.last_name}`);
            if (profile.avatar_url) {
              setAvatarUrl(profile.avatar_url);
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const getInitials = () => {
    if (!userName) return 'U';
    return userName.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUserMenuOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  
  const handleApplyClick = () => {
    if (applyHandler) {
      applyHandler();
    } else {
      // Always direct to login if not logged in
      if (!user) {
        navigate('/login');
      } else {
        navigate('/apply');
      }
    }
  };

  const publicNavLinks = [
    { name: 'Home', path: '/', icon: <Home className="w-4 h-4 mr-1" /> },
    { name: 'About Us', path: '/about', icon: <HelpCircle className="w-4 h-4 mr-1" /> },
    { name: 'Contact', path: '/contact', icon: <Phone className="w-4 h-4 mr-1" /> },
  ];

  const authenticatedNavLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <PieChart className="w-4 h-4 mr-1" /> },
  ];

  const navLinks = user ? authenticatedNavLinks : publicNavLinks;

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="bg-emerald-600 rounded-lg p-1 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-banknote">
                  <rect width="20" height="12" x="2" y="6" rx="2"/>
                  <circle cx="12" cy="12" r="2"/>
                  <path d="M6 12h.01M18 12h.01"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-emerald-900">MicroLoan Oasis</span>
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
                    ? "bg-emerald-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            
            <div className="ml-4 flex items-center">
              {user ? (
                <>
                  <Button 
                    onClick={handleApplyClick}
                    className="mr-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Apply for Loan
                  </Button>
                  
                  <div className="relative">
                    <button
                      onClick={toggleUserMenu}
                      className="flex items-center space-x-2 focus:outline-none"
                    >
                      <Avatar className="h-8 w-8 border border-emerald-200">
                        {avatarUrl ? (
                          <AvatarImage src={avatarUrl} alt={userName} />
                        ) : (
                          <AvatarFallback className="bg-emerald-600 text-white">
                            {getInitials()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="hidden lg:block text-sm font-medium text-gray-700">
                        {userName.split(' ')[0]}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </button>
                    
                    {/* User Dropdown Menu */}
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium">{userName}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4 mr-2" />
                          My Profile
                        </Link>
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          My Loans
                        </Link>
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Link>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center"
                          onClick={handleSignOut}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Button 
                    onClick={handleApplyClick}
                    className="mr-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Apply for Loan
                  </Button>
                  <Link to="/login">
                    <Button variant="outline" size="sm" className="mr-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
          
          {/* Mobile Navigation Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-emerald-600 hover:bg-gray-100 focus:outline-none"
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
                  ? "bg-emerald-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
              onClick={toggleMenu}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <>
              <div className="border-t border-gray-200 my-2 pt-2">
                <div className="flex items-center px-3 py-2">
                  <Avatar className="h-8 w-8 mr-2">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt={userName} />
                    ) : (
                      <AvatarFallback className="bg-emerald-600 text-white">
                        {getInitials()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-100"
                  onClick={toggleMenu}
                >
                  <User className="h-4 w-4 mr-2" />
                  My Profile
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-100"
                  onClick={toggleMenu}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  My Loans
                </Link>
                <Link
                  to="/admin/dashboard"
                  className="flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-100"
                  onClick={toggleMenu}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Panel
                </Link>
                <button
                  className="flex items-center w-full text-left px-3 py-2 text-base font-medium rounded-md text-red-600 hover:bg-gray-100"
                  onClick={() => {
                    handleSignOut();
                    toggleMenu();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </button>
                
                <Button 
                  onClick={() => {
                    handleApplyClick();
                    toggleMenu();
                  }}
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Apply for Loan
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col pt-2 space-y-2">
              <Link to="/login" onClick={toggleMenu}>
                <Button variant="outline" className="w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50">
                  Login
                </Button>
              </Link>
              <Link to="/register" onClick={toggleMenu}>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  Register
                </Button>
              </Link>
              <Button 
                onClick={() => {
                  handleApplyClick();
                  toggleMenu();
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Apply for Loan
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

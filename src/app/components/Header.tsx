import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { CATEGORIES_WITH_SUBCATEGORIES } from '../../supabase';

// Serve logo via Cloudinary for auto-format + exact-size delivery (saves ~76 KiB)
const LOGO_URL = 'https://res.cloudinary.com/djvccbmtx/image/upload/w_332,h_160,c_fit,f_auto,q_auto/v1/Tsd%20logo.webp';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesHovered, setIsServicesHovered] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services', hasDropdown: true },
    { name: 'Gallery', path: '/gallery' },

    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out !bg-transparent ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-md'
            : ''
        }`}
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center"
              >
                <img 
                  src={LOGO_URL} 
                  alt="TSD Events & Decor Logo" 
                  width="166"
                  height="80"
                  className="h-16 w-auto object-contain"
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8" aria-label="Main navigation">
              {navLinks.map((link) => (
                <div
                  key={link.path}
                  className="relative"
                  onMouseEnter={() => link.hasDropdown && setIsServicesHovered(true)}
                  onMouseLeave={() => link.hasDropdown && setIsServicesHovered(false)}
                >
                  <Link
                    to={link.path}
                    className={`transition-colors duration-200 flex items-center space-x-1 group ${
                      isScrolled
                        ? location.pathname === link.path
                          ? 'text-red-700/90'
                          : 'text-gray-800 hover:text-red-700/90'
                        : location.pathname === link.path
                          ? 'text-amber-400'
                          : 'text-white hover:text-amber-400'
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.hasDropdown && (
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180 duration-200" />
                    )}
                    <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full ${
                      isScrolled ? 'bg-red-700/90' : 'bg-amber-400'
                    }`} />
                  </Link>

                  {/* Services Dropdown */}
                  {link.hasDropdown && (
                    <AnimatePresence>
                      {isServicesHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="fixed top-20 left-0 right-0 mx-auto bg-white shadow-2xl overflow-hidden z-50"
                        >
                          <div className="max-w-full bg-white">
                            <div className="grid grid-cols-5 gap-0 divide-x divide-gray-200">
                              {Object.entries(CATEGORIES_WITH_SUBCATEGORIES)
                                .filter(([category]) => category !== 'Other')
                                .map(([category, subcategories]) => (
                                <div key={category} className="p-6 hover:bg-gray-50 transition-colors">
                                  <h3 className="text-red-700/90 font-bold text-sm uppercase tracking-wider mb-4 pb-3 border-b-2 border-red-200">
                                    {category}
                                  </h3>
                                  <div className="space-y-2">
                                    {subcategories.map((subcategory, idx) => (
                                      <motion.button
                                        key={idx}
                                        onClick={() => {
                                          setIsServicesHovered(false);
                                        }}
                                        whileHover={{ x: 3 }}
                                        className="block w-full text-left px-2 py-1.5 rounded hover:bg-red-50 transition-colors text-gray-700 text-sm hover:text-red-700 font-medium"
                                      >
                                        {subcategory}
                                      </motion.button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="bg-gray-50 px-8 py-3 border-t border-gray-200 flex justify-between items-center">
                              <span className="text-gray-500 text-xs">Explore all our event solutions</span>
                              <button
                                onClick={() => {
                                  setIsServicesHovered(false);
                                  navigate('/services');
                                }}
                                aria-label="Explore all services"
                                className="text-red-700/90 hover:text-red-800/90 font-bold text-sm flex items-center space-x-1 group"
                              >
                                <span>View All</span>
                                <ChevronDown className="w-3 h-3 -rotate-90 group-hover:translate-x-0.5 transition-transform" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              className={`lg:hidden p-2 transition-colors ${isScrolled ? 'text-gray-900' : 'text-white'}`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/90 backdrop-blur-2xl z-40 lg:hidden"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            <div className="flex flex-col items-center justify-center h-full space-y-6 px-6">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={`text-3xl font-semibold text-gray-900 hover:text-red-700/90 transition-colors ${
                      location.pathname === link.path ? 'text-red-700/90' : ''
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

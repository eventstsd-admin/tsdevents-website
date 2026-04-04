import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import logo from '../images/Tsd logo.png';
import { CATEGORIES_WITH_SUBCATEGORIES } from '../../supabase';

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
    { name: 'Events', path: '/events' },
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
                  src={logo} 
                  alt="TSD Events & Decor Logo" 
                  className="h-16 w-auto object-contain"
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
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
                            <div className="grid grid-cols-4 gap-0 divide-x divide-gray-200">
                              {Object.entries(CATEGORIES_WITH_SUBCATEGORIES).map(([category, subcategories]) => (
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
              {/* Mobile Get Quote Button */}
              <motion.a
                href="https://wa.me/919825413606?text=Hi%2C%20I%20want%20to%20plan%20an%20event.%20Can%20you%20share%20details%3F"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 font-semibold text-lg shadow-md flex items-center gap-2 mt-4"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Get Free Quote
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

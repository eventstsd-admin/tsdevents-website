import { Link } from 'react-router';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin, Heart } from 'lucide-react';
import logoImage from '../images/logo without text.webp';

export function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src={logoImage}
                alt="TSD Events & Decor Logo"
                className="w-10 h-10 object-contain"
              />
              <div>
                <h3 className="text-xl font-bold">TSD Events & Decor</h3>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Creating unforgettable experiences through exceptional event planning and flawless execution.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a 
                href="https://www.instagram.com/tsd_events_decor/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-amber-400 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-400 text-sm">Wedding</li>
              <li className="text-gray-400 text-sm">Religious</li>
              <li className="text-gray-400 text-sm">Corporate Event</li>
              <li className="text-gray-400 text-sm">Decoration</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-amber-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Visit us at our office or click <a href="https://maps.app.goo.gl/oSoJT4RoNKFvVRHU9" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline">here</a> for directions
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-amber-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+91 98254 13606</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-amber-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">info@tsdevents.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2026 TSD Events & Decor. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center">
            Made with <Heart size={16} className="text-red-500 mx-1" /> by TSD Events & Decor Team
          </p>
        </div>
      </div>
    </footer>
  );
}
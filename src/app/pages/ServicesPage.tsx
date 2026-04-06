import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { SEOComponent, PAGE_SEO } from '../components/SEO-fallback';
import { ChevronRight, ArrowLeft, MessageCircle, Phone, Mail } from 'lucide-react';
import { CATEGORIES_WITH_SUBCATEGORIES } from '../constants';
// Cloudinary category card image
const religiousImage = 'https://res.cloudinary.com/djvccbmtx/image/upload/v1775312393/ReligiousCat_zak58e.webp';
import servicesHeroImage from '../images/Hero Fallback/Services/ServiceHero.jpg';

// Cloudinary URL
const servicesHeroUrl = 'https://res.cloudinary.com/djvccbmtx/image/upload/v1775420846/servicehero_ugr8zi.jpg';
const servicesHeroImageToUse = servicesHeroUrl;

const categoryDescriptions: Record<string, string> = {
  'Wedding': 'Complete wedding planning services for your perfect celebration.',
  'Religious': 'Traditional ceremony coordination with cultural authenticity.',
  'Corporate Event': 'Professional business event management and coordination.',
  'Decoration': 'Creative decoration and venue transformation services.',
};

const categoryImages: Record<string, string> = {
  'Wedding': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
  'Religious': religiousImage,
  'Corporate Event': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  'Decoration': 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80',
};

export default function ServicesPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackClick = () => {
    setSelectedCategory(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white min-h-screen">
      <SEOComponent {...PAGE_SEO.services} />
      
      {/* Hero Section */}
      <section className="relative min-h-[40vh] sm:h-[50vh] overflow-hidden pt-16 sm:pt-20">
        <div className="absolute inset-0">
          {/* Background Image */}
          <motion.div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${servicesHeroImageToUse})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60" />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>
        
        <div className="relative z-10 min-h-[40vh] sm:h-full flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-full sm:max-w-4xl w-full sm:w-11/12 mx-auto py-8 sm:py-0">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-3 sm:mb-6"
            >
              {selectedCategory || 'Our Services'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200"
            >
              {selectedCategory 
                ? categoryDescriptions[selectedCategory]
                : 'Expert event planning services across India for unforgettable celebrations.'
              }
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <AnimatePresence mode="wait">
            {!selectedCategory ? (
              // CATEGORY CARDS VIEW
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Section Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-12"
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Choose Your Service Category
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Select a category to explore our specialized services
                  </p>
                </motion.div>

                {/* Category Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Object.keys(CATEGORIES_WITH_SUBCATEGORIES).map((category, idx) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCategoryClick(category)}
                      className="group relative overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500"
                    >
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <img 
                          src={categoryImages[category]} 
                          alt={category}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                      </div>
                      
                      {/* Content */}
                      <div className="relative p-8 h-[350px] flex flex-col justify-end">
                        {/* Title */}
                        <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                          {category}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-gray-300 mb-4 leading-relaxed">
                          {categoryDescriptions[category]}
                        </p>
                        
                        {/* Subcategory Count */}
                        <div className="flex items-center justify-between">
                          <span className="text-amber-400 font-medium">
                            {CATEGORIES_WITH_SUBCATEGORIES[category].length} Services
                          </span>
                          <div className="flex items-center gap-2 text-white group-hover:text-amber-400 transition-colors">
                            <span className="font-medium">Explore</span>
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>

                        {/* Decorative Border */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              // SUBCATEGORY CARDS VIEW
              <motion.div
                key="subcategories"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Back Button */}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={handleBackClick}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-700 mb-8 font-medium transition-colors group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  Back to Categories
                </motion.button>

                {/* Section Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-12"
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {selectedCategory} Services
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    {categoryDescriptions[selectedCategory]}
                  </p>
                </motion.div>

                {/* Subcategory Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {CATEGORIES_WITH_SUBCATEGORIES[selectedCategory].map((subcategory, idx) => (
                    <motion.div
                      key={subcategory}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -4 }}
                      className="group relative overflow-hidden bg-white border border-gray-200 hover:border-red-400 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      {/* Top Accent Bar */}
                      <div className="h-1 bg-red-800" />
                      
                      {/* Content */}
                      <div className="p-6">
                        {/* Service Number */}
                        <span className="text-5xl font-bold text-gray-100 absolute top-4 right-4 group-hover:text-red-100 transition-colors">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        
                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-800 transition-colors relative z-10">
                          {subcategory}
                        </h3>
                        
                        {/* Divider */}
                        <div className="h-0.5 w-12 bg-red-800 mb-4 group-hover:w-20 transition-all duration-300" />
                        
                        {/* CTA Button */}
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/contact?service=${encodeURIComponent(subcategory)}`);
                          }}
                          className="w-full bg-red-800 hover:bg-red-900 text-white font-medium rounded-md transition-all"
                        >
                          Get a Quote
                          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-red-800 py-16 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Let's Plan Your Dream Event
            </h2>
            <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
              Our expert team is ready to bring your vision to life with our comprehensive event services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.open('https://wa.me/919825413606?text=Hi%2C%20I%27m%20interested%20in%20your%20event%20services.%20Can%20you%20share%20details%3F', '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-md text-lg font-semibold shadow-lg transition-all duration-300"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Contact on WhatsApp
              </Button>
              <Button
                onClick={() => window.location.href = 'mailto:info@tsdevents.in'}
                className="bg-white hover:bg-gray-100 text-red-800 px-8 py-4 rounded-md text-lg font-semibold shadow-lg transition-all duration-300"
              >
                <Mail className="mr-2 w-5 h-5" />
                Write an Email
              </Button>
              <Button
                onClick={() => window.location.href = 'tel:+919825413606'}
                className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-md text-lg font-semibold shadow-lg transition-all duration-300"
              >
                <Phone className="mr-2 w-5 h-5" />
                Call Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
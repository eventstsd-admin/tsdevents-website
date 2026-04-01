import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { ChevronRight, ArrowLeft, Sparkles } from 'lucide-react';
import { CATEGORIES_WITH_SUBCATEGORIES } from '../../supabase';
import religiousImage from '../images/Hero Fallback/Services/Catcard/ReligiousCat.jpeg';
import servicesHeroImage from '../images/Hero Fallback/Services/ServiceHero.jpg';

const categoryDescriptions: Record<string, string> = {
  'Wedding': 'Make your special day unforgettable with our comprehensive wedding services',
  'Religious': 'Sacred ceremonies organized with devotion and attention to tradition',
  'Corporate Event': 'Professional event management for your business occasions',
  'Decoration': 'Transform any space into a stunning masterpiece',
};

const categoryImages: Record<string, string> = {
  'Wedding': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
  'Religious': religiousImage,
  'Corporate Event': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  'Decoration': 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80',
};

export function ServicesPage() {
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
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img
            src={servicesHeroImage}
            alt="Our Services"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 mb-4"
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 font-medium tracking-wider uppercase text-sm">Premium Services</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              {selectedCategory || 'Our Services'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-200 max-w-2xl mx-auto"
            >
              {selectedCategory 
                ? categoryDescriptions[selectedCategory]
                : 'Comprehensive event management solutions tailored to your needs'
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
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCategoryClick(category)}
                      className="group relative overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
                    >
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <img 
                          src={categoryImages[category]} 
                          alt={category}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 transition-all duration-500" />
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
                          <motion.div 
                            className="flex items-center gap-2 text-white group-hover:text-amber-400 transition-colors"
                            whileHover={{ x: 5 }}
                          >
                            <span className="font-medium">Explore</span>
                            <ChevronRight className="w-5 h-5" />
                          </motion.div>
                        </div>

                        {/* Decorative Border */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
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
                      whileHover={{ y: -6, scale: 1.02 }}
                      className="group relative overflow-hidden rounded-2xl bg-white border-2 border-gray-100 hover:border-red-400 shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      {/* Top Accent Bar */}
                      <div className="h-2 bg-gradient-to-r from-red-500 to-amber-500" />
                      
                      {/* Content */}
                      <div className="p-6">
                        {/* Service Number */}
                        <span className="text-5xl font-bold text-gray-100 absolute top-4 right-4 group-hover:text-red-100 transition-colors">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        
                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-700 transition-colors relative z-10">
                          {subcategory}
                        </h3>
                        
                        {/* Divider */}
                        <div className="h-0.5 w-12 bg-red-500 mb-4 group-hover:w-20 transition-all duration-300" />
                        
                        {/* CTA Button */}
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/contact');
                          }}
                          className="w-full bg-red-700 hover:bg-red-800 text-white font-medium rounded-lg transition-all group-hover:shadow-lg"
                        >
                          Get a Quote
                          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>

                      {/* Corner Decoration */}
                      <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-red-800 py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Plan Your Event?
            </h2>
            <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
              Our expert team is ready to bring your vision to life with our comprehensive event services
            </p>
            <Button
              onClick={() => navigate('/contact')}
              className="bg-white hover:bg-gray-100 text-red-700 hover:text-red-800 font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
            >
              Contact Us
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
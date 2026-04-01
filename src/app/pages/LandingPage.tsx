import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import Slider from 'react-slick';
import { ArrowRight, Sparkles, Users, Award, Calendar, Star, Quote } from 'lucide-react';
import { Button } from '../components/ui/button';
import { OptimizedImage } from '../components/OptimizedImage';
import { SEOComponent, PAGE_SEO } from '../components/SEO-fallback';
import { pastEventOperations } from '../../supabase';

// Import hero images
import heroImage1 from '../images/Hero Fallback/HomePage/1.jpg';
import heroImage2 from '../images/Hero Fallback/HomePage/2.jpeg';
import heroImage3 from '../images/Hero Fallback/HomePage/3.jpeg';

// Hero section with gradient backgrounds
const heroBackgrounds = [
  'bg-gradient-to-br from-purple-900 via-red-900 to-amber-900',
  'bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900',
  'bg-gradient-to-br from-red-950 via-orange-900 to-amber-800',
];

// Hero images for slideshow
const heroImages = [
  heroImage1,
  heroImage2,
  heroImage3,
];

const services = [
  {
    title: 'Wedding Event Planning',
    description: 'Professional wedding planners specializing in traditional Indian weddings, destination weddings, and intimate ceremonies. Complete wedding management from decoration to catering.',
    icon: Sparkles,
  },
  {
    title: 'Corporate Event Management',
    description: 'Expert corporate event organizers for conferences, product launches, annual functions, and business celebrations. Professional event coordination for corporate success.',
    icon: Users,
  },
  {
    title: 'Religious & Private Celebrations',
    description: 'Specialized religious ceremony planning, birthday parties, anniversaries, and family celebrations. Traditional event organization with modern touches.',
    icon: Award,
  },
];

const testimonials = [
  {
    name: 'Priya & Raj Sharma',
    event: 'Wedding Ceremony',
    rating: 5,
    text: 'TSD Events made our dream wedding come true! Every detail was perfect, from the decor to the coordination. Our guests are still talking about how amazing it was.',
  },
  {
    name: 'Sunita Patel',
    event: 'Corporate Annual Meet',
    rating: 5,
    text: 'Professional, punctual, and perfect! They handled our 500+ guest corporate event flawlessly. The team is extremely organized and creative.',
  },
  {
    name: 'Amit Kumar',
    event: '50th Birthday Celebration',
    rating: 5,
    text: "Best decision ever! They transformed a simple party into a grand celebration. The attention to detail and creativity exceeded all our expectations.",
  },
];

const stats = [
  { number: '50+', label: 'Events Completed' },
  { number: '100+', label: 'Happy Clients' },
  { number: '5+', label: 'Years Experience' },
  { number: '98%', label: 'Satisfaction Rate' },
];

export function LandingPage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [galleryPhotos, setGalleryPhotos] = useState<any[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchGalleryPhotos = async () => {
      try {
        setLoadingPhotos(true);
        const photos = await pastEventOperations.getRandomPhotos(4);
        setGalleryPhotos(photos);
      } catch (error) {
        console.error('Error fetching gallery photos:', error);
        setGalleryPhotos([]);
      } finally {
        setLoadingPhotos(false);
      }
    };

    fetchGalleryPhotos();
  }, []);

  const heroSettings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    beforeChange: (_current: number, next: number) => setCurrentSlide(next),
  };

  const testimonialSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  return (
    <div className="bg-white">
      <SEOComponent 
        {...PAGE_SEO.home}
      />
      
      <section className="relative w-full h-screen overflow-hidden bg-gray-900">
        {/* Original Hero Images Background - CSS Background Style */}
        <div className="absolute inset-0">
          {heroImages.map((image, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: currentSlide === idx ? 1 : 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${image})` }}
              />
              
              {/* Dark Overlay for text readability */}
              <div className="absolute inset-0 bg-black/60" />
              
              {/* Gradient overlay for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            </motion.div>
          ))}
        </div>

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              Professional{' '}
              <span className="text-amber-400">Event Planning</span>{' '}
              Services India
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl mb-8 text-gray-200"
            >
              Premier wedding planners & corporate event organizers. 5+ years experience, 50+ successful celebrations across India. Expert event management for unforgettable memories.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={() => navigate('/contact')}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-6 rounded-full text-lg font-bold shadow-2xl hover:shadow-red-500/25 transition-all duration-300 border border-red-600/50 hover:border-red-500 transform hover:scale-105 hover:-translate-y-1"
              >
                <span className="flex items-center">
                  Contact Us
                  <ArrowRight className="ml-2 w-5 h-5" />
                </span>
              </Button>
              <Button
                onClick={() => navigate('/events')}
                className="bg-white/15 backdrop-blur-xl hover:bg-white/25 text-white border border-white/40 px-8 py-6 rounded-full text-lg font-semibold transition-all duration-300"
              >
                Explore Events
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-300 rounded-full ${
                currentSlide === idx
                  ? 'bg-amber-500 w-4 h-4'
                  : 'bg-white/50 w-3 h-3 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full -ml-40 -mb-40" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 border border-gray-200/50 backdrop-blur-sm hover:shadow-lg transition-shadow"
              >
                <h3 className="text-4xl md:text-5xl font-bold text-red-600 mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-800 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50/50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-amber-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Premium Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Expertly curated experiences tailored to your vision
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="group relative overflow-hidden rounded-3xl shadow-xl cursor-pointer bg-gradient-to-br from-red-800 to-red-900"
                  onClick={() => navigate('/services')}
                >
                  <div className="relative h-96 p-8 flex flex-col justify-end">
                    <div className="glass rounded-2xl p-6">
                      <div className="mb-3">
                        <Icon className="w-10 h-10 text-amber-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {service.title}
                      </h3>
                      <p className="text-gray-200 text-sm">{service.description}</p>
                      <div className="mt-3 flex items-center text-amber-400 group-hover:translate-x-2 transition-transform">
                        <span className="font-semibold text-sm">Learn More</span>
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-amber-400/10 rounded-full -ml-40 -mt-40 blur-3xl" />
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-red-500/5 rounded-full -mr-48 blur-3xl" />
        <div className="container mx-auto px-4 mb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Client Testimonials
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear what our happy clients have to say about their unforgettable events
            </p>
          </motion.div>
        </div>

        {/* Full-width testimonials slider */}
        <div className="relative z-10">
          <Slider {...testimonialSettings}>
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="w-full">
              <div className="bg-gradient-to-br from-white via-amber-50/40 to-orange-50/20 py-16 md:py-24 relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-red-400/10 rounded-full -ml-20 -mb-20 blur-3xl" />
                
                <div className="container mx-auto px-4 relative z-10">
                  <div className="max-w-4xl mx-auto flex flex-col justify-between min-h-[350px]">
                    {/* Quote Icon */}
                    <div className="mb-6">
                      <Quote className="w-14 h-14 text-amber-500/80" />
                    </div>

                    {/* Rating */}
                    <div className="flex gap-2 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.1 }}
                        >
                          <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-lg md:text-xl text-gray-700 mb-8 italic leading-relaxed flex-grow"
                    >
                      "{testimonial.text}"
                    </motion.p>

                    {/* Author Info */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="flex items-center gap-4 pt-6 border-t border-amber-200/30"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-16 h-16 rounded-full bg-red-700 flex items-center justify-center text-white text-xl font-bold shadow-lg flex-shrink-0"
                      >
                        {testimonial.name.charAt(0)}
                      </motion.div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-600 text-sm">{testimonial.event}</p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="py-20 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-40 right-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Event Gallery
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A glimpse of the magic we've created
            </p>
          </motion.div>

          {loadingPhotos ? (
            // Loading skeleton
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className="h-64 rounded-2xl bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          ) : galleryPhotos.length > 0 ? (
            // Gallery photos with lazy loading
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {galleryPhotos.map((photo, idx) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-lg group"
                  onClick={() => navigate('/events')}
                >
                  <OptimizedImage
                    src={photo.url}
                    alt={photo.alt_text}
                    className="w-full h-full object-cover"
                    lazy={true}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-sm bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                      View
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // No photos available
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">
                Gallery coming soon! Events photos will appear here.
              </p>
            </div>
          )}

          <div className="text-center">
            <Button
              onClick={() => navigate('/events')}
              className="bg-red-700/90 hover:bg-red-800/90 text-white px-8 py-6 rounded-full text-lg font-semibold shadow-xl border border-red-700/30"
            >
              View Full Gallery
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-700/95 via-red-700/90 to-red-700/95 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full -ml-40 -mb-40 blur-3xl" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Calendar className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Create Magic?
            </h2>
            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
              Let's turn your vision into reality. Get in touch today and start planning your dream event!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/contact')}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-12 py-6 rounded-full text-lg font-bold shadow-2xl hover:shadow-red-500/25 transition-all duration-300 border border-red-600/50 hover:border-red-500 transform hover:scale-105 hover:-translate-y-1"
              >
                <span className="flex items-center">
                  Contact Us
                  <ArrowRight className="ml-2 w-5 h-5" />
                </span>
              </Button>
              <Button
                onClick={() => navigate('/events')}
                className="bg-white/15 backdrop-blur-xl hover:bg-white/25 text-white border border-white/40 px-10 py-6 rounded-full text-lg font-semibold transition-all duration-300"
              >
                View Our Work
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
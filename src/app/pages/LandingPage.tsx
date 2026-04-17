import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import Slider from 'react-slick';
import { ArrowRight, Users, Award, Calendar, Star, Quote, MessageCircle, Phone, Mail, Heart, Sparkles, Crown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { OptimizedImage } from '../components/OptimizedImage';
import { SEOComponent, PAGE_SEO } from '../components/SEO-fallback';
import { supabase, pastEventOperations } from '../../supabase';

import { optimizeCloudinaryUrl } from '../utils/cloudinaryOptimizer';

// Cloudinary hero images for slideshow — responsive widths reduce bandwidth
const heroImages = [
  'https://res.cloudinary.com/djvccbmtx/image/upload/q_auto,f_auto,w_1200/v1775312300/1_pwqiu8.jpg',
  'https://res.cloudinary.com/djvccbmtx/image/upload/q_auto,f_auto,w_1200/v1775312301/2_pji1ep.webp',
  'https://res.cloudinary.com/djvccbmtx/image/upload/q_auto,f_auto,w_1200/v1775312302/3_ottjec.jpg',
];

// Cloudinary service card images
const weddingCardImage = 'https://res.cloudinary.com/djvccbmtx/image/upload/q_auto,f_auto,w_800/v1775312333/weddingcard_f0eq9x.jpg';
const corpCardImage = 'https://res.cloudinary.com/djvccbmtx/image/upload/q_auto,f_auto,w_800/v1775312333/corpcard_raxo2g.jpg';
const religiousCardImage = 'https://res.cloudinary.com/djvccbmtx/image/upload/q_auto,f_auto,w_800/v1775312333/religiousandbdaycard_ghaw71.jpg';

const services = [
  {
    title: 'Religious Events & Ceremonies',
    description: 'Our core expertise. We organize spectacular religious ceremonies, 99 Yatra, Updhan Tap, Chaturmas, Shibir, and deeply spiritual celebrations with perfect traditional reverence and grand scale. Specialization in jain events, jain relegious events',
    icon: Sparkles,
    image: 'https://res.cloudinary.com/djvccbmtx/image/upload/q_auto,f_auto,w_800/v1776109063/WhatsApp_Image_2024-03-04_at_11.46.18_PM_lvlk8i.jpg',
  },
  {
    title: 'Wedding Event Planning',
    description: 'Complete wedding management from decoration to catering for traditional and destination weddings.',
    icon: Heart,
    image: weddingCardImage,
  },
  {
    title: 'Corporate Event Management',
    description: 'Expert corporate event organizers for product launches and business celebrations.',
    icon: Users,
    image: corpCardImage,
  },
  {
    title: 'Private & Birthday Celebrations',
    description: 'Transforming birthdays and anniversaries into grand milestones with expert decoration.',
    icon: Crown,
    image: religiousCardImage,
  },
];

const testimonials = [
  {
    name: 'Priya & Raj Sharma',
    event: 'Wedding Ceremony',
    rating: 5,
    text: 'TSD Events & Decor made our dream wedding come true! Every detail was perfect, from the decor to the coordination. Our guests are still talking about how amazing it was.',
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
  { number: '500+', label: 'Events Managed' },
  { number: '300+', label: 'Happy Clients' },
  { number: '12+', label: 'Years Experience' },
  { number: '98%', label: 'Satisfaction Rate' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [galleryPhotos, setGalleryPhotos] = useState<any[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);

  // NEW DB STATES
  const [clientLogos, setClientLogos] = useState<any[]>([]);

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
        const { data, error } = await supabase
          .from('gallery_photos')
          .select('id, url, alt_text, gallery_batches(category)')
          .limit(40);
          
        if (error) throw error;
        
        const validPhotos = (data || []).map((photo: any) => ({
          id: photo.id,
          url: photo.url,
          alt_text: photo.alt_text || 'Event photo',
        }));
        
        // Shuffle and take 4
        const shuffled = validPhotos.sort(() => 0.5 - Math.random()).slice(0, 4);
        setGalleryPhotos(shuffled);
      } catch (error) {
        console.error('Error fetching gallery photos:', error);
        setGalleryPhotos([]);
      } finally {
        setLoadingPhotos(false);
      }
    };
    
    // Fetch DB Logos
    const fetchLogos = async () => {
      const { data } = await supabase.from('client_logos').select('*').order('created_at', { ascending: false });
      if (data) setClientLogos(data);
    };

    fetchGalleryPhotos();
    fetchLogos();
  }, []);

  // Premium SEO - JSON-LD Structured Data
  // NOTE: LocalBusiness schema is already defined STATICALLY in index.html.
  // Adding it here again causes "multiple aggregate ratings" error in Google Search Console.
  useEffect(() => {
    // FAQ Schema for common searches
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is TSD Events and Decor?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'TSD Events & Decor is a premier event management and decoration company providing services across India. With 12+ years of experience and 500+ events managed, we specialize in wedding planning, corporate events, religious ceremonies, and celebration décor.',
          },
        },
        {
          '@type': 'Question',
          name: 'What services does TSD Events & Decor provide?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'TSD Events & Decor provides comprehensive services including wedding event planning (Kankotri Lekhan, Haldi, Mehndi, Sangit, Entry, Whole Decoration), corporate event management (Exhibition, Brand Launch, Store Inauguration, Annual Function), religious ceremony planning (99 Yatra, Chaturmas, Shibir), and decoration services (Birthday Party, Mandap Decoration, Engagement, Baby Shower, Anniversary).',
          },
        },
        {
          '@type': 'Question',
          name: 'How can I contact TSD Events and Decor?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can contact TSD Events & Decor at +91 98254 13606 (phone/WhatsApp), email info@tsdevents.in, or visit our office at 3, Jamnasagar Flats, opp. Dharmeshwar Mahadev Road, Sabarmati, Ahmedabad, Gujarat 380005. We are open Monday-Saturday 9AM-7PM.',
          },
        },
        {
          '@type': 'Question',
          name: 'What areas does TSD Events & Decor serve?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'TSD Events & Decor serves clients across India. We flawlessly handle local, national, and destination events throughout the country.',
          },
        },
      ],
    };

    // Service Schema
    const serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Event Management and Decoration',
      provider: {
        '@type': 'LocalBusiness',
        name: 'TSD Events & Decor',
        url: 'https://tsdevents.in',
      },
      areaServed: [
        { '@type': 'City', name: 'Ahmedabad' },
        { '@type': 'State', name: 'Gujarat' },
        { '@type': 'Country', name: 'India' },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Event Management Services',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Wedding Event Planning' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Corporate Event Management' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Religious Ceremony Planning' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Event Decoration Services' } },
        ],
      },
    };

    // Inject only page-specific schemas (LocalBusiness is in index.html)
    const schemas = [faqSchema, serviceSchema];

    schemas.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(schema);
      script.setAttribute('data-seo-landing', `schema-${index}`);
      document.head.appendChild(script);
    });

    // Cleanup
    return () => {
      document.head.querySelectorAll('script[data-seo-landing]').forEach((script) => {
        script.remove();
      });
    };
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
              {/* Background Image — only load non-LCP slides when visible */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={idx === 0 || currentSlide === idx || currentSlide === idx - 1
                  ? { backgroundImage: `url(${image})` }
                  : undefined
                }
                data-bg={image}
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
          <div className="text-center text-white px-4 max-w-4xl py-8 sm:py-0">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Best <span className="text-amber-400">Event Management in Ahmedabad</span> & Across India
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base xs:text-lg sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-6 sm:mb-8 text-gray-200 leading-relaxed max-w-3xl mx-auto"
            >
              TSD Events - Professional Jain Event Management in Ahmedabad. From weddings to corporate events — we create unforgettable experiences. 12+ years of excellence, 500+ successful celebrations.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={() => window.open('https://wa.me/919825413606?text=Hi%2C%20I%20want%20to%20plan%20an%20event.%20Can%20you%20share%20details%3F', '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-10 py-4 sm:py-6 rounded-md text-base sm:text-lg font-semibold shadow-lg transition-all duration-300"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Get Free Quote on WhatsApp
              </Button>
              <Button
                onClick={() => {
                  navigate('/contact');
                  setTimeout(() => {
                    const el = document.getElementById('contact-details');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 300);
                }}
                className="bg-red-800 hover:bg-red-900 text-white px-6 sm:px-8 py-4 sm:py-6 rounded-md text-base sm:text-lg font-semibold shadow-lg transition-all duration-300"
              >
                <Phone className="mr-2 w-5 h-5" />
                Contact Us
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
              className={`transition-all duration-300 ${
                currentSlide === idx
                  ? 'bg-red-800 w-8 h-2 rounded-sm'
                  : 'bg-white/50 w-2 h-2 rounded-sm hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <h3 className="text-3xl xs:text-4xl sm:text-4xl md:text-5xl font-bold text-red-800 mb-2">
                  {stat.number}
                </h3>
                <p className="text-base xs:text-base sm:text-lg text-gray-700 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl xs:text-4xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              TSD Events - Best Event Management in Ahmedabad
            </h2>
            <p className="text-base xs:text-lg sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Premier event management & decoration services for all occasions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Main Mission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-3 bg-white p-8 md:p-12 border-l-4 border-red-800"
            >
              <h3 className="text-xl xs:text-2xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Our Mission
              </h3>
              <p className="text-base xs:text-base sm:text-lg md:text-lg text-gray-700 leading-relaxed">
                TSD Events & Decor - Best event management in Ahmedabad, offering end-to-end event management and décor solutions. Specialists in Jain event management, wedding planning, corporate events, and religious ceremonies. With 12+ years of excellence and 500+ successful celebrations, we transform every occasion into a seamless and memorable celebration.
              </p>
            </motion.div>

            {/* Services Specialization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="lg:col-span-2 bg-white p-8 border-l-4 border-amber-500"
            >
              <h3 className="text-xl xs:text-2xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Our Expertise - Jain Event Management Specialists
              </h3>
              <p className="text-base xs:text-base sm:text-lg md:text-lg text-gray-700 leading-relaxed">
                Specializing in Jain event management in Ahmedabad, we offer comprehensive event management services including <span className="font-semibold text-red-700">Jain weddings, religious ceremonies (99 Yatra, Chaturmas, Oli), corporate events, and celebrations</span>. Expert event management in Ahmedabad & across India.
              </p>
            </motion.div>

            {/* Our Process */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-1 bg-white p-8 border-l-4 border-red-800"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Our Promise
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                From concept to execution, our team ensures every detail is handled with professionalism and care, delivering customized experiences that reflect your vision and style.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - Let's Plan Your Dream Event */}
      <section className="py-16 bg-amber-500 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Let's Plan Your Dream Event
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Ready to create something extraordinary? Our expert team is here to bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.open('https://wa.me/919825413606?text=Hi%2C%20I%20want%20to%20plan%20an%20event.%20Can%20you%20share%20details%3F', '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-md text-lg font-semibold shadow-lg transition-all duration-300"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Contact on WhatsApp
              </Button>
              <Button
                onClick={() => window.location.href = 'mailto:info@tsdevents.in'}
                className="bg-white hover:bg-gray-100 text-amber-600 px-8 py-4 rounded-md text-lg font-semibold shadow-lg transition-all duration-300"
              >
                <Mail className="mr-2 w-5 h-5" />
                Write an Email
              </Button>
              <Button
                onClick={() => window.location.href = 'tel:+919825413606'}
                className="bg-red-800 hover:bg-red-900 text-white px-8 py-4 rounded-md text-lg font-semibold shadow-lg transition-all duration-300"
              >
                <Phone className="mr-2 w-5 h-5" />
                Call Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Expertly curated experiences tailored to your vision
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: idx * 0.15, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className={`group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg h-[400px]`}
                  onClick={() => navigate('/services')}
                >
                  {/* Image Container with creative scaling and panning */}
                  <div className="absolute inset-0 w-full h-full">
                    <motion.div
                      className="w-full h-full bg-cover bg-center origin-center"
                      style={{ backgroundImage: `url(${service.image})` }}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: idx % 2 === 0 ? 1 : -1
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>

                  {/* Dual layered gradient for sleek contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-red-900/40 opacity-0 group-hover:opacity-100 mix-blend-multiply transition-opacity duration-500" />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <motion.div 
                      className="transform translate-y-0 md:translate-y-8 md:group-hover:translate-y-0 transition-transform duration-500 ease-out"
                    >
                      <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-400/20 backdrop-blur-sm border border-amber-400/30 text-amber-400 group-hover:bg-amber-400 group-hover:text-black transition-all duration-500 shadow-[0_0_15px_rgba(251,191,36,0)] group-hover:shadow-[0_0_20px_rgba(251,191,36,0.5)]">
                        <Icon className="w-6 h-6" />
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3 tracking-wide">
                        {service.title}
                      </h3>
                      
                      <div className="overflow-hidden">
                        <p className="text-gray-200 text-sm leading-relaxed opacity-100 md:opacity-0 md:group-hover:opacity-100 transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-500 delay-100 ease-out h-auto md:h-0 md:group-hover:h-auto mb-4">
                          {service.description}
                        </p>
                      </div>

                      <div className="flex items-center text-amber-400 font-semibold text-sm uppercase tracking-wider mb-0 md:mb-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-200">
                        <span>Explore Service</span>
                        <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Animated Border Glow */}
                  <div className="absolute inset-0 border-2 border-white/0 group-hover:border-amber-400/30 rounded-2xl transition-colors duration-500 pointer-events-none" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Ambient Static Blobs in the Background (Optimized for Performance) */}
        <div 
          className="absolute top-1/2 left-1/4 w-96 h-96 bg-amber-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none transform -translate-y-1/2" 
        />
        <div 
          className="absolute top-1/2 right-1/4 w-96 h-96 bg-red-800/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none transform -translate-y-1/2" 
        />

        <div className="container mx-auto px-4 mb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center space-x-2 text-amber-500 font-semibold tracking-wider uppercase mb-4 text-sm">
              <Star className="w-4 h-4 fill-amber-500" />
              <span>Words of Love</span>
              <Star className="w-4 h-4 fill-amber-500" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 drop-shadow-sm" style={{ fontFamily: 'Playfair Display, serif' }}>
              Client Testimonials
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from our unforgettable celebrations
            </p>
          </motion.div>
        </div>

        {/* Centralized Testimonial Carousel */}
        <div className="relative z-10 container mx-auto px-4 max-w-5xl">
          <Slider {...testimonialSettings}>
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="w-full px-2 md:px-6 outline-none py-10">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white/70 backdrop-blur-xl border border-white p-8 md:p-14 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden"
              >
                {/* Giant Quote Icon Background Decal */}
                <Quote className="absolute -top-6 -left-6 w-48 h-48 text-gray-100 rotate-180 -z-10 opacity-60" />
                
                <div className="flex flex-col items-center text-center min-h-[300px]">
                  {/* Rating Badge */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-1 mb-8 bg-white py-2 px-5 rounded-full shadow-sm border border-gray-100"
                  >
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-sm" />
                    ))}
                  </motion.div>

                  {/* Testimonial Text */}
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl md:text-3xl text-gray-800 italic leading-relaxed flex-grow font-medium" 
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    "{testimonial.text}"
                  </motion.p>

                  {/* Author Info connecting bridge */}
                  <div className="w-16 h-1 bg-gradient-to-r from-transparent via-red-800/30 to-transparent my-8" />

                  {/* Author Details with floating avatar */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-800 blur-md rounded-full opacity-30 animate-pulse" />
                      <div className="w-16 h-16 bg-gradient-to-br from-red-800 to-red-900 flex items-center justify-center text-white text-xl font-bold rounded-full relative shadow-lg ring-4 ring-white">
                        {testimonial.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg tracking-wide uppercase">
                        {testimonial.name}
                      </h4>
                      <p className="text-amber-600 font-medium text-sm tracking-widest uppercase mt-1">
                        {testimonial.event}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          ))}
          </Slider>
        </div>
      </section>

      {/* Client Logos Marquee Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Our Trusted Clients
            </h2>
            <p className="text-lg text-gray-600">
              Proud to work with leading organizations and businesses
            </p>
          </motion.div>

          {/* Marquee Container - Two Rows Moving Opposite Directions */}
          <div className="mx-auto w-full max-w-7xl relative">
            {/* Left Edge Shadow Fade */}
            <div className="absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            {/* Right Edge Shadow Fade */}
            <div className="absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            
            {clientLogos.length > 0 ? (
              <>
                {/* First Row - Moving Left */}
                <div className="relative overflow-hidden py-6">
                  <motion.div 
                    className="flex gap-8 w-max"
                    animate={{ x: ["-50%", "0%"] }}
                    transition={{
                      repeat: Infinity,
                      ease: "linear",
                      duration: Math.max(20, Math.ceil(clientLogos.length / 2) * 3)
                    }}
                  >
                    {[...Array(Math.max(2, Math.ceil(15 / Math.ceil(clientLogos.length / 2))))].flatMap(() => 
                      clientLogos.slice(0, Math.ceil(clientLogos.length / 2))
                    ).map((logo, index) => (
                      <div 
                        key={`row1-${logo.id}-${index}`} 
                        className="min-w-[180px] flex items-center justify-center transition-all duration-500 cursor-pointer"
                      >
                        <img 
                          src={logo.image_url} 
                          alt={logo.alt_text} 
                          className="h-28 object-contain scale-90 hover:scale-105 transition-transform duration-500 drop-shadow-sm"
                        />
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Second Row - Moving Right (Opposite Direction) */}
                <div className="relative overflow-hidden py-6">
                  <motion.div 
                    className="flex gap-8 w-max"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                      repeat: Infinity,
                      ease: "linear",
                      duration: Math.max(20, Math.ceil(clientLogos.length / 2) * 3)
                    }}
                  >
                    {[...Array(Math.max(2, Math.ceil(15 / Math.ceil(clientLogos.length / 2))))].flatMap(() => 
                      clientLogos.slice(Math.ceil(clientLogos.length / 2))
                    ).map((logo, index) => (
                      <div 
                        key={`row2-${logo.id}-${index}`} 
                        className="min-w-[180px] flex items-center justify-center transition-all duration-500 cursor-pointer"
                      >
                        <img 
                          src={logo.image_url} 
                          alt={logo.alt_text} 
                          className="h-28 object-contain scale-90 hover:scale-105 transition-transform duration-500 drop-shadow-sm"
                        />
                      </div>
                    ))}
                  </motion.div>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400 py-10">Client logos being updated...</div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Our Event Gallery
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A glimpse of the events we've created
            </p>
          </motion.div>

          {loadingPhotos ? (
            // Loading skeleton
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className="h-64 bg-gray-200 animate-pulse"
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
                  whileHover={{ scale: 1.02 }}
                  className="relative h-64 overflow-hidden cursor-pointer group"
                  onClick={() => navigate('/gallery')}
                >
                  <OptimizedImage
                    src={photo.url}
                    alt={photo.alt_text}
                    className="w-full h-full object-cover"
                    lazy={true}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-sm bg-black/50 px-4 py-2">
                      View Gallery
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // No photos available
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">
                Gallery coming soon! Event photos will appear here.
              </p>
            </div>
          )}

          <div className="text-center">
            <Button
              onClick={() => navigate('/gallery')}
              className="bg-red-800 hover:bg-red-900 text-white px-8 py-6 rounded-md text-lg font-semibold shadow-lg"
            >
              View Full Gallery
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-800 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Calendar className="w-14 h-14 text-amber-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Ready to Create Your Event?
            </h2>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Let's turn your vision into reality. Get in touch today and start planning your dream event.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.open('https://wa.me/919825413606?text=Hi%2C%20I%20want%20to%20plan%20an%20event.%20Can%20you%20share%20details%3F', '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white px-10 py-6 rounded-md text-lg font-semibold shadow-lg transition-all duration-300"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Get Quote on WhatsApp
              </Button>
              <Button
                onClick={() => navigate('/contact')}
                className="bg-white hover:bg-gray-100 text-red-800 px-10 py-6 rounded-md text-lg font-semibold shadow-lg transition-all duration-300"
              >
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
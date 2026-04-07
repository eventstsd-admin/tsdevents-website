import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import Slider from 'react-slick';
import { ArrowRight, Users, Award, Calendar, Star, Quote, MessageCircle, Phone, Mail, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { OptimizedImage } from '../components/OptimizedImage';
import { SEOComponent, PAGE_SEO } from '../components/SEO-fallback';
import { pastEventOperations } from '../../supabase';

import { optimizeCloudinaryUrl } from '../utils/cloudinaryOptimizer';

// Cloudinary hero images for slideshow
const heroImages = [
  'https://res.cloudinary.com/djvccbmtx/image/upload/v1775312300/1_pwqiu8.jpg',
  'https://res.cloudinary.com/djvccbmtx/image/upload/v1775312301/2_pji1ep.webp',
  'https://res.cloudinary.com/djvccbmtx/image/upload/v1775312302/3_ottjec.jpg',
];

// Cloudinary service card images
const weddingCardImage = 'https://res.cloudinary.com/djvccbmtx/image/upload/v1775312333/weddingcard_f0eq9x.jpg';
const corpCardImage = 'https://res.cloudinary.com/djvccbmtx/image/upload/v1775312333/corpcard_raxo2g.jpg';
const religiousCardImage = 'https://res.cloudinary.com/djvccbmtx/image/upload/v1775312333/religiousandbdaycard_ghaw71.jpg';

const services = [
  {
    title: 'Wedding Event Planning',
    description: 'Professional wedding planners specializing in traditional Indian weddings, destination weddings, and intimate ceremonies. Complete wedding management from decoration to catering.',
    icon: Heart,
    image: weddingCardImage,
  },
  {
    title: 'Corporate Event Management',
    description: 'Expert corporate event organizers for conferences, product launches, annual functions, and business celebrations. Professional event coordination for corporate success.',
    icon: Users,
    image: corpCardImage,
  },
  {
    title: 'Religious & Private Celebrations',
    description: 'Specialized religious ceremony planning, birthday parties, anniversaries, and family celebrations. Traditional event organization with modern touches.',
    icon: Award,
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

  // Premium SEO - JSON-LD Structured Data
  useEffect(() => {
    // 1. Review Schema anchored to LocalBusiness
    const reviewSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': 'https://tsdevents.in',
      name: 'TSD Events & Decor',
      url: 'https://tsdevents.in',
      telephone: '+919825413606',
      email: 'info@tsdevents.in',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '3, Jamnasagar Flats, opp. Dharmeshwar Mahadev Road, Sabarmati Society, Dharmnagar',
        addressLocality: 'Ahmedabad',
        addressRegion: 'Gujarat',
        postalCode: '380005',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 23.0787576,
        longitude: 72.5917318,
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        bestRating: '5',
        worstRating: '1',
        ratingCount: '300',
      },
      review: [
        {
          '@type': 'Review',
          author: { '@type': 'Person', name: 'Priya & Raj Sharma' },
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          reviewBody: 'TSD Events & Decor made our dream wedding come true! Every detail was perfect, from the decor to the coordination. Our guests are still talking about how amazing it was.',
        },
        {
          '@type': 'Review',
          author: { '@type': 'Person', name: 'Sunita Patel' },
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          reviewBody: 'Professional, punctual, and perfect! They handled our 500+ guest corporate event flawlessly. The team is extremely organized and creative.',
        },
        {
          '@type': 'Review',
          author: { '@type': 'Person', name: 'Amit Kumar' },
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          reviewBody: 'Best decision ever! They transformed a simple party into a grand celebration. The attention to detail and creativity exceeded all our expectations.',
        },
      ],
    };

    // 2. FAQ Schema for common searches
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is TSD Events and Decor?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'TSD Events & Decor is a premier event management and decoration company based in Ahmedabad, Gujarat, India. With 12+ years of experience and 500+ events managed, we specialize in wedding planning, corporate events, religious ceremonies, and celebration décor.',
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
            text: 'TSD Events & Decor primarily serves Ahmedabad and all of Gujarat, India. We also handle destination events across India.',
          },
        },
      ],
    };

    // 3. Service Schema
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

    // Create and append all schemas
    const schemas = [reviewSchema, faqSchema, serviceSchema];

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
          <div className="text-center text-white px-4 max-w-4xl py-8 sm:py-0">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Exceptional{' '}
              <span className="text-amber-400">Event Management</span>{' '}
              in Ahmedabad
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8 text-gray-200 leading-relaxed max-w-3xl mx-auto"
            >
              From weddings to corporate events — we create unforgettable experiences. 
              12+ years of excellence, 500+ successful celebrations across India.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={() => window.open('https://wa.me/919825413606?text=Hi%2C%20I%20want%20to%20plan%20an%20event.%20Can%20you%20share%20details%3F', '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white px-10 py-6 rounded-md text-lg font-semibold shadow-lg transition-all duration-300"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Get Free Quote on WhatsApp
              </Button>
              <Button
                onClick={() => navigate('/events')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-6 rounded-md text-lg font-semibold transition-all duration-300"
              >
                View Our Events
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
                <h3 className="text-4xl md:text-5xl font-bold text-red-800 mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-700 font-medium">{stat.label}</p>
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
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              About TSD Events & Decor
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your trusted partner for creating unforgettable experiences
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
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Our Mission
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                TSD Events & Decor is your trusted partner for creating unforgettable experiences, offering end-to-end event management and décor solutions in Ahmedabad. With a commitment to creativity, precision, and excellence, we transform every occasion into a seamless and memorable celebration.
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
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Our Expertise
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                We specialize in a wide range of services, including <span className="font-semibold text-red-700">weddings, corporate events, religious functions, exhibitions, and digital marketing solutions</span> making us a true one-stop destination for all your event needs.
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="group relative overflow-hidden cursor-pointer"
                  onClick={() => navigate('/services')}
                >
                  <div className="relative h-[450px]">
                    {/* Background Image */}
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="mb-4">
                        <Icon className="w-10 h-10 text-amber-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {service.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-4">{service.description}</p>
                      <div className="flex items-center text-amber-400 group-hover:translate-x-2 transition-transform">
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
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4 mb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Client Testimonials
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear what our clients have to say about their events
            </p>
          </motion.div>
        </div>

        {/* Full-width testimonials slider */}
        <div className="relative z-10">
          <Slider {...testimonialSettings}>
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="w-full">
              <div className="bg-white py-16 md:py-20 relative">
                
                <div className="container mx-auto px-4 relative z-10">
                  <div className="max-w-4xl mx-auto flex flex-col justify-between min-h-[300px]">
                    {/* Quote Icon */}
                    <div className="mb-6">
                      <Quote className="w-12 h-12 text-red-800" />
                    </div>

                    {/* Rating */}
                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-lg md:text-xl text-gray-700 mb-8 italic leading-relaxed flex-grow">
                      "{testimonial.text}"
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                      <div className="w-14 h-14 bg-red-800 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-600 text-sm">{testimonial.event}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
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
                  onClick={() => navigate('/events')}
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
              onClick={() => navigate('/events')}
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
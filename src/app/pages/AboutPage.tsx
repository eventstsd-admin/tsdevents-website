import { motion } from 'motion/react';
import { Target, Heart, Users, Briefcase, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { Button } from '../components/ui/button';
import { SEOComponent, PAGE_SEO } from '../components/SEO-fallback';
import aboutHeroImage from '../images/Hero Fallback/About us/about us.jpg';

// Cloudinary URL
const aboutHeroUrl = 'https://res.cloudinary.com/djvccbmtx/image/upload/v1775312256/about_us_z7oifs.webp';
const aboutHeroImageToUse = aboutHeroUrl;

const team = [
  {
    name: 'Timir Shah',
    role: 'Founder',
    image: 'https://res.cloudinary.com/djvccbmtx/image/upload/v1775468412/Shah_Timir_-_Founder_pkdhp0.jpg',
  },
  {
    name: 'Riddhi Shah',
    role: 'Decorator & Designer',
    image: 'https://res.cloudinary.com/djvccbmtx/image/upload/v1775468411/Shah_Riddhi_-_Event_Designer_Creative_Designer_1_uoloma.jpg',
  },
  {
    name: 'Niral Patel',
    role: 'Event Head',
    image: 'https://res.cloudinary.com/djvccbmtx/image/upload/v1775468411/Patel_Niral_-_Event_Head_vgrzwn.jpg',
  },
  {
    name: 'Tulsi Raval',
    role: 'Accountant / Designer',
    image: 'https://res.cloudinary.com/djvccbmtx/image/upload/v1775468411/Raval_Tulsi_-_Account_Head_Back_Office_Head_Event_Designer_1_agcz3q.jpg',
  },
  {
    name: 'Ronak Raval',
    role: 'Event Manager',
    image: 'https://res.cloudinary.com/djvccbmtx/image/upload/v1775468411/Raval_Ronak_-_Event_Manager_adjfeq.jpg',
  },
  {
    name: 'Roohi Ravat',
    role: 'Graphic Designer',
    image: 'https://res.cloudinary.com/djvccbmtx/image/upload/v1775468411/Ravat_Roohi_-_Graphic_Designer_h03433.jpg',
  },
];

const achievements = [
  { icon: Users, number: '300+', label: 'Happy Clients' },
  { icon: Calendar, number: '500+', label: 'Events Managed' },
  { icon: Briefcase, number: '12+', label: 'Years in Business' },
];

const values = [
  {
    icon: Target,
    title: 'Excellence',
    description: 'We strive for perfection in every detail of your event',
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'We pour our hearts into creating memorable experiences',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'We work closely with you to bring your vision to life',
  },
];

export default function AboutPage() {
  const navigate = useNavigate();

  // Add Premium JSON-LD Structured Data for SEO (hidden from frontend)
  useEffect(() => {
    // 1. LOCAL BUSINESS SCHEMA - Critical for "event management in india"
    const localBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': ['LocalBusiness', 'EventPlanningBusiness'],
      '@id': 'https://tsdeventsanddecor.com',
      name: 'TSD Events & Decor',
      alternateName: ['TSD Events', 'TSD Decor', 'TSD Event Management'],
      description: 'Best event management company in India | Professional wedding planners and corporate event organizers | Premier event decoration services',
      url: 'https://tsdeventsanddecor.com',
      telephone: '+91-XXXX-XXXX-XXXX',
      email: 'contact@tsdeventsanddecor.com',
      foundingDate: '2013',
      foundingLocation: {
        '@type': 'Place',
        name: 'India',
      },
      areaServed: [
        {
          '@type': 'Country',
          name: 'India',
        },
        {
          '@type': 'State',
          name: 'Gujarat',
        },
        {
          '@type': 'City',
          name: 'Surat',
        },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '450',
        bestRating: '5',
        worstRating: '1',
      },
      priceRange: '₹2 Lakh - ₹50 Lakh',
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'Customer Service',
          telephone: '+91-XXXX-XXXX-XXXX',
          email: 'contact@tsdeventsanddecor.com',
          availableLanguageId: ['en', 'gu'],
          areaServed: 'India',
        },
      ],
      sameAs: [
        'https://www.facebook.com/tsdeventsanddecor',
        'https://www.instagram.com/tsdeventsanddecor',
        'https://www.youtube.com/@tsdeventsanddecor',
      ],
      image: {
        '@type': 'ImageObject',
        url: 'https://tsdeventsanddecor.com/logo.png',
        width: 500,
        height: 500,
      },
    };

    // 2. ORGANIZATION WITH SERVICES SCHEMA
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://tsdeventsanddecor.com',
      name: 'TSD Events & Decor - Event Planning & Management Company India',
      url: 'https://tsdeventsanddecor.com',
      description: 'Leading event management company in India specializing in wedding planning, corporate events, and event decoration services',
      foundingDate: '2013',
      numberOfEmployees: 5,
      knowsAbout: [
        'Event Planning',
        'Event Management',
        'Wedding Planning',
        'Corporate Event Management',
        'Event Decoration',
        'Venue Selection',
        'Catering Coordination',
        'Entertainment Booking',
        'Destination Weddings',
        'Religious Ceremonies',
        'Birthday Celebrations',
        'Anniversary Events',
      ],
      hasOfferingDetails: [
        {
          '@type': 'Offer',
          name: 'Wedding Event Planning',
          description: 'Professional wedding planning services including traditional Indian weddings and destination weddings',
          url: 'https://tsdeventsanddecor.com/services/weddings',
        },
        {
          '@type': 'Offer',
          name: 'Corporate Event Management',
          description: 'Expert corporate event organization for conferences, product launches, and corporate functions',
          url: 'https://tsdeventsanddecor.com/services/corporate',
        },
        {
          '@type': 'Offer',
          name: 'Event Decoration',
          description: 'Professional event decoration and décor design services',
          url: 'https://tsdeventsanddecor.com/services/decoration',
        },
      ],
    };

    // 3. BREADCRUMB LIST SCHEMA
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://tsdeventsanddecor.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'About',
          item: 'https://tsdeventsanddecor.com/about',
        },
      ],
    };

    // 4. SERVICE SCHEMA - Multiple Services
    const servicesSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'TSD Events & Decor Event Management Services',
      hasService: [
        {
          '@type': 'Service',
          name: 'Wedding Event Planning in India',
          description: 'Professional wedding planning services for traditional Indian weddings, destination weddings, and intimate ceremonies across India',
          provider: { '@type': 'Organization', name: 'TSD Events & Decor' },
          areaServed: 'India',
          availableLanguage: ['en', 'gu'],
          serviceType: 'Event Planning',
        },
        {
          '@type': 'Service',
          name: 'Corporate Event Management',
          description: 'Expert corporate event organization including conferences, product launches, team building events, and business celebrations',
          provider: { '@type': 'Organization', name: 'TSD Events & Decor' },
          areaServed: 'India',
          serviceType: 'Event Management',
        },
        {
          '@type': 'Service',
          name: 'Event Decoration Services',
          description: 'Professional event decoration and décor design for all types of celebrations and corporate functions',
          provider: { '@type': 'Organization', name: 'TSD Events & Decor' },
          areaServed: 'India',
          serviceType: 'Decoration',
        },
        {
          '@type': 'Service',
          name: 'Religious & Private Celebration Planning',
          description: 'Specialized religious ceremony planning including birthday parties, anniversaries, and family celebrations',
          provider: { '@type': 'Organization', name: 'TSD Events & Decor' },
          areaServed: 'India',
          serviceType: 'Event Planning',
        },
      ],
    };

    // 5. TEAM MEMBERS - Enhanced Schema
    const teamSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'TSD Events & Decor Professional Team',
      member: [
        {
          '@type': 'Person',
          name: 'Timir Shah',
          jobTitle: 'Founder & CEO - Event Planning Expert',
          worksFor: { '@type': 'Organization', name: 'TSD Events & Decor' },
          expertise: ['Event Planning', 'Event Management', 'Wedding Planning'],
        },
        {
          '@type': 'Person',
          name: 'Riddhi Shah',
          jobTitle: 'Decoration & Design Specialist',
          worksFor: { '@type': 'Organization', name: 'TSD Events & Decor' },
          expertise: ['Event Decoration', 'Interior Design', 'Creative Design', 'Décor Consulting'],
        },
        {
          '@type': 'Person',
          name: 'Ronak Raval',
          jobTitle: 'Event Supervisor & Coordinator',
          worksFor: { '@type': 'Organization', name: 'TSD Events & Decor' },
          expertise: ['Event Coordination', 'Project Management', 'Vendor Management'],
        },
        {
          '@type': 'Person',
          name: 'Tulsi Raval',
          jobTitle: 'Accountant & Designer',
          worksFor: { '@type': 'Organization', name: 'TSD Events & Decor' },
          expertise: ['Finance Management', 'Budget Planning', 'Event Design'],
        },
        {
          '@type': 'Person',
          name: 'Niral Patel',
          jobTitle: 'Event Head',
          worksFor: { '@type': 'Organization', name: 'TSD Events & Decor' },
          expertise: ['Event Planning', 'Event Coordination', 'Team Leadership'],
        },
        {
          '@type': 'Person',
          name: 'Roohi Ravat',
          jobTitle: 'Graphic Designer',
          worksFor: { '@type': 'Organization', name: 'TSD Events & Decor' },
          expertise: ['Graphic Design', 'Visual Design', 'Event Branding'],
        },
      ],
    };

    // 6. ABOUT PAGE SCHEMA - Enhanced
    const aboutPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About TSD Events & Decor - Best Event Management Company in India',
      description: 'Learn about TSD Events & Decor - India\'s leading event planning and management company with 500+ events managed and 12+ years of expertise',
      url: 'https://tsdeventsanddecor.com/about',
      datePublished: '2013-01-01',
      mainEntity: {
        '@type': 'LocalBusiness',
        '@id': 'https://tsdeventsanddecor.com',
        name: 'TSD Events & Decor',
        description: 'Professional event planning and management company in India',
        foundingDate: '2013',
        numberOfEmployees: 5,
        areaServed: { '@type': 'Country', name: 'India' },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          ratingCount: '450',
        },
      },
    };

    // 7. AGGREGATE OFFER - For all services
    const aggregateOfferSchema = {
      '@context': 'https://schema.org',
      '@type': 'AggregateOffer',
      name: 'Event Management Services in India',
      description: 'Complete event management solutions including wedding planning, corporate events, decoration and coordination',
      priceCurrency: 'INR',
      lowPrice: '200000',
      highPrice: '5000000',
      offerCount: 4,
      offers: [
        {
          '@type': 'Offer',
          name: 'Wedding Events',
          price: '500000',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
        },
        {
          '@type': 'Offer',
          name: 'Corporate Events',
          price: '300000',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
        },
        {
          '@type': 'Offer',
          name: 'Decoration Services',
          price: '200000',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
        },
        {
          '@type': 'Offer',
          name: 'Private Celebrations',
          price: '250000',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
        },
      ],
    };

    // 8. FAQ SCHEMA - Common questions
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the best event management company in India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'TSD Events & Decor is one of the leading event management companies in India with 12+ years of expertise, 500+ events managed, and a 4.9/5 customer rating.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does event planning cost in India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Event planning costs in India range from ₹2 Lakh to ₹50 Lakh depending on the type and scale of the event. TSD Events & Decor offers customized packages for all budgets.',
          },
        },
        {
          '@type': 'Question',
          name: 'What services does TSD Events & Decor provide?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'TSD Events & Decor provides comprehensive event management services including wedding planning, corporate event management, event decoration, venue selection, catering coordination, and entertainment booking.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you plan destination weddings in India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, TSD Events & Decor specializes in destination wedding planning across India with full coordination and decoration services.',
          },
        },
      ],
    };

    // Create and append all schema scripts
    const schemas = [
      localBusinessSchema,
      organizationSchema,
      breadcrumbSchema,
      servicesSchema,
      teamSchema,
      aboutPageSchema,
      aggregateOfferSchema,
      faqSchema,
    ];

    schemas.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(schema);
      script.setAttribute('data-schema', schema['@type'] || `schema-${index}`);
      document.head.appendChild(script);
    });

    // Cleanup
    return () => {
      document.head.querySelectorAll('script[data-schema]').forEach((script) => {
        script.remove();
      });
    };
  }, []);

  return (
    <div className="bg-white">
      <SEOComponent {...PAGE_SEO.about} />
      
      {/* Hero Section */}
      <section className="relative min-h-[40vh] sm:h-[50vh] text-white flex items-center justify-center pt-16 sm:pt-20">
        <div className="absolute inset-0">
          {/* Background Image */}
          <motion.div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${aboutHeroImageToUse})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60" />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-full sm:max-w-4xl w-full sm:w-11/12 mx-auto py-8 sm:py-0">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          >
            About TSD Events & Decor
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300"
          >
            Professional event planners and décor specialists creating unforgettable celebrations
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">TSD Events & Decor - Professional Event Planners & Décor Specialists Since 2013</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Founded in 2013, TSD Events & Decor began as India's premier event planning and décor company with a vision to transform ordinary celebrations into extraordinary memories. Starting as a dedicated team of professional event planners and décor specialists, we've grown into one of India's most trusted wedding and corporate event management companies.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Over the past decade, we've successfully organized 500+ events across India, including luxury weddings, corporate conferences, religious ceremonies, and private celebrations. Our expertise spans traditional Indian weddings, destination wedding planning, corporate event management, and specialized religious ceremony coordination.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                As certified event planning professionals, we combine traditional Indian event expertise with modern project management. Our comprehensive services include venue selection, decoration design, catering coordination, entertainment booking, and complete event production - making us your single point of contact for all celebration needs.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 shadow-sm text-center border-t-4 border-red-800"
                >
                  <div className="bg-red-800 w-14 h-14 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Achievements</h2>
            <p className="text-xl text-gray-600">Milestones that inspire us</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {achievements.map((achievement, idx) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="bg-amber-500 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900 mb-2">
                    {achievement.number}
                  </h3>
                  <p className="text-gray-600">{achievement.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">
              The passionate people behind every successful event
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-7xl mx-auto">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white overflow-hidden shadow-sm group"
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
                <div className="p-3 text-center">
                  <h3 className="text-sm font-bold text-gray-900 mb-0.5">{member.name}</h3>
                  <p className="text-xs text-red-800 font-medium">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Work With Us?
            </h2>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Let's create something amazing together. Get in touch today.
            </p>
            <Button
              onClick={() => navigate('/contact')}
              className="bg-white text-red-800 hover:bg-gray-100 px-10 py-6 rounded-md text-lg font-semibold shadow-lg"
            >
              Contact Us
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
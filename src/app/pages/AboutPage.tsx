import { motion } from 'motion/react';
import { Target, Heart, Users, Briefcase, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Button } from '../components/ui/button';
import { SEOComponent, PAGE_SEO } from '../components/SEO-fallback';
// Cloudinary URL
const aboutHeroUrl = 'https://res.cloudinary.com/djvccbmtx/image/upload/v1775312256/about_us_z7oifs.webp';
const aboutHeroImageToUse = aboutHeroUrl;

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
  const [team, setTeam] = useState<any[]>([]);

  useEffect(() => {
    async function fetchTeam() {
      const { data } = await supabase.from('team_members').select('*').order('sort_order', { ascending: true });
      if (data) setTeam(data);
    }
    fetchTeam();
  }, []);

  // Add page-specific JSON-LD Structured Data for SEO
  // NOTE: LocalBusiness entity is defined ONLY on the homepage to avoid
  // "multiple aggregate ratings" validation errors from Google.
  useEffect(() => {
    // 1. BREADCRUMB LIST SCHEMA
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://tsdevents.in',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'About',
          item: 'https://tsdevents.in/about',
        },
      ],
    };

    // 2. TEAM MEMBERS SCHEMA
    const teamSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'TSD Events & Decor',
      url: 'https://tsdevents.in',
      member: [
        {
          '@type': 'Person',
          name: 'Timir Shah',
          jobTitle: 'Founder',
          worksFor: { '@type': 'Organization', name: 'TSD Events & Decor' },
        },
        {
          '@type': 'Person',
          name: 'Riddhi Shah',
          jobTitle: 'Decorator & Designer',
          worksFor: { '@type': 'Organization', name: 'TSD Events & Decor' },
        },
        {
          '@type': 'Person',
          name: 'Niraj Patel',
          jobTitle: 'Event Head',
          worksFor: { '@type': 'Organization', name: 'TSD Events & Decor' },
        },
        {
          '@type': 'Person',
          name: 'Tulsi Raval',
          jobTitle: 'Accountant / Designer',
          worksFor: { '@type': 'Organization', name: 'TSD Events & Decor' },
        },
        {
          '@type': 'Person',
          name: 'Ronak Raval',
          jobTitle: 'Event Manager',
          worksFor: { '@type': 'Organization', name: 'TSD Events & Decor' },
        },
        {
          '@type': 'Person',
          name: 'Roohi Ravat',
          jobTitle: 'Graphic Designer',
          worksFor: { '@type': 'Organization', name: 'TSD Events & Decor' },
        },
      ],
    };

    // 5. ABOUT PAGE SCHEMA
    const aboutPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About TSD Events & Decor - Best Event Management Company Across India',
      description: 'Learn about TSD Events & Decor - India\'s leading event planning and decoration company with 500+ events managed and 12+ years of expertise',
      url: 'https://tsdevents.in/about',
      mainEntity: {
        '@type': 'LocalBusiness',
        '@id': 'https://tsdevents.in',
        name: 'TSD Events & Decor',
      },
    };

    // Create and append all schema scripts
    const schemas = [
      breadcrumbSchema,
      teamSchema,
      aboutPageSchema,
    ];

    schemas.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(schema);
      script.setAttribute('data-schema', `about-schema-${index}`);
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
      <section className="relative min-h-[40vh] sm:h-[50vh] overflow-hidden text-white flex items-center justify-center pt-16 sm:pt-20">
        <div className="absolute inset-0">
          {/* Background Image */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${aboutHeroImageToUse})` }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
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
            Best Event Management in Ahmedabad - TSD Events & Decor
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300"
          >
            Professional Jain event management & décor specialists creating unforgettable celebrations in Ahmedabad
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
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">TSD Events & Decor - Best Event Management in Ahmedabad Since 2013</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Founded in 2013, TSD Events & Decor is Ahmedabad's premier event management and decoration company. Specializing in Jain event management, we transform celebrations into extraordinary memories. Our team of professional event planners and décor specialists has established a reputation as one of India's most trusted event management companies.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                With 12+ years of experience, we've successfully organized 500+ events across India, including Jain religious ceremonies (99 Yatra, Chaturmas, Oli), luxury weddings, corporate events, and private celebrations. As specialists in Jain event management in Ahmedabad, our expertise spans traditional ceremonies, destination wedding planning, and comprehensive event management solutions.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                As certified event planning professionals, we combine traditional Indian and Jain event expertise with modern project management. Our comprehensive services include venue selection, decoration design, catering coordination, entertainment booking, and complete event production - making us your trusted partner for the best event management in Ahmedabad.
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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 max-w-7xl mx-auto">
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
                    src={member.image_url || member.image}
                    alt={member.name}
                    loading="lazy"
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
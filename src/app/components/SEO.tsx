import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'business.business';
  locale?: string;
  siteName?: string;
  author?: string;
  structuredData?: object;
}

// Target Keywords for TSD Events
const DEFAULT_KEYWORDS = [
  // Primary Keywords
  'event planning services',
  'wedding event organizer',
  'corporate event management',
  'professional event planner',
  
  // Location-based Keywords  
  'event planner India',
  'wedding planner Mumbai',
  'corporate events Delhi',
  'event management company',
  
  // Service-specific Keywords
  'wedding decoration services',
  'religious ceremony organizer',
  'birthday party planner',
  'anniversary celebration planner',
  
  // Industry Keywords
  'event coordination services',
  'venue decoration',
  'event production company',
  'celebration management',
  
  // Long-tail Keywords
  'professional wedding event organizer India',
  'corporate event planning services Mumbai',
  'religious ceremony event management',
  'best event planner for weddings'
];

const DEFAULT_SEO = {
  siteName: 'TSD Events & Decor - Premier Event Planning Services',
  title: 'TSD Events & Decor | Professional Wedding & Corporate Event Planners India',
  description: 'Premier event planning services in India. Expert wedding planners, corporate event organizers, and celebration specialists. 10+ years experience, 500+ successful events. Contact us for unforgettable celebrations.',
  keywords: DEFAULT_KEYWORDS,
  image: '/src/app/images/logo without text.png',
  url: 'https://tsdevents.com',
  author: 'TSD Events & Decor Team',
  locale: 'en_IN'
};

export const SEOComponent: React.FC<SEOProps> = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  locale = DEFAULT_SEO.locale,
  siteName = DEFAULT_SEO.siteName,
  author = DEFAULT_SEO.author,
  structuredData
}) => {
  const seoTitle = title ? `${title} | ${DEFAULT_SEO.siteName}` : DEFAULT_SEO.title;
  const seoDescription = description || DEFAULT_SEO.description;
  const seoKeywords = [...DEFAULT_KEYWORDS, ...keywords].join(', ');
  const seoImage = image || DEFAULT_SEO.image;
  const seoUrl = url || DEFAULT_SEO.url;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="title" content={seoTitle} />
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content={author} />
      {/* Performance and Indexing */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      
      {/* Geographic and Local SEO */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.country" content="India" />
      <meta name="geo.placename" content="Mumbai, Maharashtra" />
      <meta name="ICBM" content="19.0760, 72.8777" />
      
      {/* Mobile and App */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=yes" />
      
      {/* Content and Copyright */}
      <meta name="copyright" content="TSD Events & Decor" />
      <meta name="abstract" content="Professional event planning and décor services across India" />
      <meta name="topic" content="Event Planning, Wedding Planning, Corporate Events, Décor" />
      <meta name="summary" content="Expert event management and décor services for weddings, corporate functions, religious ceremonies and celebrations" />
      <meta name="classification" content="Business Services" />
      <meta name="designer" content="TSD Events & Decor" />
      <meta name="reply-to" content="contact@tsdevents.com" />
      <meta name="owner" content="TSD Events & Decor" />
      <meta name="url" content={seoUrl} />
      <meta name="identifier-URL" content={seoUrl} />
      <meta name="directory" content="submission" />
      <meta name="category" content="Event Planning Services" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      <meta name="revisit-after" content="7 days" />
      <meta name="subtitle" content="Professional Event Management India" />
      <meta name="target" content="all" />
      <meta name="audience" content="all" />
      
      {/* Social Media Optimization */}
      <meta property="business:contact_data:locality" content="Mumbai" />
      <meta property="business:contact_data:region" content="Maharashtra" />
      <meta property="business:contact_data:country_name" content="India" />
      <meta property="business:hours:day" content="monday,tuesday,wednesday,thursday,friday,saturday" />
      <meta property="business:hours:start" content="09:00" />
      <meta property="business:hours:end" content="18:00" />
      
      {/* Page-specific Schema Markup */}
      <meta name="page-topic" content={keywords} />
      <meta name="page-type" content={type} />
      
      {/* Performance Hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://images.unsplash.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      
      {/* Verification Tags (if needed) */}
      {/* <meta name="google-site-verification" content="your-verification-code" /> */}
      {/* <meta name="msvalidate.01" content="your-bing-verification-code" /> */}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:locale" content={locale} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@tsdevents" />
      <meta name="twitter:creator" content="@tsdevents" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#fbbf24" />
      <meta name="msapplication-TileColor" content="#fbbf24" />
      
      
      {/* Canonical URL */}
      <link rel="canonical" href={seoUrl} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Additional Business Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://tsdevents.com/#organization",
              "name": "TSD Events & Decor",
              "alternateName": "The Special Day Events & Decor",
              "url": "https://tsdevents.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://tsdevents.com/logo.png",
                "width": 300,
                "height": 100
              },
              "description": "Professional event planning, management, and décor services across India specializing in weddings, corporate events, religious ceremonies, and celebrations.",
              "foundingDate": "2013",
              "slogan": "Creating Unforgettable Moments",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-9876543210",
                "contactType": "customer service",
                "areaServed": "IN",
                "availableLanguage": ["English", "Hindi", "Marathi"]
              },
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Mumbai",
                "addressRegion": "Maharashtra", 
                "addressCountry": "India"
              },
              "sameAs": [
                "https://www.instagram.com/tsdevents",
                "https://www.facebook.com/tsdevents",
                "https://www.linkedin.com/company/tsdevents"
              ]
            },
            {
              "@type": "LocalBusiness",
              "@id": "https://tsdevents.com/#business",
              "name": "TSD Events & Decor",
              "image": "https://tsdevents.com/logo.png",
              "telephone": "+91-9876543210",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Mumbai",
                "addressRegion": "Maharashtra",
                "postalCode": "400001",
                "addressCountry": "India"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 19.0760,
                "longitude": 72.8777
              },
              "url": "https://tsdevents.com",
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  "opens": "09:00",
                  "closes": "18:00"
                }
              ],
              "priceRange": "₹₹₹",
              "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "UPI", "Bank Transfer"],
              "currenciesAccepted": "INR"
            },
            {
              "@type": "Service",
              "@id": "https://tsdevents.com/#services",
              "serviceType": "Event Planning and Management",
              "provider": {
                "@id": "https://tsdevents.com/#organization"
              },
              "areaServed": {
                "@type": "Country",
                "name": "India"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Event Planning Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Wedding Planning",
                      "description": "Complete wedding planning and coordination services"
                    }
                  },
                  {
                    "@type": "Offer", 
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Corporate Event Management",
                      "description": "Professional corporate event planning and execution"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service", 
                      "name": "Religious Ceremony Organization",
                      "description": "Traditional religious ceremony planning and coordination"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Event Decoration",
                      "description": "Creative decoration and venue transformation services"
                    }
                  }
                ]
              }
            }
          ]
        })}
      </script>
    </Helmet>
  );
};

// Page-specific SEO configurations
export const PAGE_SEO = {
  home: {
    title: 'Professional Event Planning Services India',
    description: 'TSD Events & Decor - India\'s premier event planning company. Specializing in weddings, corporate events, religious ceremonies, decorations. 10+ years experience, 500+ successful events. Free consultation available.',
    keywords: [
      'best event planner India',
      'top wedding planner',
      'professional event organizer',
      'event planning company India',
      'wedding event services',
      'corporate event specialist'
    ]
  },
  
  about: {
    title: 'About TSD Events & Decor - Professional Event Planners Since 2013',
    description: 'Learn about TSD Events & Decor - India\'s trusted event planning and décor team since 2013. Expert event organizers with 500+ successful weddings, corporate events, and celebrations. Meet our experienced team.',
    keywords: [
      'TSD Events & Decor history',
      'professional event planning team',
      'experienced wedding planners',
      'event management expertise',
      'certified event organizers India'
    ]
  },
  
  services: {
    title: 'Event Planning Services - Weddings, Corporate & Religious Events',
    description: 'Comprehensive event planning services: Wedding planning, Corporate events, Religious ceremonies, Birthday parties, Anniversary celebrations. Professional decoration, catering, and venue management.',
    keywords: [
      'wedding planning services',
      'corporate event management',
      'religious ceremony planning',
      'birthday party organizer',
      'anniversary event planning',
      'venue decoration services',
      'event catering services'
    ]
  },
  
  gallery: {
    title: 'Event Gallery - TSD Events & Decor Portfolio & Past Celebrations',
    description: 'Explore TSD Events & Decor portfolio - stunning photos of our weddings, corporate events, and celebrations. See our decoration work, venue setups, and successful event management.',
    keywords: [
      'event portfolio India',
      'wedding decoration gallery',
      'corporate event photos',
      'event planning examples',
      'celebration photography',
      'venue decoration ideas'
    ]
  },
  
  contact: {
    title: 'Contact TSD Events & Decor - Professional Event Planners India',
    description: 'Contact TSD Events & Decor for professional event planning and décor services. Free consultation for weddings, corporate events, and celebrations. Call now or book online. Serving all of India.',
    keywords: [
      'contact event planner',
      'event planning consultation',
      'wedding planner contact',
      'event organizer booking',
      'event planning quote',
      'celebration planning services'
    ]
  },
  
  pastEvents: {
    title: 'Past Events - TSD Events & Decor Success Stories & Client Reviews',
    description: 'Discover TSD Events & Decor past celebrations - 500+ successful weddings, corporate events, and parties. Read client testimonials and see our event planning expertise in action.',
    keywords: [
      'TSD Events & Decor past projects',
      'successful event planning',
      'client testimonials events',
      'event planning case studies',
      'celebration success stories'
    ]
  }
};

// Business Structured Data
export const BUSINESS_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "EventPlanner",
  "name": "TSD Events & Decor",
  "alternateName": "TSD Event Management & Décor",
  "description": "Professional event planning and décor services specializing in weddings, corporate events, and celebrations across India.",
  "url": "https://tsdevents.com",
  "logo": "https://tsdevents.com/logo.png",
  "image": "https://tsdevents.com/hero-image.jpg",
  "telephone": "+91-XXXXXXXXXX",
  "email": "contact@tsdevents.com",
  "foundingDate": "2013",
  "numberOfEmployees": "25-50",
  "slogan": "Creating Unforgettable Events",
  
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IN",
    "addressRegion": "Maharashtra",
    "addressLocality": "Mumbai"
  },
  
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "19.0760",
    "longitude": "72.8777"
  },
  
  "openingHours": "Mo-Sa 09:00-18:00",
  
  "serviceArea": {
    "@type": "Country",
    "name": "India"
  },
  
  "services": [
    {
      "@type": "Service",
      "name": "Wedding Planning",
      "description": "Complete wedding planning and coordination services"
    },
    {
      "@type": "Service", 
      "name": "Corporate Event Management",
      "description": "Professional corporate event planning and execution"
    },
    {
      "@type": "Service",
      "name": "Religious Ceremony Planning", 
      "description": "Traditional and religious ceremony organization"
    },
    {
      "@type": "Service",
      "name": "Party Planning",
      "description": "Birthday parties, anniversaries, and celebration planning"
    }
  ],
  
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  },
  
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Priya Sharma"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "reviewBody": "TSD Events & Decor made our wedding absolutely magical. Professional team, stunning decorations, flawless execution. Highly recommended!"
    }
  ],
  
  "sameAs": [
    "https://www.facebook.com/tsdevents",
    "https://www.instagram.com/tsdevents",
    "https://www.linkedin.com/company/tsdevents",
    "https://twitter.com/tsdevents"
  ]
};
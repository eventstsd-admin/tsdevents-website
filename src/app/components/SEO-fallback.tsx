// Temporary fallback SEO component until react-helmet-async is installed
import React from 'react';

export const SEOComponent = ({ children, ...props }: any) => {
  // Fallback component that doesn't use Helmet
  // Just sets document title for now
  React.useEffect(() => {
    if (props.title) {
      document.title = props.title;
    }
  }, [props.title]);

  return null;
};

// Existing PAGE_SEO configurations (keeping them)
export const PAGE_SEO = {
  home: {
    title: 'Professional Event Planning Services India',
    description: 'TSD Events - India\'s premier event planning company. Specializing in weddings, corporate events, religious ceremonies. 10+ years experience, 500+ successful events. Free consultation available.',
    keywords: 'event planning India, wedding planner India, corporate events, event management company, professional event planners, wedding services Mumbai, celebration planning',
    type: 'website',
    image: 'https://tsdevents.com/og-image-home.jpg'
  },
  about: {
    title: 'About TSD Events - Professional Event Planners India',
    description: 'Learn about TSD Events - experienced event planning company in India. 10+ years expertise in wedding planning, corporate events, religious ceremonies. Meet our professional team of event coordinators.',
    keywords: 'about TSD events, event planning company India, professional event planners, wedding planner team, event management expertise, experienced event coordinators',
    type: 'website',
    image: 'https://tsdevents.com/og-image-about.jpg'
  },
  services: {
    title: 'Event Planning Services - Wedding, Corporate & Religious Events',
    description: 'Comprehensive event planning services in India. Wedding planning, corporate event management, religious ceremonies, decorations. Professional event coordination and planning solutions.',
    keywords: 'event planning services, wedding planning India, corporate event management, religious ceremony planning, event decoration, professional event coordination',
    type: 'website', 
    image: 'https://tsdevents.com/og-image-services.jpg'
  },
  gallery: {
    title: 'Event Photo Gallery - Wedding & Corporate Event Portfolio',
    description: 'Browse TSD Events photo gallery showcasing successful weddings, corporate events, religious ceremonies and celebrations. Professional event planning portfolio across India.',
    keywords: 'event photo gallery, wedding portfolio India, corporate event photos, event planning gallery, successful events portfolio, wedding photography',
    type: 'website',
    image: 'https://tsdevents.com/og-image-gallery.jpg'
  },
  contact: {
    title: 'Contact TSD Events - Professional Event Planners India',
    description: 'Contact TSD Events for professional event planning services. Wedding planners, corporate event management, religious ceremonies. Free consultation. Mumbai, Maharashtra, India.',
    keywords: 'contact event planner, wedding planner contact India, event planning consultation, professional event management contact, Mumbai event planners',
    type: 'website',
    image: 'https://tsdevents.com/og-image-contact.jpg'
  },
  pastEvents: {
    title: 'Past Events Portfolio - Successfully Managed Events India',
    description: 'Explore TSD Events portfolio of successfully managed events across India. Wedding celebrations, corporate functions, religious ceremonies and special occasions.',
    keywords: 'past events portfolio, successful events India, wedding portfolio, corporate events portfolio, event planning experience, managed events showcase',
    type: 'website',
    image: 'https://tsdevents.com/og-image-past-events.jpg'
  }
};
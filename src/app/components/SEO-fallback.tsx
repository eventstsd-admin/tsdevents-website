// Temporary fallback SEO component until react-helmet-async is installed
import React from 'react';

export const SEOComponent = ({ title, description, keywords, image, type }: any) => {
  // Enhanced SEO component that injects meta tags
  React.useEffect(() => {
    if (title) {
      document.title = title;
    }

    // Remove and recreate meta tags to ensure they're updated
    const existingMeta = document.head.querySelectorAll('[data-seo-meta]');
    existingMeta.forEach((tag) => tag.remove());

    // Set meta description
    if (description) {
      const metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      metaDescription.content = description;
      metaDescription.setAttribute('data-seo-meta', 'true');
      document.head.appendChild(metaDescription);
    }

    // Set meta keywords
    if (keywords) {
      const metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      metaKeywords.content = keywords;
      metaKeywords.setAttribute('data-seo-meta', 'true');
      document.head.appendChild(metaKeywords);
    }

    // Set og:title
    if (title) {
      const ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      ogTitle.content = title;
      ogTitle.setAttribute('data-seo-meta', 'true');
      document.head.appendChild(ogTitle);
    }

    // Set og:description
    if (description) {
      const ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      ogDesc.content = description;
      ogDesc.setAttribute('data-seo-meta', 'true');
      document.head.appendChild(ogDesc);
    }

    // Set og:image
    if (image) {
      const ogImage = document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      ogImage.content = image;
      ogImage.setAttribute('data-seo-meta', 'true');
      document.head.appendChild(ogImage);
    }

    // Set og:type
    if (type) {
      const ogType = document.createElement('meta');
      ogType.setAttribute('property', 'og:type');
      ogType.content = type;
      ogType.setAttribute('data-seo-meta', 'true');
      document.head.appendChild(ogType);
    }

    // Set robots meta tag
    const robotsMeta = document.createElement('meta');
    robotsMeta.name = 'robots';
    robotsMeta.content = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
    robotsMeta.setAttribute('data-seo-meta', 'true');
    document.head.appendChild(robotsMeta);

    // Set language
    const langMeta = document.createElement('meta');
    langMeta.httpEquiv = 'content-language';
    langMeta.content = 'en-IN';
    langMeta.setAttribute('data-seo-meta', 'true');
    document.head.appendChild(langMeta);

  }, [title, description, keywords, image, type]);

  return null;
};

// Premium SEO configurations with keywords targeting "event management in india"
export const PAGE_SEO = {
  home: {
    title: 'TSD Events & Decor',
    description: 'TSD Events & Decor - India\'s #1 event management company specializing in wedding planning, corporate events, and professional décor. 12+ years, 500+ events, 300+ happy clients. Get free consultation.',
    keywords: 'event management India, event management company India, best event manager, wedding event management, corporate event management, event planning services, professional event organizers, wedding planners India, corporate event planners, event decoration India, event management services, celebration planning, event coordination India, Indian wedding planner',
    type: 'website',
    image: 'https://tsdeventsanddecor.com/og-image-home.jpg'
  },
  about: {
    title: 'TSD Events & Decor',
    description: 'TSD Events & Decor - Leading event management company in India with 12+ years expertise. Professional wedding planners, corporate event managers, and décor specialists. 500+ successful events managed. Meet our expert team.',
    keywords: 'event management company India, professional event managers, experienced event planners, event management team, wedding management services, corporate event management company, event planning professionals, event organizers India, event coordination services, event management expertise, professional décor designers, event supervision, Timir Shah, Riddhi Shah, Ronak Raval',
    type: 'website',
    image: 'https://tsdeventsanddecor.com/og-image-about.jpg'
  },
  services: {
    title: 'TSD Events & Decor',
    description: 'Complete event management services in India. Professional wedding planning, corporate event management, event decoration, venue selection. Expert event coordinators. Free consultation available.',
    keywords: 'event management services, event management India, wedding management, corporate event management, event planning services, event decoration services, event coordination, wedding services, corporate event planning, celebration management, event supervision, venue management, catering coordination, professional event management',
    type: 'website',
    image: 'https://tsdeventsanddecor.com/og-image-services.jpg'
  },
  gallery: {
    title: 'TSD Events & Decor',
    description: 'Browse TSD Events & Decor portfolio showcasing 500+ successfully managed events in India. Wedding events, corporate celebrations, religious ceremonies. Professional event management showcase.',
    keywords: 'event management portfolio, event management success stories, wedding portfolio, corporate event portfolio, event management examples, past events, event management experience, successful celebrations, wedding management portfolio, event coordination examples',
    type: 'website',
    image: 'https://tsdeventsanddecor.com/og-image-gallery.jpg'
  },
  contact: {
    title: 'TSD Events & Decor',
    description: 'Contact TSD Events & Decor for professional event management services in India. Complete wedding planning, corporate events, celebrations. Free consultation. Call now for event management quotes.',
    keywords: 'event management contact, event manager contact India, professional event management consultation, wedding management contact, corporate event management consultation, event planning inquiry, event management quote, contact event manager',
    type: 'website',
    image: 'https://tsdeventsanddecor.com/og-image-contact.jpg'
  },
  pastEvents: {
    title: 'TSD Events & Decor',
    description: 'Explore TSD Events & Decor portfolio of 500+ successfully managed events across India. Wedding celebrations, corporate functions, religious ceremonies organized with excellence.',
    keywords: 'past events, event management portfolio, successful events, wedding events portfolio, corporate event management, event portfolio showcase, managed events, event management success stories, celebration portfolio',
    type: 'website',
    image: 'https://tsdeventsanddecor.com/og-image-past-events.jpg'
  }
};
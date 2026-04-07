// Enhanced SEO component that injects meta tags dynamically per page
import React from 'react';

const SITE_URL = 'https://tsdevents.in';

export const SEOComponent = ({ title, description, keywords, image, type, canonicalPath }: any) => {
  React.useEffect(() => {
    if (title) {
      document.title = title;
    }

    // Remove and recreate meta tags to ensure they're updated
    const existingMeta = document.head.querySelectorAll('[data-seo-meta]');
    existingMeta.forEach((tag) => tag.remove());

    // Remove existing canonical
    const existingCanonical = document.head.querySelector('link[data-seo-canonical]');
    if (existingCanonical) existingCanonical.remove();

    // Set canonical URL
    if (canonicalPath !== undefined) {
      const canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = `${SITE_URL}${canonicalPath}`;
      canonical.setAttribute('data-seo-canonical', 'true');
      document.head.appendChild(canonical);
    }

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

    // Set robots
    const robotsMeta = document.createElement('meta');
    robotsMeta.name = 'robots';
    robotsMeta.content = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
    robotsMeta.setAttribute('data-seo-meta', 'true');
    document.head.appendChild(robotsMeta);

    // ===== Open Graph Tags =====
    const ogTags: Record<string, string> = {
      'og:title': title || 'TSD Events & Decor',
      'og:description': description || '',
      'og:type': type || 'website',
      'og:url': `${SITE_URL}${canonicalPath || ''}`,
      'og:image': image || `${SITE_URL}/icon.svg`,
      'og:site_name': 'TSD Events & Decor',
      'og:locale': 'en_IN',
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      if (content) {
        const meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.content = content;
        meta.setAttribute('data-seo-meta', 'true');
        document.head.appendChild(meta);
      }
    });

    // ===== Twitter Card Tags =====
    const twitterTags: Record<string, string> = {
      'twitter:card': 'summary_large_image',
      'twitter:title': title || 'TSD Events & Decor',
      'twitter:description': description || '',
      'twitter:image': image || `${SITE_URL}/icon.svg`,
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      if (content) {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        meta.setAttribute('data-seo-meta', 'true');
        document.head.appendChild(meta);
      }
    });

    // Language meta
    const langMeta = document.createElement('meta');
    langMeta.httpEquiv = 'content-language';
    langMeta.content = 'en-IN';
    langMeta.setAttribute('data-seo-meta', 'true');
    document.head.appendChild(langMeta);

  }, [title, description, keywords, image, type, canonicalPath]);

  return null;
};

// ===== Page-specific SEO Configurations =====
// Each page has a UNIQUE title optimized for "TSD event and decor" + page-specific keywords
export const PAGE_SEO = {
  home: {
    title: 'TSD Events & Decor | Best Event Management & Decoration Company in Ahmedabad',
    description: 'TSD Events & Decor - Ahmedabad\'s #1 event management and decoration company. Wedding planning, corporate events, religious ceremonies, celebration décor. 12+ years, 500+ events, 300+ happy clients. Free consultation: +91 98254 13606.',
    keywords: 'TSD events and decor, TSD event and decor, event management Ahmedabad, best event management company Ahmedabad, wedding planner Ahmedabad, corporate event management Gujarat, event decoration Ahmedabad, wedding decoration, religious event planning, birthday decoration, mandap decoration, event organizer Ahmedabad Gujarat India',
    type: 'website',
    image: `${SITE_URL}/icon.svg`,
    canonicalPath: '/',
  },
  about: {
    title: 'About TSD Events & Decor | Premier Event Planners in Ahmedabad Since 2013',
    description: 'About TSD Events & Decor - Leading event management and decoration company in Ahmedabad, Gujarat with 12+ years expertise. Professional wedding planners, corporate event managers, and décor specialists. 500+ successful events. Meet our expert team.',
    keywords: 'about TSD events and decor, TSD event and decor team, event management company Ahmedabad, professional event managers Gujarat, experienced event planners, wedding management services Ahmedabad, Timir Shah event planner, event planning professionals India',
    type: 'website',
    image: `${SITE_URL}/icon.svg`,
    canonicalPath: '/about',
  },
  services: {
    title: 'Event Management & Decoration Services | TSD Events & Decor Ahmedabad',
    description: 'Complete event management and decoration services by TSD Events & Decor in Ahmedabad. Wedding planning, corporate events, religious ceremonies, birthday decoration, mandap decoration, engagement décor. Expert event coordinators. Free consultation.',
    keywords: 'TSD event services, event management services Ahmedabad, wedding planning services Gujarat, corporate event management, event decoration services, mandap decoration Ahmedabad, birthday party decoration, engagement decoration, baby shower decoration, anniversary decoration, exhibition management, brand launch event, Kankotri Lekhan, Haldi ceremony, Mehndi decoration, Sangit planning',
    type: 'website',
    image: `${SITE_URL}/icon.svg`,
    canonicalPath: '/services',
  },
  gallery: {
    title: 'Event Gallery & Portfolio | TSD Events & Decor Ahmedabad',
    description: 'Browse TSD Events & Decor portfolio showcasing 500+ successfully managed events in Ahmedabad and Gujarat. Wedding events, corporate celebrations, religious ceremonies, decoration projects. Professional event photography.',
    keywords: 'TSD events gallery, event management portfolio Ahmedabad, wedding portfolio Gujarat, corporate event portfolio, event decoration portfolio, event photography, past events TSD, celebration photos, wedding decoration photos',
    type: 'website',
    image: `${SITE_URL}/icon.svg`,
    canonicalPath: '/gallery',
  },
  contact: {
    title: 'Contact TSD Events & Decor | Free Event Consultation in Ahmedabad',
    description: 'Contact TSD Events & Decor for professional event management and decoration services in Ahmedabad, Gujarat. Free consultation for weddings, corporate events, celebrations. Call +91 98254 13606 or WhatsApp us. Visit our office in Sabarmati, Ahmedabad.',
    keywords: 'contact TSD events and decor, event management consultation Ahmedabad, wedding planner contact Gujarat, TSD events phone number, event planner WhatsApp, free event consultation, book event planner Ahmedabad',
    type: 'website',
    image: `${SITE_URL}/icon.svg`,
    canonicalPath: '/contact',
  },
  pastEvents: {
    title: 'Our Past Events & Celebrations | TSD Events & Decor Ahmedabad',
    description: 'Explore TSD Events & Decor portfolio of 500+ successfully managed events across Ahmedabad and Gujarat. Wedding celebrations, corporate functions, religious ceremonies organized with excellence and stunning décor.',
    keywords: 'TSD past events, event management portfolio Ahmedabad, successful events Gujarat, wedding events portfolio, corporate event success stories, event management showcase, celebration portfolio, managed events India',
    type: 'website',
    image: `${SITE_URL}/icon.svg`,
    canonicalPath: '/events',
  },
};
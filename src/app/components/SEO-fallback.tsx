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
    title: 'TSD Events & Decor | Best Event Management & Decoration Company in India',
    description: 'TSD Events & Decor - India\'s #1 event management and decoration company. Specialized in Jain events, 99 Yatra, Updhan Tap, wedding planning, corporate events, and religious ceremonies. 12+ years expertise. Free consultation: +91 98254 13606.',
    keywords: 'TSD Events, TSD Decor, best jain event organizers in india, pavitra 99 yatra planners india, dharmik chaturmas management, traditional jain shibir organizers, top jain dharam mahotsav agency near me, grand updhan tap planners in india, best event management company india, wedding decoration, religious event planning, aatham planning services, oli tour operators, jain sangh events, bus yatra pravas organizers india, TSD events and decor',
    type: 'website',
    image: `${SITE_URL}/icon.svg`,
    canonicalPath: '/',
  },
  about: {
    title: 'About TSD Events & Decor | Premier Event Planners Across India Since 2013',
    description: 'About TSD Events & Decor - Leading event management and decoration company across India with 12+ years expertise. Professional wedding planners, corporate event managers, and religious event décor specialists. Meet our expert team.',
    keywords: 'about TSD events and decor, premium jain event planners, traditional religious event professionals, authentic chhari palit sangh organizers, expert religious ceremony decorators, experienced event planners, wedding management services india, Timir Shah event planner, event planning professionals India',
    type: 'website',
    image: `${SITE_URL}/icon.svg`,
    canonicalPath: '/about',
  },
  services: {
    title: 'Event Management & Decoration Services | TSD Events & Decor India',
    description: 'Complete event management and decoration services by TSD Events & Decor across India. Specialized in religious ceremonies (99 Yatra, Updhan Tap, Chaturmas), wedding planning, corporate events, and large-scale mandap decoration. Free consultation.',
    keywords: 'TSD event services, jain shibir planners in india, grand jain dharam mahotsav management, top 99 yatra planners, pavitra diksha mahotsav agency in india, traditional aatham organizers, divine oli planners, expert chaturmas management, wedding planning services india, corporate event management, event decoration services, mandap decoration india, engagement decoration, baby shower decoration, Kankotri Lekhan, Haldi ceremony',
    type: 'website',
    image: `${SITE_URL}/icon.svg`,
    canonicalPath: '/services',
  },
  gallery: {
    title: 'Event Gallery & Portfolio | TSD Events & Decor India',
    description: 'Browse TSD Events & Decor portfolio showcasing 500+ successfully managed events across India. Wedding events, corporate celebrations, religious ceremonies, decoration projects. Professional event photography.',
    keywords: 'TSD events gallery, event management portfolio india, wedding portfolio india, corporate event portfolio, event decoration portfolio, event photography, past events TSD, celebration photos, wedding decoration photos',
    type: 'website',
    image: `${SITE_URL}/icon.svg`,
    canonicalPath: '/gallery',
  },
  contact: {
    title: 'Contact TSD Events & Decor | Free Event Consultation Across India',
    description: 'Contact TSD Events & Decor for professional event management and decoration services across India. Free consultation for weddings, corporate events, celebrations. Call +91 98254 13606 or WhatsApp us. Visit our office in Sabarmati, Ahmedabad.',
    keywords: 'contact TSD events and decor, event management consultation india, wedding planner contact india, TSD events phone number, event planner WhatsApp, free event consultation, book event planner india',
    type: 'website',
    image: `${SITE_URL}/icon.svg`,
    canonicalPath: '/contact',
  },

};
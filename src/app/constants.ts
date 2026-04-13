// ============================================
// CENTRALIZED CONSTANTS - Single Source of Truth
// ============================================
export const CATEGORIES_WITH_SUBCATEGORIES: Record<string, string[]> = {
  'Wedding': [
    'Kankotri Lekhan',
    'Haldi',
    'Mehndi',
    'Sangit',
    'Entry',
    'Whole Decoration',
  ],
  'Religious': [
    '99 Yatra',
    'Updhan Tap',
    'Chaturmas',
    'Shibir',
    'Aatham',
    'Oli',
    'Chhari Palit Sangh',
  ],
  'Corporate Event': [
    'Exhibition',
    'Brand Launch',
    'Store Inauguration',
    'Branding',
    'Annual Function',
    'Get Together',
    'Festival Celebration',
  ],
  'Decoration': [
    'Birthday Party',
    'Mandap Decoration',
    'Engagement Decoration',
    'Baby Shower',
    'Anniversary Decoration',
  ],
  'Tours and Travels': [
    'Bus Sangh',
    'Bus Train Place Sangh',
    'Jain Tours',
    'Group Tours',
  ],
  'Other': [],
};

export const CATEGORIES = Object.keys(CATEGORIES_WITH_SUBCATEGORIES);
export const ALL_SUBCATEGORIES = Object.values(CATEGORIES_WITH_SUBCATEGORIES).flat();

export const getSubcategories = (category: string): string[] => 
  CATEGORIES_WITH_SUBCATEGORIES[category] || [];

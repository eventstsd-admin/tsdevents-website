import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================
// CENTRALIZED CATEGORIES - Single Source of Truth
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
    'Bus - Train - Plain Yatra Pravas',
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
};

export const CATEGORIES = Object.keys(CATEGORIES_WITH_SUBCATEGORIES);
export const ALL_SUBCATEGORIES = Object.values(CATEGORIES_WITH_SUBCATEGORIES).flat();
export const getSubcategories = (category: string): string[] => CATEGORIES_WITH_SUBCATEGORIES[category] || [];

// Types for database tables
// Booking interface removed - see unused/BookingFlow.tsx

export interface Event {
  id: string;
  name: string;
  category: string;
  price_range: string;
  active: boolean;
  created_at?: string;
}

export interface Inquiry {
  id: string;
  customer_name: string;
  email: string;
  message: string;
  created_at?: string;
}

export interface PastEvent {
  id: string;
  title: string;
  description?: string;
  category: string;
  subcategory?: string;
  event_date: string; // DATE format (YYYY-MM-DD)
  location?: string;
  city?: string;
  number_of_guests?: number;
  created_at?: string;
  updated_at?: string;
  // Virtual fields from joins
  photo_urls?: string[];
  thumbnail_url?: string;
}

// Booking operations
// bookingOperations removed - see unused/BookingFlow.tsx

// Event operations
export const eventOperations = {
  async getAll() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(event: Omit<Event, 'id'>) {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select();
    if (error) throw error;
    return data[0];
  },

  async update(id: string, event: Partial<Event>) {
    const { data, error } = await supabase
      .from('events')
      .update(event)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// Inquiry operations
export const inquiryOperations = {
  async getAll() {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(inquiry: Omit<Inquiry, 'id'>) {
    const { data, error } = await supabase
      .from('inquiries')
      .insert([inquiry])
      .select();
    if (error) throw error;
    return data[0];
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// Stats operations
export const statsOperations = {
  async getStats() {
    try {
      // Booking functionality removed - stats now show placeholder values
      return {
        totalBookings: 0,
        revenue: 0,
        activeClients: 0,
        avgRating: 4.8,
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        totalBookings: 0,
        revenue: 0,
        activeClients: 0,
        avgRating: 0,
      };
    }
  },
};

// Past Events operations
export const pastEventOperations = {
  async getAll() {
    const { data, error } = await supabase
      .from('past_events')
      .select(`
        id,
        title,
        description,
        category,
        subcategory,
        event_date,
        location,
        city,
        number_of_guests,
        created_at,
        updated_at,
        event_photos (url)
      `)
      .order('event_date', { ascending: false });
    if (error) throw error;
    
    // Transform to include photo_urls array
    return (data || []).map((event: any) => ({
      ...event,
      photo_urls: event.event_photos?.map((p: any) => p.url) || [],
      thumbnail_url: event.event_photos?.[0]?.url || null,
    }));
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('past_events')
      .select(`
        *,
        event_photos (url, alt_text)
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    
    return {
      ...data,
      photo_urls: data.event_photos?.map((p: any) => p.url) || [],
      thumbnail_url: data.event_photos?.[0]?.url || null,
    };
  },

  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('past_events')
      .select(`
        *,
        event_photos (url)
      `)
      .eq('category', category)
      .order('event_date', { ascending: false });
    if (error) throw error;
    
    return (data || []).map((event: any) => ({
      ...event,
      photo_urls: event.event_photos?.map((p: any) => p.url) || [],
      thumbnail_url: event.event_photos?.[0]?.url || null,
    }));
  },

  async create(event: Omit<PastEvent, 'id'>) {
    const { data, error } = await supabase
      .from('past_events')
      .insert([event])
      .select();
    if (error) throw error;
    return data[0];
  },

  async update(id: string, event: Partial<PastEvent>) {
    const { data, error } = await supabase
      .from('past_events')
      .update(event)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('past_events')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Get random photos for gallery preview
  async getRandomPhotos(limit: number = 4) {
    const { data, error } = await supabase
      .from('event_photos')
      .select(`
        id,
        url,
        alt_text,
        past_events (title)
      `)
      .limit(50); // Get more photos to randomize from
    
    if (error) throw error;
    
    // Shuffle and take only the requested limit
    const shuffled = (data || []).sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit).map((photo: any) => ({
      id: photo.id,
      url: photo.url,
      alt_text: photo.alt_text || 'Event photo',
      event_title: photo.past_events?.title || 'Event'
    }));
  },
};

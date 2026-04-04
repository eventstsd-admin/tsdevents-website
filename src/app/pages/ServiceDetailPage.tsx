import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

interface PastEvent {
  title: string;
  date: string;
  location: string;
  guests: string;
  description: string;
  image: string;
}

interface ServiceData {
  title: string;
  tagline: string;
  bannerImage: string;
  description: string;
  pastEvents: PastEvent[];
}

const serviceData: Record<string, ServiceData> = {
  'traditional-weddings': {
    title: 'Traditional Weddings',
    tagline: 'Classic ceremonies with cultural heritage',
    bannerImage: 'https://images.unsplash.com/photo-1774024050561-4ee0148c8526?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGluZGlhbiUyMHdlZGRpbmclMjBtYW5kYXB8ZW58MXx8fHwxNzc1MDIwMDA2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Our traditional wedding services honor the beauty of cultural ceremonies while adding modern elegance. We specialize in Hindu, Muslim, Christian, and multi-faith ceremonies with authentic rituals and stunning decor.',
    pastEvents: [
      { title: 'Sharma-Patel Grand Wedding', date: 'March 2026', location: 'Udaipur, Rajasthan', guests: '800+', description: 'A royal 3-day traditional Hindu wedding at a heritage palace with over 800 guests, featuring classical musicians and a grand baraat procession.', image: 'https://images.unsplash.com/photo-1774024050561-4ee0148c8526?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGluZGlhbiUyMHdlZGRpbmclMjBtYW5kYXB8ZW58MXx8fHwxNzc1MDIwMDA2fDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { title: 'Gupta Family Celebration', date: 'January 2026', location: 'Jaipur, Rajasthan', guests: '500+', description: 'A magnificent traditional wedding spanning 2 days with elaborate mandap decorations, dhol players, and a fireworks finale.', image: 'https://images.unsplash.com/photo-1763553113332-800519753e40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3ZWRkaW5nJTIwcmVjZXB0aW9uJTIwaGFsbCUyMGRlY29yfGVufDF8fHx8MTc3NTAyMDAwN3ww&ixlib=rb-4.1.0&q=80&w=1080' },
      { title: 'Mehta Royal Wedding', date: 'November 2025', location: 'Mumbai, Maharashtra', guests: '650+', description: 'An opulent Gujarati wedding at a five-star venue with custom stage design, live catering stations, and celebrity entertainment.', image: 'https://images.unsplash.com/photo-1767986012138-d02276728368?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3ZWRkaW5nJTIwY2VyZW1vbnklMjBlbGVnYW50fGVufDF8fHx8MTc3NTAxNzA5MHww&ixlib=rb-4.1.0&q=80&w=1080' },
    ],
  },
  'destination-weddings': {
    title: 'Destination Weddings',
    tagline: 'Exotic locations for your special day',
    bannerImage: 'https://images.unsplash.com/photo-1766041677004-46d1525ae2d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXN0aW5hdGlvbiUyMGJlYWNoJTIwd2VkZGluZyUyMGNlcmVtb255fGVufDF8fHx8MTc3NTAyMDAwN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'We create breathtaking destination wedding experiences in the most stunning locations. From beaches to mountains, palaces to vineyards, we handle every logistic so you can focus on your love story.',
    pastEvents: [
      { title: 'Kapoor-Singh Beach Wedding', date: 'February 2026', location: 'Goa, India', guests: '200+', description: 'A stunning sunset beach ceremony with bohemian decor, fire dancers, and a beachside reception under the stars.', image: 'https://images.unsplash.com/photo-1766041677004-46d1525ae2d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXN0aW5hdGlvbiUyMGJlYWNoJTIwd2VkZGluZyUyMGNlcmVtb255fGVufDF8fHx8MTc3NTAyMDAwN3ww&ixlib=rb-4.1.0&q=80&w=1080' },
      { title: 'Desai Hilltop Ceremony', date: 'October 2025', location: 'Mussoorie, Uttarakhand', guests: '150+', description: 'An intimate mountain-top wedding with panoramic Himalayan views, bonfire night, and a scenic outdoor reception.', image: 'https://images.unsplash.com/photo-1769038932880-7594ec508763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwd2VkZGluZyUyMHJlY2VwdGlvbiUyMHN1bnNldHxlbnwxfHx8fDE3NzUwMTcwOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    ],
  },
  'reception-planning': {
    title: 'Reception Planning',
    tagline: 'Grand celebrations with loved ones',
    bannerImage: 'https://images.unsplash.com/photo-1763553113332-800519753e40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3ZWRkaW5nJTIwcmVjZXB0aW9uJTIwaGFsbCUyMGRlY29yfGVufDF8fHx8MTc3NTAyMDAwN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Our reception planning services create unforgettable post-ceremony celebrations with stunning setups, gourmet dining, and entertainment that keeps your guests dancing all night.',
    pastEvents: [
      { title: 'Joshi Grand Reception', date: 'December 2025', location: 'Delhi NCR', guests: '1000+', description: 'A lavish reception at a luxury hotel ballroom featuring a 12-course dinner, live orchestra, and celebrity DJ.', image: 'https://images.unsplash.com/photo-1763553113332-800519753e40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3ZWRkaW5nJTIwcmVjZXB0aW9uJTIwaGFsbCUyMGRlY29yfGVufDF8fHx8MTc3NTAyMDAwN3ww&ixlib=rb-4.1.0&q=80&w=1080' },
      { title: 'Reddy Engagement Reception', date: 'September 2025', location: 'Hyderabad, Telangana', guests: '600+', description: 'A glittering reception with a custom LED stage, multi-cuisine buffet, and a surprise pyrotechnics show.', image: 'https://images.unsplash.com/photo-1766734865668-0ebd5d60ae92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZXZlbnQlMjBkZWNvcmF0aW9uJTIwZmxvd2Vyc3xlbnwxfHx8fDE3NzUwMTcwOTF8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    ],
  },
  'conferences': {
    title: 'Conferences',
    tagline: 'Professional business gatherings',
    bannerImage: 'https://images.unsplash.com/photo-1769798643582-32ef781c45d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbmZlcmVuY2UlMjBzdGFnZSUyMHNwZWFrZXJzfGVufDF8fHx8MTc3NDk3NzkwNHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'We organize world-class conferences with seamless AV setups, speaker coordination, attendee management, and networking areas that foster meaningful connections.',
    pastEvents: [
      { title: 'TechSummit India 2026', date: 'February 2026', location: 'Bangalore, Karnataka', guests: '2000+', description: 'A 3-day technology conference featuring 50+ speakers, interactive workshops, startup pitch sessions, and a grand networking gala.', image: 'https://images.unsplash.com/photo-1769798643582-32ef781c45d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbmZlcmVuY2UlMjBzdGFnZSUyMHNwZWFrZXJzfGVufDF8fHx8MTc3NDk3NzkwNHww&ixlib=rb-4.1.0&q=80&w=1080' },
      { title: 'Healthcare Leaders Forum', date: 'November 2025', location: 'Mumbai, Maharashtra', guests: '800+', description: 'An exclusive medical conference with keynote sessions, panel discussions, and a state-of-the-art exhibition hall.', image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBldmVudCUyMGNvbmZlcmVuY2UlMjBidXNpbmVzc3xlbnwxfHx8fDE3NzQ5ODMxMzN8MA&ixlib=rb-4.1.0&q=80&w=1080' },
      { title: 'FinTech Annual Meet 2025', date: 'August 2025', location: 'Pune, Maharashtra', guests: '500+', description: 'A prestigious fintech gathering with live product demos, investor meetups, and an awards ceremony.', image: 'https://images.unsplash.com/photo-1739298061707-cefee19941b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMGJ1c2luZXNzJTIwbWVldGluZ3xlbnwxfHx8fDE3NzQ5NDIwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    ],
  },
  'team-building': {
    title: 'Team Building',
    tagline: 'Strengthen your team dynamics',
    bannerImage: 'https://images.unsplash.com/photo-1774599661355-327e322f53c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwYnVpbGRpbmclMjBjb3Jwb3JhdGUlMjBvdXRkb29yJTIwYWN0aXZpdHl8ZW58MXx8fHwxNzc1MDIwMDA2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Our team building events are designed to boost morale, improve communication, and foster collaboration through fun, engaging activities and carefully crafted experiences.',
    pastEvents: [
      { title: 'Infosys Outdoor Adventure', date: 'January 2026', location: 'Lonavala, Maharashtra', guests: '300+', description: 'A 2-day outdoor team building retreat with obstacle courses, treasure hunts, campfire sessions, and leadership workshops.', image: 'https://images.unsplash.com/photo-1774599661355-327e322f53c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwYnVpbGRpbmclMjBjb3Jwb3JhdGUlMjBvdXRkb29yJTIwYWN0aXZpdHl8ZW58MXx8fHwxNzc1MDIwMDA2fDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { title: 'Wipro Innovation Day', date: 'September 2025', location: 'Coorg, Karnataka', guests: '200+', description: 'A creative team building event combining hackathons, art workshops, and outdoor sports in a serene resort setting.', image: 'https://images.unsplash.com/photo-1765438864227-288900d09d26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBldmVudCUyMHBsYW5uaW5nJTIwdGVhbXxlbnwxfHx8fDE3NzUwMTcwOTN8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    ],
  },
  'product-launches': {
    title: 'Product Launches',
    tagline: 'Unveil your brand in style',
    bannerImage: 'https://images.unsplash.com/photo-1759496434742-771c92e66103?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwbGF1bmNoJTIwZXZlbnQlMjBwcmVzZW50YXRpb258ZW58MXx8fHwxNzc1MDIwMDA2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'We create impactful product launch events that generate buzz, engage media, and leave a lasting impression on your target audience with stunning presentations and immersive experiences.',
    pastEvents: [
      { title: 'AutoTech EV Unveiling', date: 'March 2026', location: 'Delhi NCR', guests: '500+', description: 'A high-tech product launch for an electric vehicle brand with holographic reveals, test drive zones, and influencer activations.', image: 'https://images.unsplash.com/photo-1759496434742-771c92e66103?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwbGF1bmNoJTIwZXZlbnQlMjBwcmVzZW50YXRpb258ZW58MXx8fHwxNzc1MDIwMDA2fDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { title: 'Luxe Skincare Collection Launch', date: 'July 2025', location: 'Mumbai, Maharashtra', guests: '300+', description: 'An elegant beauty brand launch with a fashion runway, celebrity endorsements, and an experiential product trial zone.', image: 'https://images.unsplash.com/photo-1768508950243-16fd93e88d7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFyaXR5JTIwZ2FsYSUyMGRpbm5lciUyMGZvcm1hbCUyMGV2ZW50fGVufDF8fHx8MTc3NTAyMDAwOXww&ixlib=rb-4.1.0&q=80&w=1080' },
    ],
  },
  'birthday-parties': {
    title: 'Birthday Parties',
    tagline: 'Memorable milestone celebrations',
    bannerImage: 'https://images.unsplash.com/photo-1772683530704-c11f304f1bd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMHBhcnR5JTIwZGVjb3JhdGlvbiUyMHNldHVwfGVufDF8fHx8MTc3NTAyMDAwOHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'From kids\' themed parties to milestone adult celebrations, we create birthday experiences that are truly special with custom themes, entertainment, and gourmet catering.',
    pastEvents: [
      { title: 'Riya\'s Princess Theme 5th Birthday', date: 'January 2026', location: 'Mumbai, Maharashtra', guests: '100+', description: 'A magical princess-themed party with a castle bounce house, face painting, magic show, and a 5-tier custom cake.', image: 'https://images.unsplash.com/photo-1772683530704-c11f304f1bd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMHBhcnR5JTIwZGVjb3JhdGlvbiUyMHNldHVwfGVufDF8fHx8MTc3NTAyMDAwOHww&ixlib=rb-4.1.0&q=80&w=1080' },
      { title: 'Mr. Verma\'s 60th Milestone', date: 'October 2025', location: 'Pune, Maharashtra', guests: '200+', description: 'An elegant 60th birthday gala with a tribute video, live band, and a surprise guest appearance from the family.', image: 'https://images.unsplash.com/photo-1598622443054-499119043e82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMHBhcnR5JTIwYmFsbG9vbnMlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NzQ5NzczMTd8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    ],
  },
  'anniversary-events': {
    title: 'Anniversary Events',
    tagline: 'Celebrate love and togetherness',
    bannerImage: 'https://images.unsplash.com/photo-1760669345703-930cd212b219?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbm5pdmVyc2FyeSUyMGRpbm5lciUyMGNlbGVicmF0aW9uJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzUwMjAwMDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'We design heartfelt anniversary celebrations that honor your journey together, from intimate dinners to grand silver and golden jubilee galas.',
    pastEvents: [
      { title: 'Khanna 25th Silver Jubilee', date: 'December 2025', location: 'Delhi NCR', guests: '350+', description: 'A silver-themed grand anniversary celebration with a memory lane photo exhibit, live ghazal night, and a surprise choreographed family dance.', image: 'https://images.unsplash.com/photo-1760669345703-930cd212b219?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbm5pdmVyc2FyeSUyMGRpbm5lciUyMGNlbGVicmF0aW9uJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzUwMjAwMDh8MA&ixlib=rb-4.1.0&q=80&w=1080' },
      { title: 'Iyer Golden Anniversary', date: 'August 2025', location: 'Chennai, Tamil Nadu', guests: '500+', description: 'A grand 50th anniversary celebration with traditional rituals, family reunion, documentary screening, and a gala dinner.', image: 'https://images.unsplash.com/photo-1773020933498-3af6df1074bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdhZ2VtZW50JTIwY2VyZW1vbnklMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NzUwMjAwMDl8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    ],
  },
  'social-gatherings': {
    title: 'Social Gatherings',
    tagline: 'Intimate or grand social events',
    bannerImage: 'https://images.unsplash.com/photo-1760598742492-7ad941e658e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcml2YXRlJTIwcGFydHklMjBjZWxlYnJhdGlvbiUyMGxpZ2h0c3xlbnwxfHx8fDE3NzUwMTcwOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'From house warmings to reunion parties and festive celebrations, we create social events that bring people together in memorable ways.',
    pastEvents: [
      { title: 'Alumni Reunion Gala', date: 'November 2025', location: 'Bangalore, Karnataka', guests: '400+', description: 'A nostalgic college alumni reunion with a retro theme, memory wall, live band, and a surprise awards ceremony.', image: 'https://images.unsplash.com/photo-1760598742492-7ad941e658e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcml2YXRlJTIwcGFydHklMjBjZWxlYnJhdGlvbiUyMGxpZ2h0c3xlbnwxfHx8fDE3NzUwMTcwOTB8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    ],
  },
  'concerts-shows': {
    title: 'Concerts & Shows',
    tagline: 'Live entertainment experiences',
    bannerImage: 'https://images.unsplash.com/photo-1632009613808-70a20dacccb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwbXVzaWMlMjBjb25jZXJ0JTIwY3Jvd2QlMjBuaWdodHxlbnwxfHx8fDE3NzUwMjAwMDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'We produce spectacular concerts and live entertainment shows with world-class stage design, sound engineering, lighting, and artist management.',
    pastEvents: [
      { title: 'Bollywood Night Live 2026', date: 'January 2026', location: 'Mumbai, Maharashtra', guests: '5000+', description: 'A massive outdoor Bollywood music concert featuring top playback singers, LED stage, and pyrotechnics.', image: 'https://images.unsplash.com/photo-1632009613808-70a20dacccb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwbXVzaWMlMjBjb25jZXJ0JTIwY3Jvd2QlMjBuaWdodHxlbnwxfHx8fDE3NzUwMjAwMDl8MA&ixlib=rb-4.1.0&q=80&w=1080' },
      { title: 'Indie Music Festival', date: 'October 2025', location: 'Pune, Maharashtra', guests: '3000+', description: 'A 2-day indie music festival with 20+ bands across 3 stages, food stalls, art installations, and a sunset acoustic set.', image: 'https://images.unsplash.com/photo-1558457583-dfd9dabca6ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwc3RhZ2UlMjBwZXJmb3JtYW5jZSUyMGNyb3dkfGVufDF8fHx8MTc3NTAxNzA5MXww&ixlib=rb-4.1.0&q=80&w=1080' },
    ],
  },
  'charity-galas': {
    title: 'Charity Galas',
    tagline: 'Elegant fundraising events',
    bannerImage: 'https://images.unsplash.com/photo-1768508950243-16fd93e88d7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFyaXR5JTIwZ2FsYSUyMGRpbm5lciUyMGZvcm1hbCUyMGV2ZW50fGVufDF8fHx8MTc3NTAyMDAwOXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'We organize sophisticated charity galas that combine elegance with purpose, featuring auctions, keynote speakers, and entertainment to maximize fundraising impact.',
    pastEvents: [
      { title: 'Hope Foundation Annual Gala', date: 'December 2025', location: 'Mumbai, Maharashtra', guests: '400+', description: 'A black-tie charity gala raising ₹2 crore for education, featuring a silent auction, celebrity host, and a gourmet dinner.', image: 'https://images.unsplash.com/photo-1768508950243-16fd93e88d7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFyaXR5JTIwZ2FsYSUyMGRpbm5lciUyMGZvcm1hbCUyMGV2ZW50fGVufDF8fHx8MTc3NTAyMDAwOXww&ixlib=rb-4.1.0&q=80&w=1080' },
    ],
  },
  'cultural-festivals': {
    title: 'Cultural Festivals',
    tagline: 'Celebrate traditions and culture',
    bannerImage: 'https://images.unsplash.com/photo-1765845399332-af5e3cb9b0e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWx0dXJhbCUyMGZlc3RpdmFsJTIwY29sb3JmdWwlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NzUwMjAwMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'We celebrate India\'s rich cultural diversity by organizing vibrant festivals featuring traditional art, music, dance, cuisine, and community engagement.',
    pastEvents: [
      { title: 'Diwali Utsav 2025', date: 'November 2025', location: 'Jaipur, Rajasthan', guests: '2000+', description: 'A spectacular Diwali festival with rangoli competitions, folk performances, fireworks display, and a grand community feast.', image: 'https://images.unsplash.com/photo-1765845399332-af5e3cb9b0e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWx0dXJhbCUyMGZlc3RpdmFsJTIwY29sb3JmdWwlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NzUwMjAwMTB8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    ],
  },
};

export function ServiceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const service = slug ? serviceData[slug] : null;

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center bg-white p-12 shadow-sm border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Not Found</h2>
          <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
          <Button
            onClick={() => navigate('/services')}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3"
          >
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Banner */}
      <section className="relative h-[50vh] pt-20">
        <img
          src={service.bannerImage}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-16">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate('/services')}
              className="flex items-center text-white mb-6 hover:text-amber-500 transition-colors"
            >
              <ArrowLeft className="mr-2" />
              Back to Services
            </motion.button>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold text-white mb-3"
            >
              {service.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-amber-500"
            >
              {service.tagline}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-sm border border-gray-200"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About This Service</h2>
            <p className="text-lg text-gray-700 leading-relaxed">{service.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Past Events
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A showcase of our previous {service.title.toLowerCase()} that we've proudly organized
            </p>
          </motion.div>

          <div className="space-y-8 max-w-6xl mx-auto">
            {service.pastEvents.map((event, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className={`relative h-72 lg:h-auto ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                  <div className={`p-8 lg:p-10 flex flex-col justify-center ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{event.title}</h3>
                    <div className="flex flex-wrap gap-3 mb-4">
                      <span className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1.5">
                        <Calendar className="w-4 h-4 mr-1.5 text-red-600" />
                        {event.date}
                      </span>
                      <span className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1.5">
                        <MapPin className="w-4 h-4 mr-1.5 text-red-600" />
                        {event.location}
                      </span>
                      <span className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1.5">
                        <Users className="w-4 h-4 mr-1.5 text-red-600" />
                        {event.guests} Guests
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6">{event.description}</p>
                    <div>
                      <Button
                        onClick={() => navigate(`/contact?service=${encodeURIComponent(service.title)}`)}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 shadow-md transition-all duration-300"
                      >
                        Get a Quote
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Want a Similar Event?
            </h2>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Let us create a customized {service.title.toLowerCase()} experience tailored to your vision and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate(`/contact?service=${encodeURIComponent(service.title)}`)}
                className="bg-white text-red-600 hover:bg-gray-100 px-10 py-6 text-lg font-semibold shadow-lg"
              >
                Contact Us
                <ArrowRight className="ml-2" />
              </Button>
              <Button
                onClick={() => navigate('/events')}
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-10 py-6 text-lg font-semibold"
              >
                View Our Work
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
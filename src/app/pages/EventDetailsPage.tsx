import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Check, Calendar, Users, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

const eventDetails: Record<string, any> = {
  weddings: {
    title: 'Wedding Events',
    tagline: 'Your dream wedding, crafted to perfection',
    description:
      'Transform your special day into an unforgettable celebration with our comprehensive wedding planning services. From intimate ceremonies to grand celebrations, we handle every detail with care and precision.',
    bannerImage:
      'https://images.unsplash.com/photo-1767986012138-d02276728368?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3ZWRkaW5nJTIwY2VyZW1vbnklMjBlbGVnYW50fGVufDF8fHx8MTc3NTAxNzA5MHww&ixlib=rb-4.1.0&q=80&w=1080',
    gallery: [
      'https://images.unsplash.com/photo-1769038932880-7594ec508763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwd2VkZGluZyUyMHJlY2VwdGlvbiUyMHN1bnNldHxlbnwxfHx8fDE3NzUwMTcwOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1766734865668-0ebd5d60ae92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZXZlbnQlMjBkZWNvcmF0aW9uJTIwZmxvd2Vyc3xlbnwxfHx8fDE3NzUwMTcwOTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1774025967891-b4ed833e57ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMGNhdGVyaW5nJTIwZm9vZCUyMGJ1ZmZldHxlbnwxfHx8fDE3NzUwMTcwOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    inclusions: [
      'Complete venue selection and booking',
      'Personalized theme and decoration design',
      'Professional photography and videography',
      'Gourmet catering with multiple cuisines',
      'Entertainment and live performances',
      'Guest management and invitation design',
      'Bridal and groom styling coordination',
      'Transportation and logistics',
    ],
    duration: '1-3 Days',
    capacity: '50-1000+ Guests',
    idealFor: 'Couples planning traditional or destination weddings',
  },
  corporate: {
    title: 'Corporate Events',
    tagline: 'Professional events that make an impact',
    description:
      'Elevate your business gatherings with our expert corporate event management. From conferences to product launches, we ensure seamless execution and memorable experiences.',
    bannerImage:
      'https://images.unsplash.com/photo-1523580494863-6f3031224c94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBldmVudCUyMGNvbmZlcmVuY2UlMjBidXNpbmVzc3xlbnwxfHx8fDE3NzQ5ODMxMzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    gallery: [
      'https://images.unsplash.com/photo-1739298061707-cefee19941b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMGJ1c2luZXNzJTIwbWVldGluZ3xlbnwxfHx8fDE3NzQ5NDIwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1765438864227-288900d09d26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBldmVudCUyMHBsYW5uaW5nJTIwdGVhbXxlbnwxfHx8fDE3NzUwMTcwOTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1774025967891-b4ed833e57ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMGNhdGVyaW5nJTIwZm9vZCUyMGJ1ZmZldHxlbnwxfHx8fDE3NzUwMTcwOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    inclusions: [
      'Venue sourcing and management',
      'AV equipment and technical support',
      'Stage design and branding',
      'Professional catering services',
      'Registration and guest management',
      'Speaker coordination',
      'Event marketing materials',
      'Post-event reporting',
    ],
    duration: '1-2 Days',
    capacity: '50-500 Attendees',
    idealFor: 'Businesses and organizations',
  },
  private: {
    title: 'Private Celebrations',
    tagline: 'Intimate moments, grand celebrations',
    description:
      'Make your personal milestones memorable with our bespoke private party planning. Whether it\'s a birthday, anniversary, or any special occasion, we create magical experiences.',
    bannerImage:
      'https://images.unsplash.com/photo-1598622443054-499119043e82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMHBhcnR5JTIwYmFsbG9vbnMlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NzQ5NzczMTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    gallery: [
      'https://images.unsplash.com/photo-1760598742492-7ad941e658e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcml2YXRlJTIwcGFydHklMjBjZWxlYnJhdGlvbiUyMGxpZ2h0c3xlbnwxfHx8fDE3NzUwMTcwOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1766734865668-0ebd5d60ae92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZXZlbnQlMjBkZWNvcmF0aW9uJTIwZmxvd2Vyc3xlbnwxfHx8fDE3NzUwMTcwOTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1774025967891-b4ed833e57ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMGNhdGVyaW5nJTIwZm9vZCUyMGJ1ZmZldHxlbnwxfHx8fDE3NzUwMTcwOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    inclusions: [
      'Customized theme planning',
      'Venue decoration and setup',
      'Catering and beverage service',
      'Entertainment and music',
      'Photography services',
      'Cake and dessert arrangements',
      'Party favors and gifts',
      'Complete event coordination',
    ],
    duration: '4-8 Hours',
    capacity: '20-200 Guests',
    idealFor: 'Families and individuals',
  },
  concerts: {
    title: 'Concerts & Shows',
    tagline: 'Live entertainment at its finest',
    description:
      'Create unforgettable live entertainment experiences with our concert and show management services. From intimate acoustic sessions to large-scale productions.',
    bannerImage:
      'https://images.unsplash.com/photo-1558457583-dfd9dabca6ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwc3RhZ2UlMjBwZXJmb3JtYW5jZSUyMGNyb3dkfGVufDF8fHx8MTc3NTAxNzA5MXww&ixlib=rb-4.1.0&q=80&w=1080',
    gallery: [
      'https://images.unsplash.com/photo-1760598742492-7ad941e658e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcml2YXRlJTIwcGFydHklMjBjZWxlYnJhdGlvbiUyMGxpZ2h0c3xlbnwxfHx8fDE3NzUwMTcwOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1766734865668-0ebd5d60ae92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZXZlbnQlMjBkZWNvcmF0aW9uJTIwZmxvd2Vyc3xlbnwxfHx8fDE3NzUwMTcwOTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1774025967891-b4ed833e57ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMGNhdGVyaW5nJTIwZm9vZCUyMGJ1ZmZldHxlbnwxfHx8fDE3NzUwMTcwOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    inclusions: [
      'Stage and lighting setup',
      'Professional sound systems',
      'Artist coordination and management',
      'Ticketing and entry management',
      'Security and crowd control',
      'Backstage facilities',
      'Marketing and promotion',
      'Live streaming options',
    ],
    duration: '3-6 Hours',
    capacity: '200-5000+ Attendees',
    idealFor: 'Event organizers and promoters',
  },
};

export function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = id ? eventDetails[id] : eventDetails.weddings;

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Event Not Found</h2>
          <Button onClick={() => navigate('/services')}>Back to Services</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Banner */}
      <section className="relative h-[50vh] pt-20">
        <img
          src={event.bannerImage}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-16">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate('/services')}
              className="flex items-center text-white mb-6 hover:text-amber-400 transition-colors"
            >
              <ArrowLeft className="mr-2" />
              Back to Services
            </motion.button>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold text-white mb-4"
            >
              {event.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl text-amber-400"
            >
              {event.tagline}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">About This Service</h2>
                <p className="text-lg text-gray-700 leading-relaxed">{event.description}</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.inclusions.map((item: string, idx: number) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start"
                    >
                      <Check className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Event Gallery</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {event.gallery.map((image: string, idx: number) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05 }}
                      className="relative h-64 rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                    >
                      <img
                        src={image}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-amber-50 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Event Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-amber-600 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">Duration</p>
                        <p className="text-gray-600">{event.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Users className="w-5 h-5 text-amber-600 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">Capacity</p>
                        <p className="text-gray-600">{event.capacity}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-amber-600 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">Ideal For</p>
                        <p className="text-gray-600">{event.idealFor}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => navigate('/contact')}
                  className="w-full bg-red-700/90 hover:bg-red-800/90 text-white py-6 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all border border-red-700/30"
                >
                  <Calendar className="mr-2" />
                  Contact Us
                </Button>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Need Help?</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Our event specialists are ready to assist you
                  </p>
                  <Button
                    onClick={() => navigate('/contact')}
                    variant="outline"
                    className="w-full border-2 border-gray-300 hover:border-amber-500 hover:text-amber-600"
                  >
                    Contact Us
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
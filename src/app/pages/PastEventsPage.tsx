import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, X, ChevronLeft, ChevronRight, Camera, ExternalLink, Phone, Mail, Users } from 'lucide-react';
import { pastEventOperations, CATEGORIES, type PastEvent } from '../../supabase';
import { SEOComponent, PAGE_SEO } from '../components/SEO-fallback';
// Cloudinary URL
const eventsHeroUrl = 'https://res.cloudinary.com/djvccbmtx/image/upload/v1775312358/Events_bx0xhi.webp';
const eventsHeroImageToUse = eventsHeroUrl;

export default function PastEventsPage() {
  const [events, setEvents] = useState<PastEvent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<PastEvent | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await pastEventOperations.getAll();
      setEvents(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load events');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = selectedCategory
    ? events.filter((e) => e.category === selectedCategory)
    : events;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const openEventDetails = (event: PastEvent) => {
    setSelectedEvent(event);
    setCurrentPhotoIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
    setCurrentPhotoIndex(0);
    document.body.style.overflow = 'unset';
  };

  const nextPhoto = () => {
    if (selectedEvent?.photo_urls) {
      setCurrentPhotoIndex((prev) => 
        prev === selectedEvent.photo_urls!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevPhoto = () => {
    if (selectedEvent?.photo_urls) {
      setCurrentPhotoIndex((prev) => 
        prev === 0 ? selectedEvent.photo_urls!.length - 1 : prev - 1
      );
    }
  };

  return (
    <>
      <SEOComponent {...PAGE_SEO.pastEvents} />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden pt-20">
        <div className="absolute inset-0">
          {/* Background Image */}
          <motion.div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${eventsHeroImageToUse})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50" />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-full sm:max-w-4xl w-full sm:w-11/12 mx-auto py-8 sm:py-0">

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-3 sm:mb-6 text-white"
            >
              Our Events
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 leading-relaxed"
            >
              Explore our portfolio of successfully executed events across India.
            </motion.p>
          </div>
        </div>
      </section>

      <div className="min-h-screen bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-3 mb-16"
          >
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-3 font-medium transition-all duration-300 ${
                selectedCategory === null
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-red-400 hover:text-red-600'
              }`}
            >
              All Events
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-red-400 hover:text-red-600'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 p-6 mb-8 text-red-700 text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-amber-200 rounded-full animate-spin border-t-red-600"></div>
              </div>
              <p className="mt-6 text-gray-500 font-medium">Loading events...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredEvents.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 flex items-center justify-center">
                <Camera className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-xl text-gray-600 mb-2">
                {selectedCategory
                  ? `No events found in ${selectedCategory}`
                  : 'No events added yet'}
              </p>
              <p className="text-gray-400">Check back soon for updates.</p>
            </motion.div>
          )}

          {/* Events Grid - Premium Cards */}
          {!loading && filteredEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100"
                  onClick={() => openEventDetails(event)}
                >
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    {event.thumbnail_url ? (
                      <img
                        src={event.thumbnail_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-red-600 flex items-center justify-center">
                        <Camera className="w-16 h-16 text-white/50" />
                      </div>
                    )}
                    
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-white text-red-600 text-xs font-bold uppercase tracking-wider">
                        {event.category}
                      </span>
                    </div>
                    
                    {/* Photo Count */}
                    {event.photo_urls && event.photo_urls.length > 0 && (
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/50 text-white text-sm font-medium">
                        <Camera className="w-4 h-4" />
                        {event.photo_urls.length}
                      </div>
                    )}

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                        {event.title}
                      </h3>
                      <div className="flex items-center text-white/90 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(event.event_date)}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 bg-white border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-500 text-sm group-hover:text-red-600 transition-colors">
                        {event.location && (
                          <>
                            <MapPin className="w-4 h-4 mr-1.5 text-red-500" />
                            <span className="font-medium">View Location</span>
                          </>
                        )}
                      </div>
                      <button 
                        className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Stats Section */}
          {!loading && events.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-24"
            >
              <div className="bg-white border border-gray-200 p-10 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="space-y-2">
                    <p className="text-5xl font-bold text-red-600">{events.length}+</p>
                    <p className="text-gray-600 font-medium">Events Completed</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-5xl font-bold text-amber-500">{CATEGORIES.length}</p>
                    <p className="text-gray-600 font-medium">Service Categories</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-5xl font-bold text-red-600">
                      {events.reduce((sum, e) => sum + (e.photo_urls?.length || 0), 0)}+
                    </p>
                    <p className="text-gray-600 font-medium">Captured Moments</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* CTA Section */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-20 text-center"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Ready to Create Your Event?
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
                Let's discuss your vision and bring your dream event to life.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="https://wa.me/919825413606?text=Hi%2C%20I%20want%20to%20plan%20an%20event.%20Can%20you%20share%20details%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 transition-all shadow-md"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Contact on WhatsApp
                </a>
                <a
                  href="mailto:info@tsdevents.in"
                  className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 hover:border-red-400 text-red-600 font-semibold py-4 px-8 transition-all"
                >
                  <Mail className="w-5 h-5" />
                  Write an Email
                </a>
                <a
                  href="tel:+919825413606"
                  className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-4 px-8 transition-all shadow-md"
                >
                  <Phone className="w-5 h-5" />
                  Call Us
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Event Details Modal - Horizontal Layout */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeEventDetails}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white max-w-6xl w-full max-h-[85vh] overflow-hidden shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeEventDetails}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-white hover:bg-gray-100 shadow-md flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5 text-gray-800" />
              </button>

              {/* Horizontal Layout Container */}
              <div className="flex flex-col lg:flex-row h-full max-h-[85vh]">
                {/* Left Side - Photo Gallery */}
                <div className="lg:w-1/2 relative bg-gray-900">
                  {selectedEvent.photo_urls && selectedEvent.photo_urls.length > 0 ? (
                    <div className="relative h-[40vh] lg:h-[85vh] overflow-hidden flex items-center justify-center">
                      {/* Main Image with Slide Animation */}
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={currentPhotoIndex}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.3 }}
                          src={selectedEvent.photo_urls[currentPhotoIndex]}
                          alt={`${selectedEvent.title} - Photo ${currentPhotoIndex + 1}`}
                          className="max-w-full max-h-full w-auto h-auto object-contain"
                        />
                      </AnimatePresence>
                      
                      {/* Navigation Arrows */}
                      {selectedEvent.photo_urls.length > 1 && (
                        <>
                          <button
                            onClick={prevPhoto}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition-all"
                          >
                            <ChevronLeft className="w-5 h-5 text-gray-800" />
                          </button>
                          <button
                            onClick={nextPhoto}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition-all"
                          >
                            <ChevronRight className="w-5 h-5 text-gray-800" />
                          </button>
                        </>
                      )}

                      {/* Photo Counter */}
                      <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1.5 text-sm font-medium">
                        {currentPhotoIndex + 1} / {selectedEvent.photo_urls.length}
                      </div>

                      {/* Thumbnail Strip at Bottom */}
                      {selectedEvent.photo_urls.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/50">
                          {selectedEvent.photo_urls.map((url, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentPhotoIndex(idx)}
                              className={`w-12 h-12 overflow-hidden transition-all ${
                                idx === currentPhotoIndex 
                                  ? 'ring-2 ring-amber-500 scale-110' 
                                  : 'opacity-60 hover:opacity-100'
                              }`}
                            >
                              <img src={url} alt="" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-[40vh] lg:h-full bg-red-600 flex items-center justify-center">
                      <Camera className="w-24 h-24 text-white/30" />
                    </div>
                  )}
                </div>

                {/* Right Side - Event Details */}
                <div className="lg:w-1/2 p-8 overflow-y-auto max-h-[45vh] lg:max-h-full bg-white">
                  {/* Category Badge */}
                  <span className="inline-block px-3 py-1.5 bg-red-600 text-white text-xs font-bold uppercase tracking-wider mb-4">
                    {selectedEvent.category}
                  </span>

                  {/* Title */}
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                    {selectedEvent.title}
                  </h2>

                  {/* Event Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-4 p-4 bg-amber-50 border-l-4 border-amber-500">
                      <div className="w-10 h-10 bg-amber-500 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Event Date</p>
                        <p className="text-gray-900 font-semibold">{formatDate(selectedEvent.event_date)}</p>
                      </div>
                    </div>
                    
                    {selectedEvent.location && (
                      <a
                        href={selectedEvent.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 bg-red-50 border-l-4 border-red-600 hover:bg-red-100 transition-all group"
                      >
                        <div className="w-10 h-10 bg-red-600 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Location</p>
                          <p className="text-red-600 font-semibold flex items-center gap-2">
                            View on Map
                            <ExternalLink className="w-4 h-4" />
                          </p>
                        </div>
                      </a>
                    )}
                  </div>

                  {/* City */}
                  {selectedEvent.city && (
                    <div className="mb-4 flex items-center gap-4 p-4 bg-red-50 border-l-4 border-red-600">
                      <div className="w-10 h-10 bg-red-600 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">City</p>
                        <p className="text-gray-900 font-semibold">{selectedEvent.city}</p>
                      </div>
                    </div>
                  )}

                  {/* Number of Guests */}
                  {selectedEvent.number_of_guests && (
                    <div className="mb-4 flex items-center gap-4 p-4 bg-amber-50 border-l-4 border-amber-600">
                      <div className="w-10 h-10 bg-amber-600 flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Number of Guests</p>
                        <p className="text-gray-900 font-semibold">{selectedEvent.number_of_guests.toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {selectedEvent.description && (
                    <div className="mb-6 p-4 bg-gray-50 border-l-4 border-gray-300">
                      <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">About this Event</h3>
                      <p className="text-gray-600 leading-relaxed text-sm">{selectedEvent.description}</p>
                    </div>
                  )}

                  {/* CTA Button */}
                  <a
                    href="/contact"
                    className="flex items-center justify-center gap-3 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 text-center transition-all shadow-md"
                  >
                    Interested? Contact Us
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, X, ChevronLeft, ChevronRight, Sparkles, Camera, ExternalLink } from 'lucide-react';
import { pastEventOperations, CATEGORIES, type PastEvent } from '../../supabase';
import eventsHeroImage from '../images/Hero Fallback/PastEvents/Events.jpg';

export function PastEventsPage() {
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
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img
            src={eventsHeroImage}
            alt="Our Events"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 mb-4"
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 font-medium tracking-wider uppercase text-sm">Our Portfolio</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6 text-white"
            >
              Our Events
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed"
            >
              Discover the magical moments we've crafted. Each event is a testament to our dedication to excellence.
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
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === null
                  ? 'bg-red-700 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-red-400 hover:text-red-600 hover:shadow-md'
              }`}
            >
              All Events
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-red-700 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-red-400 hover:text-red-600 hover:shadow-md'
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
              className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 text-red-700 text-center"
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
              <div className="w-24 h-24 mx-auto mb-6 bg-amber-50 rounded-full flex items-center justify-center">
                <Camera className="w-12 h-12 text-amber-500" />
              </div>
              <p className="text-xl text-gray-600 mb-2">
                {selectedCategory
                  ? `No events found in ${selectedCategory}`
                  : 'No events added yet'}
              </p>
              <p className="text-gray-400">Check back soon for updates!</p>
            </motion.div>
          )}

          {/* Events Grid - Premium Cards with Enhanced Animations */}
          {!loading && filteredEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -12, scale: 1.02 }}
                  className="group relative bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-500 cursor-pointer border border-gray-100/50"
                  onClick={() => openEventDetails(event)}
                >
                  {/* Image Container */}
                  <div className="relative h-72 overflow-hidden">
                    {event.thumbnail_url ? (
                      <motion.img
                        src={event.thumbnail_url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.15 }}
                        transition={{ duration: 0.6 }}
                      />
                    ) : (
                      <div className="w-full h-full bg-red-700 flex items-center justify-center">
                        <Camera className="w-16 h-16 text-white/50" />
                      </div>
                    )}
                    
                    {/* Glassmorphic Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                    
                    {/* Animated Shine Effect on Hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>
                    
                    {/* Category Badge - Glassmorphic */}
                    <motion.div 
                      className="absolute top-4 left-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-red-700 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg border border-white/50">
                        {event.category}
                      </span>
                    </motion.div>
                    
                    {/* Photo Count - Glassmorphic */}
                    {event.photo_urls && event.photo_urls.length > 0 && (
                      <motion.div 
                        className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md text-white text-sm font-semibold rounded-full border border-white/30"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                      >
                        <Camera className="w-4 h-4" />
                        {event.photo_urls.length} Photos
                      </motion.div>
                    )}

                    {/* Title Overlay - Enhanced */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <motion.h3 
                        className="text-2xl font-bold text-white mb-3 line-clamp-2 drop-shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        {event.title}
                      </motion.h3>
                      <motion.div 
                        className="flex items-center text-white/90 text-sm bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full w-fit"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.4 }}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(event.event_date)}
                      </motion.div>
                    </div>
                  </div>

                  {/* Card Footer - Glassmorphic */}
                  <div className="p-5 bg-white/95 backdrop-blur-sm border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-500 text-sm group-hover:text-red-600 transition-colors">
                        {event.location && (
                          <>
                            <MapPin className="w-4 h-4 mr-1.5 text-red-500" />
                            <span className="font-medium">View Location</span>
                          </>
                        )}
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.08, boxShadow: "0 10px 25px -5px rgba(185, 28, 28, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-bold rounded-full shadow-lg transition-all"
                      >
                        View Details
                      </motion.button>
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <motion.div 
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <div className="absolute inset-0 rounded-3xl ring-2 ring-amber-400/60 shadow-[0_0_30px_rgba(245,158,11,0.3)]" />
                  </motion.div>
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
              <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="space-y-2">
                    <p className="text-5xl font-bold text-red-700">{events.length}+</p>
                    <p className="text-gray-600 font-medium">Events Completed</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-5xl font-bold text-amber-600">{CATEGORIES.length}</p>
                    <p className="text-gray-600 font-medium">Service Categories</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-5xl font-bold text-red-700">
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
                Ready to Create Magic?
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
                Let's discuss your vision and bring your dream event to life.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg"
                >
                  Contact Us
                  <ExternalLink className="w-5 h-5" />
                </a>
                <a
                  href="/services"
                  className="inline-flex items-center gap-2 bg-white border-2 border-red-200 hover:border-red-400 text-red-700 font-bold py-4 px-8 rounded-full transition-all hover:shadow-lg"
                >
                  Explore Services
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
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={closeEventDetails}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="relative bg-white/95 backdrop-blur-xl rounded-3xl max-w-6xl w-full max-h-[85vh] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeEventDetails}
                className="absolute top-4 right-4 z-20 w-12 h-12 bg-white/90 backdrop-blur-md hover:bg-white rounded-full shadow-2xl flex items-center justify-center transition-all border border-gray-200"
              >
                <X className="w-6 h-6 text-gray-800" />
              </motion.button>

              {/* Horizontal Layout Container */}
              <div className="flex flex-col lg:flex-row h-full max-h-[85vh]">
                {/* Left Side - Photo Gallery */}
                <div className="lg:w-1/2 relative bg-gray-900">
                  {selectedEvent.photo_urls && selectedEvent.photo_urls.length > 0 ? (
                    <div className="relative h-[40vh] lg:h-full overflow-hidden">
                      {/* Main Image with Slide Animation */}
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={currentPhotoIndex}
                          initial={{ opacity: 0, scale: 1.1, x: 100 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95, x: -100 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          src={selectedEvent.photo_urls[currentPhotoIndex]}
                          alt={`${selectedEvent.title} - Photo ${currentPhotoIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </AnimatePresence>
                      
                      {/* Navigation Arrows */}
                      {selectedEvent.photo_urls.length > 1 && (
                        <>
                          <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ scale: 1.15, backgroundColor: "rgba(255,255,255,0.95)" }}
                            whileTap={{ scale: 0.9 }}
                            onClick={prevPhoto}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full shadow-2xl flex items-center justify-center transition-all border border-white/50"
                          >
                            <ChevronLeft className="w-6 h-6 text-gray-800" />
                          </motion.button>
                          <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ scale: 1.15, backgroundColor: "rgba(255,255,255,0.95)" }}
                            whileTap={{ scale: 0.9 }}
                            onClick={nextPhoto}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full shadow-2xl flex items-center justify-center transition-all border border-white/50"
                          >
                            <ChevronRight className="w-6 h-6 text-gray-800" />
                          </motion.button>
                        </>
                      )}

                      {/* Photo Counter */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="absolute top-4 left-4 bg-black/60 backdrop-blur-lg text-white px-4 py-2 rounded-full text-sm font-semibold"
                      >
                        {currentPhotoIndex + 1} / {selectedEvent.photo_urls.length}
                      </motion.div>

                      {/* Thumbnail Strip at Bottom */}
                      {selectedEvent.photo_urls.length > 1 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/40 backdrop-blur-xl rounded-xl"
                        >
                          {selectedEvent.photo_urls.map((url, idx) => (
                            <motion.button
                              key={idx}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setCurrentPhotoIndex(idx)}
                              className={`w-12 h-12 rounded-lg overflow-hidden transition-all ${
                                idx === currentPhotoIndex 
                                  ? 'ring-2 ring-amber-400 scale-110' 
                                  : 'opacity-60 hover:opacity-100'
                              }`}
                            >
                              <img src={url} alt="" className="w-full h-full object-cover" />
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <div className="h-[40vh] lg:h-full bg-red-700 flex items-center justify-center">
                      <Camera className="w-24 h-24 text-white/30" />
                    </div>
                  )}
                </div>

                {/* Right Side - Event Details */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="lg:w-1/2 p-8 overflow-y-auto max-h-[45vh] lg:max-h-full bg-white"
                >
                  {/* Category Badge */}
                  <motion.span 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-block px-4 py-2 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4 shadow-lg"
                  >
                    {selectedEvent.category}
                  </motion.span>

                  {/* Title */}
                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6"
                  >
                    {selectedEvent.title}
                  </motion.h2>

                  {/* Event Details - Stacked on right side */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4 mb-6"
                  >
                    <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shadow-md">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Event Date</p>
                        <p className="text-gray-900 font-bold">{formatDate(selectedEvent.event_date)}</p>
                      </div>
                    </div>
                    
                    {selectedEvent.location && (
                      <a
                        href={selectedEvent.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 transition-all group"
                      >
                        <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Location</p>
                          <p className="text-red-700 font-bold group-hover:text-red-800 flex items-center gap-2">
                            View on Map
                            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </p>
                        </div>
                      </a>
                    )}
                  </motion.div>

                  {/* Description */}
                  {selectedEvent.description && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">About this Event</h3>
                      <p className="text-gray-600 leading-relaxed text-sm">{selectedEvent.description}</p>
                    </motion.div>
                  )}

                  {/* CTA Button */}
                  <motion.a
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02, boxShadow: "0 15px 30px -5px rgba(185, 28, 28, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    href="/contact"
                    className="flex items-center justify-center gap-3 w-full bg-red-700 hover:bg-red-800 text-white font-bold py-4 px-6 rounded-xl text-center transition-all shadow-lg"
                  >
                    Interested? Contact Us
                    <ExternalLink className="w-5 h-5" />
                  </motion.a>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

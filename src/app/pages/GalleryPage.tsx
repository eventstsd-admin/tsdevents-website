import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Masonry from 'react-responsive-masonry';
import { Button } from '../components/ui/button';
import { supabase, CATEGORIES } from '../../supabase';
import { SEOComponent, PAGE_SEO } from '../components/SEO-fallback';
import { MessageCircle, Phone, Mail, X, ChevronLeft, ChevronRight } from 'lucide-react';
// Cloudinary URL
const galleryHeroUrl = 'https://res.cloudinary.com/djvccbmtx/image/upload/v1775312277/GalleryHero_j8bvra.jpg';
const galleryHeroImageToUse = galleryHeroUrl;

interface PhotoItem {
  id: string;
  url: string;
  alt_text: string;
  category: string;
}

const categoryFilters = ['All', ...CATEGORIES];
const IMAGES_PER_PAGE = 10;
const MAX_IMAGES = 50;

export default function GalleryPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayedImagesCount, setDisplayedImagesCount] = useState(IMAGES_PER_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Reset displayed count when category changes
  useEffect(() => {
    setDisplayedImagesCount(IMAGES_PER_PAGE);
  }, [selectedCategory]);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_photos')
        .select(`
          id,
          url,
          alt_text,
          gallery_batches (category)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Flatten and shuffle photos
      const flatPhotos: PhotoItem[] = (data || []).map((photo: any) => ({
        id: photo.id,
        url: photo.url,
        alt_text: photo.alt_text,
        category: photo.gallery_batches?.category || 'Uncategorized',
      }));

      // Shuffle randomly
      const shuffled = flatPhotos.sort(() => Math.random() - 0.5);
      setPhotos(shuffled);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages =
    selectedCategory === 'All'
      ? photos
      : photos.filter((img) => img.category === selectedCategory);

  const displayedImages = filteredImages.slice(0, displayedImagesCount);
  const hasMoreImages = displayedImagesCount < filteredImages.length && displayedImagesCount < MAX_IMAGES;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight' && lightboxIndex < displayedImages.length - 1) setLightboxIndex(prev => (prev !== null ? prev + 1 : prev));
      if (e.key === 'ArrowLeft' && lightboxIndex > 0) setLightboxIndex(prev => (prev !== null ? prev - 1 : prev));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, displayedImages.length]);

  const loadMoreImages = () => {
    setLoadingMore(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      setDisplayedImagesCount(prev => Math.min(prev + IMAGES_PER_PAGE, MAX_IMAGES, filteredImages.length));
      setLoadingMore(false);
    }, 500);
  };

  return (
    <div className="bg-white">
      <SEOComponent {...PAGE_SEO.gallery} />
      
      {/* Lightbox */}
      {lightboxIndex !== null && displayedImages[lightboxIndex] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm">
          <button 
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 transition-colors z-[110]"
            onClick={() => setLightboxIndex(null)}
          >
            <X className="w-8 h-8" />
          </button>
          
          <button 
            className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors z-[110] ${lightboxIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
            onClick={(e) => { e.stopPropagation(); if (lightboxIndex > 0) setLightboxIndex(lightboxIndex - 1); }}
            disabled={lightboxIndex === 0}
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <div 
            className="w-full h-full p-4 md:p-12 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => setLightboxIndex(null)}
          >
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              src={displayedImages[lightboxIndex].url}
              alt={displayedImages[lightboxIndex].alt_text}
              className="max-w-full max-h-[85vh] object-contain cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-white mt-4 text-lg font-medium tracking-wide">
              {displayedImages[lightboxIndex].category}
            </p>
            <p className="text-white/60 text-sm mt-1">
              {lightboxIndex + 1} / {displayedImages.length}
            </p>
          </div>

          <button 
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors z-[110] ${lightboxIndex === displayedImages.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
            onClick={(e) => { e.stopPropagation(); if (lightboxIndex < displayedImages.length - 1) setLightboxIndex(lightboxIndex + 1); }}
            disabled={lightboxIndex === displayedImages.length - 1}
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden text-white flex items-center justify-center pt-20">
        <div className="absolute inset-0">
          {/* Background Image */}
          <motion.div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${galleryHeroImageToUse})` }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60" />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-full sm:max-w-4xl w-full sm:w-11/12 mx-auto py-8 sm:py-0">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          >
            Event Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300"
          >
            Professional event photography showcasing our successful celebrations.
          </motion.p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 border-b bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categoryFilters.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20 text-gray-500">Loading gallery...</div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              {selectedCategory === 'All'
                ? 'No photos yet. Check back soon!'
                : `No photos in ${selectedCategory} category.`}
            </div>
          ) : (
            <>
              <Masonry columnsCount={3} gutter="16px">
                {displayedImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    className="relative overflow-hidden cursor-pointer group"
                    onClick={() => setLightboxIndex(index)}
                  >
                    <img
                      src={image.url}
                      alt={image.alt_text}
                      className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Category overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold uppercase tracking-wider">
                        {image.category}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </Masonry>
            </>
          )}

          {/* View More Button */}
          {!loading && filteredImages.length > displayedImagesCount && displayedImagesCount < MAX_IMAGES && (
            <div className="text-center mt-12">
              <Button
                onClick={loadMoreImages}
                disabled={loadingMore}
                variant="ghost"
                className="text-black hover:text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 px-6 py-2 text-sm font-medium transition-all duration-300"
              >
                {loadingMore ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    Loading...
                  </div>
                ) : (
                  <>
                    View More ({Math.min(IMAGES_PER_PAGE, filteredImages.length - displayedImagesCount)} more)
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Want Similar Events for Your Celebration?
            </h2>
            <p className="text-lg text-red-100 mb-8 max-w-2xl mx-auto">
              Let us create memorable moments for your special occasion. Get a free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.open('https://wa.me/919825413606?text=Hi%2C%20I%20saw%20your%20gallery%20and%20I%27m%20interested%20in%20planning%20an%20event.%20Can%20you%20help%3F', '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-md text-lg font-semibold shadow-lg transition-all duration-300"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Contact on WhatsApp
              </Button>
              <Button
                onClick={() => window.location.href = 'mailto:info@tsdevents.in'}
                className="bg-white hover:bg-gray-100 text-red-600 px-8 py-4 rounded-md text-lg font-semibold shadow-lg transition-all duration-300"
              >
                <Mail className="mr-2 w-5 h-5" />
                Write an Email
              </Button>
              <Button
                onClick={() => window.location.href = 'tel:+919825413606'}
                className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-md text-lg font-semibold shadow-lg transition-all duration-300"
              >
                <Phone className="mr-2 w-5 h-5" />
                Call Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
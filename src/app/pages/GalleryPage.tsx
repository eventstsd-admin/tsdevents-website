import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import Masonry from 'react-responsive-masonry';
import { Button } from '../components/ui/button';
import { supabase, CATEGORIES } from '../../supabase';
import { SEOComponent, PAGE_SEO } from '../components/SEO-fallback';
import galleryHeroImage from '../images/Hero Fallback/Gallery/GalleryHero.jpg';

interface PhotoItem {
  id: number;
  url: string;
  alt_text: string;
  category: string;
}

const categoryFilters = ['All', ...CATEGORIES];
const IMAGES_PER_PAGE = 10;
const MAX_IMAGES = 50;

export function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayedImagesCount, setDisplayedImagesCount] = useState(IMAGES_PER_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);

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
        .from('event_photos')
        .select(`
          id,
          url,
          alt_text,
          past_events (category)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Flatten and shuffle photos
      const flatPhotos: PhotoItem[] = (data || []).map((photo: any) => ({
        id: photo.id,
        url: photo.url,
        alt_text: photo.alt_text,
        category: photo.past_events?.category || 'Uncategorized',
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
      
      {/* Hero Section */}
      <section className="relative h-[50vh] text-white flex items-center justify-center pt-20">
        <div className="absolute inset-0">
          {/* Background Image */}
          <motion.div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${galleryHeroImage})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60" />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-none w-3/5 mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            Event Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300"
          >
            Professional event photography showcasing our successful celebrations.
          </motion.p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 border-b bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categoryFilters.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-red-700/90 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </motion.button>
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
                {displayedImages.map((image) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                    className="relative overflow-hidden rounded-2xl shadow-lg cursor-pointer group"
                  >
                    <img
                      src={image.url}
                      alt={image.alt_text}
                      className="w-full h-auto"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4">
                        <span className="text-white font-semibold text-lg">
                          {image.category}
                        </span>
                      </div>
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
                className="text-black hover:text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 px-6 py-2 text-sm font-medium rounded-lg transition-all duration-300"
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
    </div>
  );
}
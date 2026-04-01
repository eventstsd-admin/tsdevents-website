import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  lazy?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+',
  lazy = false,
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(!lazy);

  // Intersection observer for lazy loading
  useEffect(() => {
    if (!lazy) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const target = document.querySelector(`[data-src="${src}"]`);
    if (target) observer.observe(target);

    return () => observer.disconnect();
  }, [lazy, src]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  if (lazy && !shouldLoad) {
    return (
      <div 
        className={`relative bg-gray-100 animate-pulse ${className}`}
        data-src={src}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading skeleton */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          </div>
        </motion.div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}

      {/* Actual image */}
      {shouldLoad && (
        <motion.img
          src={src}
          alt={alt}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ 
            opacity: isLoading ? 0 : 1,
            scale: isLoading ? 1.1 : 1
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      )}
    </div>
  );
};

// Enhanced Hero Image Component
interface HeroImageProps {
  src: string;
  alt: string;
  className?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  children?: React.ReactNode;
  animationType?: 'fade' | 'slideDown';
}

export const HeroImage: React.FC<HeroImageProps> = ({
  src,
  alt,
  className = '',
  overlay = true,
  overlayOpacity = 60,
  children,
  animationType = 'slideDown',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Animation variants based on type
  const getImageAnimation = () => {
    if (animationType === 'slideDown') {
      return {
        initial: { opacity: 0, y: -100, scale: 1.1 },
        animate: { 
          opacity: isLoaded ? 1 : 0,
          y: isLoaded ? 0 : -100,
          scale: isLoaded ? 1 : 1.1
        },
        transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }
      };
    } else {
      return {
        initial: { opacity: 0, scale: 1.05 },
        animate: { 
          opacity: isLoaded ? 1 : 0,
          scale: isLoaded ? 1 : 1.05
        },
        transition: { duration: 0.8, ease: "easeOut" }
      };
    }
  };

  const imageAnim = getImageAnimation();

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading skeleton for hero */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-100"
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-gray-400 border-t-blue-500 rounded-full animate-spin mx-auto" />
              <p className="text-gray-500 font-medium">Loading hero image...</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Hero image */}
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onLoad={() => {
          setIsLoaded(true);
          setIsLoading(false);
        }}
        onError={() => setIsLoading(false)}
        initial={imageAnim.initial}
        animate={imageAnim.animate}
        transition={imageAnim.transition}
      />

      {/* Overlay */}
      {overlay && isLoaded && (
        <motion.div 
          className={`absolute inset-0 bg-black/${overlayOpacity}`}
          initial={{ opacity: 0, y: animationType === 'slideDown' ? -50 : 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        />
      )}

      {/* Content overlay */}
      {children && (
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0, y: animationType === 'slideDown' ? 30 : 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : (animationType === 'slideDown' ? 30 : 20) }}
          transition={{ duration: 1.0, delay: 0.6, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

// Image preloader utility
export const preloadImages = (urls: string[]): Promise<void[]> => {
  return Promise.all(
    urls.map((url) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
      });
    })
  );
};

// Hook for preloading next images
export const useImagePreloader = (images: string[], current: number = 0) => {
  useEffect(() => {
    const nextIndex = (current + 1) % images.length;
    const prevIndex = current === 0 ? images.length - 1 : current - 1;
    
    // Preload next and previous images
    const imagesToPreload = [images[nextIndex], images[prevIndex]];
    preloadImages(imagesToPreload.filter(Boolean));
  }, [images, current]);
};
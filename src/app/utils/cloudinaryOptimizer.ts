/**
 * Cloudinary URL Optimization Helper
 * Optimizes image delivery with transformations for bandwidth reduction
 */

interface CloudinaryOptimizationOptions {
  quality?: number; // 60-85 (default: 75)
  format?: 'auto' | 'webp' | 'jpg'; // auto = best format by browser
  width?: number; // Responsive width
  height?: number; // Responsive height
  crop?: string; // fill, fit, scale, crop, pad
  gravity?: string; // auto, face, center
}

/**
 * Optimize Cloudinary URL for bandwidth
 * @param url Original Cloudinary URL
 * @param options Optimization options
 * @returns Optimized URL with transformations
 */
export const optimizeCloudinaryUrl = (
  url: string,
  options: CloudinaryOptimizationOptions = {}
): string => {
  if (!url.includes('res.cloudinary.com')) {
    return url; // Not a Cloudinary URL
  }

  const {
    quality = 75, // Balance quality vs bandwidth
    format = 'auto',
    width,
    height,
    crop = 'fill',
    gravity = 'auto',
  } = options;

  // Extract upload path and public ID
  const uploadMatch = url.match(/\/upload\/(.+)/);
  if (!uploadMatch) return url;

  const publicId = uploadMatch[1];
  const cloudinaryUrl = url.split('/upload/')[0];

  // Build transformation string
  const transforms = [
    `q_${quality}`, // Quality (1-100, or 'auto')
    `f_${format}`, // Format (auto, webp, jpg, etc)
    ...(width ? [`w_${width}`] : []),
    ...(height ? [`h_${height}`] : []),
    ...(crop && width && height ? [`c_${crop}`] : []),
    ...(gravity && crop === 'fill' ? [`g_${gravity}`] : []),
    'dpr_auto', // Device pixel ratio auto-detection
    'fl_lossy', // Progressive encoding
  ];

  return `${cloudinaryUrl}/upload/${transforms.join(',')}/${publicId}`;
};

/**
 * Get responsive image URLs for different screen sizes
 * @param baseUrl Cloudinary image URL
 * @returns Object with URLs for different sizes
 */
export const getResponsiveCloudinaryUrls = (baseUrl: string) => {
  return {
    mobile: optimizeCloudinaryUrl(baseUrl, { width: 640, quality: 70 }),
    tablet: optimizeCloudinaryUrl(baseUrl, { width: 1024, quality: 75 }),
    desktop: optimizeCloudinaryUrl(baseUrl, { width: 1920, quality: 80 }),
    thumbnail: optimizeCloudinaryUrl(baseUrl, { width: 300, height: 300, quality: 60 }),
  };
};

/**
 * Generate srcSet string for responsive images
 * @param baseUrl Cloudinary image URL
 * @returns srcSet string for img tag
 */
export const getCloudinarySrcSet = (baseUrl: string): string => {
  const sizes = [320, 640, 1024, 1920];
  return sizes
    .map(
      (width) =>
        `${optimizeCloudinaryUrl(baseUrl, { width, quality: 75 })} ${width}w`
    )
    .join(', ');
};

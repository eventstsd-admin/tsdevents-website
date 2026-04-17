/**
 * Cloudinary URL Optimization Helper
 * Optimizes gallery images for responsive sizing
 * Uses auto format selection without re-compressing already-optimized images
 */

interface GalleryOptimizationOptions {
  width?: number;
  height?: number;
}

/**
 * Optimize Cloudinary URL for gallery images only
 * Adds responsive sizing transformations without quality reduction
 * @param url Original Cloudinary URL
 * @param options Width/height options
 * @returns Optimized URL with transformations
 */
export const optimizeGalleryImage = (
  url: string,
  options: GalleryOptimizationOptions = {}
): string => {
  if (!url || !url.includes('res.cloudinary.com')) {
    return url;
  }

  const { width, height } = options;

  // Extract upload path and public ID
  const uploadMatch = url.match(/\/upload\/(.+)$/);
  if (!uploadMatch) return url;

  const publicId = uploadMatch[1];
  const cloudinaryUrl = url.split('/upload/')[0];

  // Build transformation string
  const transforms = [
    ...(width ? [`w_${width}`] : []),
    ...(height ? [`h_${height}`] : []),
    ...(width && height ? ['c_fill'] : []),
    'f_auto', // Auto format selection (WebP for modern browsers)
  ];

  return `${cloudinaryUrl}/upload/${transforms.join(',')}/${publicId}`;
};

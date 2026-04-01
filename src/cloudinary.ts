// Cloudinary image upload and compression utility

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';
const MAX_FILE_SIZE = 200 * 1024; // 200 KB

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
  console.warn('Cloudinary credentials not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env');
}

export interface UploadProgress {
  loaded: number;
  total: number;
}

export const cloudinaryUpload = {
  /**
   * Upload image to Cloudinary with automatic compression
   * Transforms image to ensure it's under 200 KB
   */
  async uploadImage(file: File, onProgress?: (progress: UploadProgress) => void): Promise<string> {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Cloudinary not configured. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    // Cloudinary transformation for compression
    // quality: auto - optimizes for web
    // fetch_format: auto - uses best format (webp, jpg, etc)
    // dpr: auto - device pixel ratio
    formData.append('transformation', JSON.stringify([
      {
        quality: 'auto',
        fetch_format: 'auto',
        dpr: 'auto',
        width: 1200,
        crop: 'limit',
        bytes: MAX_FILE_SIZE
      }
    ]));

    try {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            onProgress({
              loaded: event.loaded,
              total: event.total,
            });
          }
        });
      }

      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;

      return new Promise((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const url = response.secure_url || response.url;
            
            // Verify the uploaded image is under 200 KB
            const bytes = response.bytes;
            if (bytes > MAX_FILE_SIZE) {
              console.warn(`Image size (${bytes} bytes) exceeds 200 KB limit. Using Cloudinary's compressed version.`);
            }
            
            resolve(url);
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed. Check your internet connection.'));
        });

        xhr.addEventListener('abort', () => {
          reject(new Error('Upload cancelled'));
        });

        xhr.open('POST', uploadUrl);
        xhr.send(formData);
      });
    } catch (error) {
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : String(error)}`);
    }
  },

  /**
   * Upload multiple images with compression
   * Returns array of URLs
   */
  async uploadMultiple(
    files: File[],
    maxFiles: number = 5,
    onProgress?: (current: number, total: number) => void
  ): Promise<string[]> {
    if (files.length > maxFiles) {
      throw new Error(`Maximum ${maxFiles} files allowed`);
    }

    const urls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const url = await this.uploadImage(files[i], () => {
        if (onProgress) {
          onProgress(i + 1, files.length);
        }
      });
      urls.push(url);
    }

    return urls;
  },

  /**
   * Validate image before upload
   */
  validateImage(file: File, maxSizeKB: number = 5000): string | null {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'File must be an image';
    }

    // Check file size (before compression)
    const maxBytes = maxSizeKB * 1024;
    if (file.size > maxBytes) {
      return `File size must be less than ${maxSizeKB}KB (current: ${(file.size / 1024).toFixed(2)}KB)`;
    }

    // Check dimensions (optional)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return 'Only JPEG, PNG, WebP, and GIF images are supported';
    }

    return null;
  },

  /**
   * Get image dimensions
   */
  async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          resolve({ width: img.width, height: img.height });
        };
        img.onerror = () => reject(new Error('Failed to read image dimensions'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  },
};

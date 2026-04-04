import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../supabase';
import { Button } from './ui/button';
import { Upload, X } from 'lucide-react';

interface PastEventUploadProps {
  eventId: string;
  eventTitle: string;
  onUploadComplete?: () => void;
}

// Image compression function with strict 100KB limit
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Aggressive dimension reduction
        const MAX_DIMENSION = 800;
        if (width > height && width > MAX_DIMENSION) {
          height = (height * MAX_DIMENSION) / width;
          width = MAX_DIMENSION;
        } else if (height > MAX_DIMENSION) {
          width = (width * MAX_DIMENSION) / height;
          height = MAX_DIMENSION;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
        }

        // Recursive compression function with quality reduction loop
        const compressWithQuality = (quality: number, attempt: number): void => {
          if (quality < 0.1 || attempt > 10) {
            // Fallback: accept whatever we have if quality gets too low
            canvas.toBlob((blob) => {
              const compressedFile = new File([blob || new Blob()], file.name, {
                type: 'image/jpeg',
              });
              resolve(compressedFile);
            }, 'image/jpeg', 0.1);
            return;
          }

          canvas.toBlob((blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            // If under 100KB, we're done
            if (blob.size <= 100 * 1024) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
              });
              resolve(compressedFile);
              return;
            }

            // Still too large, reduce quality and try again
            const newQuality = quality - 0.1;
            compressWithQuality(newQuality, attempt + 1);
          }, 'image/jpeg', quality);
        };

        // Start with quality 0.8
        compressWithQuality(0.8, 0);
      };
    };
  });
}

export function PastEventUploadNew({ eventId, eventTitle, onUploadComplete }: PastEventUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const MAX_FILE_SIZE = 100 * 1024; // 100KB
    const totalFiles = files.length + selectedFiles.length;

    if (totalFiles > 5) {
      toast.error(`Maximum 5 photos per event. You have ${files.length} selected.`);
      e.target.value = '';
      return;
    }

    // Validate file sizes before adding
    const oversizedFiles = selectedFiles.filter(f => f.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      const sizes = oversizedFiles.map(f => `${f.name} (${(f.size / 1024).toFixed(2)}KB)`).join(', ');
      toast.error(`These images exceed 100KB: ${sizes}. Please compress before uploading.`);
      e.target.value = '';
      return;
    }

    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    setLoading(true);
    let successCount = 0;

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        toast.error('Supabase not configured');
        setLoading(false);
        return;
      }

      for (let i = 0; i < files.length; i++) {
        try {
          setUploadProgress(Math.round(((i + 1) / files.length) * 100));

          // Compress image
          const compressedFile = await compressImage(files[i]);
          const fileSizeKb = (compressedFile.size / 1024).toFixed(2);
          console.log(`Compressed ${files[i].name}: ${fileSizeKb}KB`);

          // Call Edge Function to get signature
          const folder = `tsd-events/past-events/${eventId}`;
          const signResponse = await fetch(
            `${supabaseUrl}/functions/v1/sign-cloudinary-upload`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseAnonKey}`,
              },
              body: JSON.stringify({ folder }),
            }
          );

          if (!signResponse.ok) {
            const errorData = await signResponse.text();
            console.error('Sign error:', signResponse.status, errorData);
            toast.error(`Signature error (${signResponse.status})`);
            continue;
          }

          const { cloud_name, api_key, signature, timestamp, upload_preset } = await signResponse.json();

          // Upload to Cloudinary with signature
          const formData = new FormData();
          formData.append('file', compressedFile);
          formData.append('upload_preset', upload_preset);
          formData.append('api_key', api_key);
          formData.append('signature', signature);
          formData.append('timestamp', timestamp.toString());
          formData.append('folder', folder);

          const uploadRes = await fetch(
            `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
            { method: 'POST', body: formData }
          );

          const cloudinaryData = await uploadRes.json();

          if (!uploadRes.ok) {
            console.error('Cloudinary failed:', cloudinaryData.error);
            toast.error(`Upload failed: ${cloudinaryData.error?.message || 'Unknown error'}`);
            continue;
          }

          // Save URL to Supabase
          const { error: dbError } = await supabase
            .from('event_photos')
            .insert({
              event_id: eventId,
              url: cloudinaryData.secure_url,
              alt_text: files[i].name,
            });

          if (dbError) {
            console.error('Database error:', dbError);
            toast.error('Failed to save photo URL');
            continue;
          }

          successCount++;
          toast.success(`✅ ${files[i].name} uploaded!`);
        } catch (error) {
          console.error('Error uploading', files[i].name, error);
          toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      if (successCount > 0) {
        toast.success(`✅ ${successCount} image(s) uploaded successfully!`);
        setFiles([]);
        setUploadProgress(0);
        // Notify parent to refresh
        onUploadComplete?.();
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-300">
      <h3 className="text-lg font-semibold mb-4">Upload Photos for "{eventTitle}"</h3>
      <p className="text-sm text-gray-600 mb-4">
        Maximum 5 photos per event • Images will be compressed to 200KB
      </p>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="block w-full mb-4 p-2 border border-gray-300 rounded"
        disabled={loading || files.length >= 5}
      />

      {/* Selected Files Preview */}
      {files.length > 0 && (
        <div className="mb-4 p-4 bg-gray-50 rounded">
          <p className="text-sm font-medium mb-2">
            Selected: {files.length}/5 photos
          </p>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex-1">
                  <span className="text-gray-700">{file.name}</span>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB (will be compressed)
                  </p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-800 ml-2"
                  disabled={loading}
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {loading && uploadProgress > 0 && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-700 h-2 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Uploading: {uploadProgress}%
          </p>
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={loading || files.length === 0}
        className="w-full bg-red-700/90 hover:bg-red-800/90"
      >
        <Upload className="mr-2 w-4 h-4" />
        {loading ? `Uploading (${uploadProgress}%)...` : `Upload ${files.length} Photo(s)`}
      </Button>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../supabase';
import { CATEGORIES } from '../constants';
import { Button } from './ui/button';
import { Trash2, ChevronDown, Plus, X } from 'lucide-react';

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

        const compressWithQuality = (quality: number, attempt: number): void => {
          if (quality < 0.1 || attempt > 10) {
            canvas.toBlob((blob) => {
              resolve(new File([blob || new Blob()], file.name, { type: 'image/jpeg' }));
            }, 'image/jpeg', 0.1);
            return;
          }

          canvas.toBlob((blob) => {
            if (!blob) return resolve(file);
            if (blob.size <= 100 * 1024) return resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            compressWithQuality(quality - 0.1, attempt + 1);
          }, 'image/jpeg', quality);
        };

        compressWithQuality(0.8, 0);
      };
    };
  });
}

interface GalleryBucket {
  id: string;
  category: string;
  created_at: string;
}

interface GalleryWithPhotos extends GalleryBucket {
  photo_count: number;
  photo_urls?: string[];
  expanded: boolean;
}

export function GalleryManager() {
  const [galleries, setGalleries] = useState<GalleryWithPhotos[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('gallery_batches')
        .select(`
          id,
          category,
          created_at,
          gallery_photos (id, url)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        toast.error('Failed to load gallery uploads');
        return;
      }

      const formatted: GalleryWithPhotos[] = (data || []).map((batch: any) => ({
        id: batch.id,
        title: batch.category,
        category: batch.category,
        created_at: batch.created_at,
        photo_count: batch.gallery_photos?.length || 0,
        photo_urls: batch.gallery_photos?.map((p: any) => p.url) || [],
        expanded: false,
      }));

      setGalleries(formatted);
    } catch (error) {
      console.error('Error fetching galleries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) {
      toast.error('Please select a category');
      return;
    }

    if (selectedImages.length === 0) {
      toast.error('Please select at least 1 image');
      return;
    }

    if (selectedImages.length > 15) {
      toast.error('Maximum 15 images allowed per upload');
      return;
    }

    setLoading(true);
    try {
      // Create a gallery batch first
      const { data, error } = await supabase
        .from('gallery_batches')
        .insert([{
          category: selectedCategory,
        }])
        .select();

      if (error) throw error;

      const batchId = data[0].id;
      await uploadEventImages(batchId);

      toast.success('Gallery photos uploaded successfully!');
      setSelectedCategory('');
      setSelectedImages([]);
      setShowAddForm(false);
      fetchGalleries();
    } catch (error) {
      console.error('Error creating gallery bucket:', error);
      toast.error('Failed to upload gallery. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const uploadEventImages = async (batchId: string) => {
    for (const file of selectedImages) {
      try {
        let uploadFile = file;

        if (file.type.startsWith('image/')) {
          uploadFile = await compressImage(file);
        }

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        const folder = `tsd-events/gallery/${batchId}`;

        const signResponse = await fetch(
          `${supabaseUrl}/functions/v1/sign-cloudinary-upload`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${supabaseAnonKey}`,
            },
            body: JSON.stringify({ folder }),
          }
        );

        if (!signResponse.ok) {
          toast.error('Failed to get upoad signature');
          continue;
        }

        const { cloud_name, api_key, signature, timestamp, upload_preset } = await signResponse.json();

        const formData = new FormData();
        formData.append('file', uploadFile);
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

        if (!uploadRes.ok) continue;

        await supabase
          .from('gallery_photos')
          .insert({
            batch_id: batchId,
            url: cloudinaryData.secure_url,
            alt_text: file.name,
          });

        toast.success(`✅ Uploaded: ${file.name}`);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    setSelectedImages([]);
  };

  const handleDeleteGallery = async (eventId: string) => {
    if (!confirm('Delete these gallery photos permanently?')) return;

    setLoading(true);
    try {
      const eventToDelete = galleries.find(e => e.id === eventId);
      
      if (eventToDelete?.photo_urls && eventToDelete.photo_urls.length > 0) {
        const { cloudinaryUpload } = await import('../../cloudinary');
        await cloudinaryUpload.deleteMultiple(eventToDelete.photo_urls);
      }

      await supabase.from('gallery_photos').delete().eq('batch_id', eventId);
      await supabase.from('gallery_batches').delete().eq('id', eventId);

      toast.success('Gallery photos deleted successfully');
      fetchGalleries();
    } catch (error) {
      console.error('Error deleting gallery:', error);
      toast.error('Failed to delete gallery photos');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (eventId: string) => {
    setGalleries(
      galleries.map((e) =>
        e.id === eventId ? { ...e, expanded: !e.expanded } : e
      )
    );
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const totalFiles = selectedImages.length + newFiles.length;

    if (totalFiles > 15) {
      toast.error('Maximum 15 images allowed per upload bulk');
      return;
    }

    setSelectedImages([...selectedImages, ...newFiles]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  if (loading && galleries.length === 0) {
    return <div className="text-center py-12"><p className="text-gray-600">Loading gallery uploads...</p></div>;
  }

  return (
    <div className="space-y-6">
      {/* Add Photos Button */}
      <div>
        {!showAddForm ? (
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-red-700/90 hover:bg-red-800/90 gap-2"
          >
            <Plus size={20} />
            Bulk Upload Gallery Photos
          </Button>
        ) : (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Upload Gallery Photos</h2>
              <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUploadGallery} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Category *</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className={`border-2 border-dashed rounded-lg p-4 ${selectedImages.length === 0 ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}>
                <label className="block text-sm font-medium mb-1">
                  Upload Photos * <span className="text-red-800">(Max 15 images)</span>
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="block w-full mb-3"
                  disabled={selectedImages.length >= 15}
                />

                {selectedImages.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <p className="text-sm text-gray-600 font-medium">
                      Selected: {selectedImages.length}/15 images
                    </p>
                    <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-white border border-gray-200 p-2 rounded">
                          <span className="text-sm text-gray-700 truncate mr-4">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="text-red-800 hover:text-red-900 shrink-0"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedImages.length === 0 && (
                  <p className="text-sm text-red-800 mt-2">⚠️ Please select images to upload</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || selectedImages.length === 0 || !selectedCategory}
                className="w-full bg-red-700/90 hover:bg-red-800/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Uploading...' : `Upload ${selectedImages.length} Photo${selectedImages.length !== 1 ? 's' : ''} to ${selectedCategory || 'Category'}`}
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Galleries List */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Gallery Uploads ({galleries.length})</h2>
        <div className="space-y-4">
          {galleries.map((gallery) => (
            <div key={gallery.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => toggleExpanded(gallery.id)}
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{gallery.category} Photos</h3>
                  <p className="text-sm text-gray-600">
                    Uploaded on {new Date(gallery.created_at).toLocaleDateString()} •{' '}
                    <span className="font-medium">{gallery.photo_count} photos</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGallery(gallery.id);
                    }}
                    className="text-red-800 hover:text-red-900 hover:bg-red-100"
                  >
                    <Trash2 size={18} />
                  </Button>
                  <ChevronDown
                    size={20}
                    className={`transform transition ${gallery.expanded ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>

              {gallery.expanded && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  {gallery.photo_urls && gallery.photo_urls.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {gallery.photo_urls.map((url, i) => (
                        <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-white">
                          <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No photos in this upload batch.</p>
                  )}
                </div>
              )}
            </div>
          ))}

          {galleries.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No gallery photos uploaded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

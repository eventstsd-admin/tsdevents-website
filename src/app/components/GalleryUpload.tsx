import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../supabase';
import { Button } from './ui/button';
import { Upload } from 'lucide-react';

export function GalleryUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState('Wedding');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select an image');
      return;
    }

    setLoading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        toast.error('Supabase not configured');
        setLoading(false);
        return;
      }

      // Get signed parameters from Edge Function
      const signResponse = await fetch(
        `${supabaseUrl}/functions/v1/sign-cloudinary-upload`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({}),
        }
      );

      if (!signResponse.ok) {
        const errorText = await signResponse.text();
        console.error('Sign response error:', errorText);
        toast.error('Upload not authorized');
        setLoading(false);
        return;
      }

      const { cloud_name, signature, timestamp, upload_preset } = await signResponse.json();

      // Upload to Cloudinary with signature
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', upload_preset);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('folder', 'tsd-events/gallery');

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        { method: 'POST', body: formData }
      );

      const cloudinaryData = await uploadRes.json();

      if (!uploadRes.ok) {
        console.error('Cloudinary error:', cloudinaryData);
        toast.error(`Upload failed: ${cloudinaryData.error?.message || 'Unknown error'}`);
        setLoading(false);
        return;
      }

      // Get session for user ID
      const { data: { session } } = await supabase.auth.getSession();

      // Save to Supabase
      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert({
          url: cloudinaryData.secure_url,
          category,
          alt_text: `${category} event image`,
          uploaded_by: session?.user?.id || null,
        });

      if (dbError) {
        console.error('Database error:', dbError);
        toast.error('Failed to save to database');
        return;
      }

      toast.success('✅ Image uploaded successfully!');
      setFile(null);
      setCategory('Wedding');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-300">
      <h3 className="text-lg font-semibold mb-4">Upload Gallery Image</h3>
      
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full mb-4 p-2 border border-gray-300 rounded"
        disabled={loading}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
        disabled={loading}
      >
        <option>Wedding</option>
        <option>Corporate</option>
        <option>Party</option>
        <option>Concert</option>
        <option>Decoration</option>
        <option>Catering</option>
      </select>

      <Button
        onClick={handleUpload}
        disabled={loading || !file}
        className="w-full bg-red-700/90 hover:bg-red-800/90"
      >
        <Upload className="mr-2 w-4 h-4" />
        {loading ? 'Uploading...' : 'Upload Image'}
      </Button>
    </div>
  );
}

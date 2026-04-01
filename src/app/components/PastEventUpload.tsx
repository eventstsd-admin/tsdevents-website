import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../supabase';
import { Button } from './ui/button';
import { Upload, X } from 'lucide-react';

interface PastEventUploadProps {
  eventId: number;
  eventTitle: string;
}

export function PastEventUpload({ eventId, eventTitle }: PastEventUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const totalFiles = files.length + selectedFiles.length;

    if (totalFiles > 5) {
      toast.error(`Maximum 5 photos per event. You have ${files.length} selected.`);
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

      const { data: { session } } = await supabase.auth.getSession();

      for (const file of files) {
        try {
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
            const errorData = await signResponse.text();
            console.error('Sign error:', signResponse.status, errorData);
            toast.error(`Signature error (${signResponse.status})`);
            continue;
          }

          const { cloud_name, signature, timestamp, upload_preset } = await signResponse.json();

          // Upload to Cloudinary with signature
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', upload_preset);
          formData.append('signature', signature);
          formData.append('timestamp', timestamp.toString());
          formData.append('folder', `tsd-events/past-events/${eventId}`);

          const uploadRes = await fetch(
            `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
            { method: 'POST', body: formData }
          );

          const cloudinaryData = await uploadRes.json();

          if (!uploadRes.ok) {
            console.error('Cloudinary failed:', cloudinaryData.error);
            toast.error(`Failed to upload ${file.name}`);
            continue;
          }

          // Save to Supabase
          const { error: dbError } = await supabase
            .from('event_photos')
            .insert({
              event_id: eventId,
              url: cloudinaryData.secure_url,
              alt_text: file.name,
              uploaded_by: session?.user?.id || null,
            });

          if (dbError) {
            console.error('Database error:', dbError);
            continue;
          }

          successCount++;
          toast.success(`✅ ${file.name} uploaded!`);
        } catch (error) {
          console.error('Error uploading', file.name, error);
          toast.error(`Error uploading ${file.name}`);
        }
      }

      if (successCount > 0) {
        toast.success(`✅ ${successCount} image(s) uploaded successfully!`);
        setFiles([]);
        setUploadedCount(uploadedCount + successCount);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-300">
      <h3 className="text-lg font-semibold mb-4">Upload Photos for "{eventTitle}"</h3>
      <p className="text-sm text-gray-600 mb-4">Maximum 5 photos per event</p>

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
                <span className="text-gray-700">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-800"
                  disabled={loading}
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={loading || files.length === 0}
        className="w-full bg-red-700/90 hover:bg-red-800/90"
      >
        <Upload className="mr-2 w-4 h-4" />
        {loading ? `Uploading (${uploadedCount}/${files.length})...` : `Upload ${files.length} Photo(s)`}
      </Button>
    </div>
  );
}

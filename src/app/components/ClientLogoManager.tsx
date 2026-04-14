import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../supabase';
import { Button } from './ui/button';
import { Trash2, Plus, X } from 'lucide-react';

export interface ClientLogo {
  id: string;
  image_url: string;
  alt_text: string;
  created_at: string;
}

// Iterative compression — reduces quality then dimensions until < 30KB
async function compressLogoImage(file: File): Promise<File> {
  const TARGET_SIZE = 30 * 1024; // 30 KB

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const MAX_START = 400;
        let width = img.width;
        let height = img.height;
        if (width > height && width > MAX_START) {
          height = Math.round((height * MAX_START) / width);
          width = MAX_START;
        } else if (height > MAX_START) {
          width = Math.round((width * MAX_START) / height);
          height = MAX_START;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        const drawCanvas = () => {
          canvas.width = width;
          canvas.height = height;
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
        };

        const tryQuality = (q: number): Promise<Blob | null> =>
          new Promise((res) => canvas.toBlob(res, 'image/webp', q));

        const outName = file.name.replace(/\.[^/.]+$/, '') + '.webp';

        const compressLoop = async (): Promise<File> => {
          drawCanvas();
          for (let q = 0.85; q >= 0.05; q = Math.round((q - 0.1) * 100) / 100) {
            const blob = await tryQuality(q);
            if (!blob) break;
            if (blob.size <= TARGET_SIZE)
              return new File([blob], outName, { type: 'image/webp' });
          }
          if (width > 60 && height > 60) {
            width = Math.round(width * 0.8);
            height = Math.round(height * 0.8);
            return compressLoop();
          }
          const blob = await tryQuality(0.05);
          return new File([blob || new Blob()], outName, { type: 'image/webp' });
        };

        compressLoop().then(resolve);
      };
    };
  });
}

export function ClientLogoManager() {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [altText, setAltText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('client_logos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load client logos');
    } else {
      setLogos(data as ClientLogo[]);
    }
    setLoading(false);
  };

  const uploadImage = async (file: File): Promise<string> => {
    toast.loading('Optimizing logo...', { id: 'logo_upload' });
    
    // Strict compression to 30KB
    const compressedFile = await compressLogoImage(file);
    
    if (compressedFile.size > 30 * 1024) {
      toast.error('Image is too complex to fit in 30KB. Please select a simpler image.', { id: 'logo_upload' });
      throw new Error('Image too large');
    }
    
    toast.loading(`Uploading compressed logo (${(compressedFile.size / 1024).toFixed(1)} KB)...`, { id: 'logo_upload' });

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const signResponse = await fetch(
      `${supabaseUrl}/functions/v1/sign-cloudinary-upload`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ folder: 'tsd-events/clients' }),
      }
    );

    if (!signResponse.ok) throw new Error('Failed to get signature');
    const { cloud_name, api_key, signature, timestamp, upload_preset } = await signResponse.json();

    const formData = new FormData();
    formData.append('file', compressedFile);
    formData.append('upload_preset', upload_preset);
    formData.append('api_key', api_key);
    formData.append('signature', signature);
    formData.append('timestamp', timestamp.toString());
    formData.append('folder', 'tsd-events/clients');

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      { method: 'POST', body: formData }
    );
    if (!uploadRes.ok) throw new Error('Cloudinary upload failed');
    const cloudinaryData = await uploadRes.json();
    
    toast.success('Logo optimized and uploaded successfully', { id: 'logo_upload' });
    return cloudinaryData.secure_url;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!altText) return toast.error('Client name is required');
    if (!imageFile) return toast.error('An image is required');

    setSaving(true);
    try {
      const finalImageUrl = await uploadImage(imageFile);

      const { error } = await supabase.from('client_logos').insert({
        alt_text: altText, image_url: finalImageUrl
      });
      
      if (error) {
        toast.dismiss('logo_upload');
        throw error;
      }
      toast.success('Client logo added!');

      resetForm();
      fetchLogos();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save client logo');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Are you sure you want to remove this client logo?')) return;
    try {
      await supabase.from('client_logos').delete().eq('id', id);
      toast.success('Removed client logo');
      fetchLogos();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setAltText('');
    setImageFile(null);
  };

  if (loading) return <div className="text-center py-10">Loading logos...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Client Logos</h2>
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)} className="bg-red-700/90 hover:bg-red-800/90 gap-2">
            <Plus size={20} /> Add Logo
          </Button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Add New Logo</h3>
            <button onClick={resetForm}><X className="text-gray-500 hover:text-black" /></button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company / Event Name *</label>
              <input required value={altText} onChange={e => setAltText(e.target.value)} className="w-full px-4 py-2 border rounded" placeholder="E.g. Shashwat Marketing" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Upload Logo Image *</label>
              <input required type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full" />
            </div>
            <Button type="submit" disabled={saving} className="bg-red-700/90 hover:bg-red-800/90 text-white px-6">
              {saving ? 'Saving...' : 'Save Logo'}
            </Button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {logos.map((logo) => (
          <div key={logo.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col group p-4 relative items-center justify-center">
            <img src={logo.image_url} alt={logo.alt_text} className="w-full h-24 object-contain" />
            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm font-medium">{logo.alt_text}</p>
            </div>
            <button onClick={() => handleDelete(logo.id, logo.image_url)} className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-red-600 hover:text-red-800 md:opacity-0 group-hover:opacity-100 transition-opacity drop-shadow">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {logos.length === 0 && !showAddForm && (
          <div className="col-span-full py-10 text-center text-gray-500 border border-dashed rounded-xl bg-gray-50">
            No logos added yet. Click 'Add Logo' to start.
          </div>
        )}
      </div>
    </div>
  );
}

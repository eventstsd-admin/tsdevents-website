import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../supabase';
import { Button } from './ui/button';
import { Trash2, Edit, Plus, X, ArrowUp, ArrowDown } from 'lucide-react';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image_url: string;
  sort_order: number;
}

// Iterative compression — reduces quality then dimensions until < 50KB
async function compressImage(file: File): Promise<File> {
  const TARGET_SIZE = 50 * 1024; // 50 KB

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const MAX_START = 600;
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
          new Promise((res) => canvas.toBlob(res, 'image/jpeg', q));

        const compressLoop = async (): Promise<File> => {
          drawCanvas();
          for (let q = 0.85; q >= 0.05; q = Math.round((q - 0.1) * 100) / 100) {
            const blob = await tryQuality(q);
            if (!blob) break;
            if (blob.size <= TARGET_SIZE)
              return new File([blob], file.name, { type: 'image/jpeg' });
          }
          if (width > 80 && height > 80) {
            width = Math.round(width * 0.8);
            height = Math.round(height * 0.8);
            return compressLoop();
          }
          const blob = await tryQuality(0.05);
          return new File([blob || new Blob()], file.name, { type: 'image/jpeg' });
        };

        compressLoop().then(resolve);
      };
    };
  });
}

export function TeamManager() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      toast.error('Failed to load team members');
    } else {
      setMembers(data as TeamMember[]);
    }
    setLoading(false);
  };

  const uploadImage = async (file: File): Promise<string> => {
    toast.loading('Optimizing image...', { id: 'team_upload' });
    
    // Strict compression to 50KB
    const compressedFile = await compressImage(file);
    
    if (compressedFile.size > 50 * 1024) {
      toast.error('Image is too complex to fit in 50KB. Please select a simpler image.', { id: 'team_upload' });
      throw new Error('Image too large');
    }
    
    toast.loading(`Uploading compressed image (${(compressedFile.size / 1024).toFixed(1)} KB)...`, { id: 'team_upload' });

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
        body: JSON.stringify({ folder: 'tsd-events/team' }),
      }
    );

    if (!signResponse.ok) throw new Error('Failed to get signature');
    const { cloud_name, api_key, signature, timestamp, upload_preset } = await signResponse.json();

    const formData = new FormData();
    formData.append('file', compressedFile);  // ← use compressed, not original
    formData.append('upload_preset', upload_preset);
    formData.append('api_key', api_key);
    formData.append('signature', signature);
    formData.append('timestamp', timestamp.toString());
    formData.append('folder', 'tsd-events/team');

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      { method: 'POST', body: formData }
    );
    if (!uploadRes.ok) throw new Error('Cloudinary upload failed');
    const cloudinaryData = await uploadRes.json();
    
    toast.success('Image optimized and uploaded successfully', { id: 'team_upload' });
    return cloudinaryData.secure_url;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role) return toast.error('Name and Role are required');
    if (!imageFile && !existingImageUrl) return toast.error('An image is required');

    setSaving(true);
    try {
      let finalImageUrl = existingImageUrl;
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      if (editingId) {
        const { error } = await supabase.from('team_members').update({
          name, role, image_url: finalImageUrl
        }).eq('id', editingId);
        if (error) {
          toast.dismiss('team_upload');
          throw error;
        }
        toast.success('Team member saved!');
      } else {
        const newSortOrder = members.length > 0 ? Math.max(...members.map(m => m.sort_order)) + 1 : 1;
        const { error } = await supabase.from('team_members').insert({
          name, role, image_url: finalImageUrl, sort_order: newSortOrder
        });
        if (error) {
          toast.dismiss('team_upload');
          throw error;
        }
        toast.success('Team member added!');
      }

      resetForm();
      fetchMembers();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save team member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    try {
      await supabase.from('team_members').delete().eq('id', id);
      toast.success('Removed team member');
      fetchMembers();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setName(member.name);
    setRole(member.role);
    setExistingImageUrl(member.image_url);
    setImageFile(null);
    setShowAddForm(true);
  };

  const moveMember = async (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= members.length) return;
    
    const newMembers = [...members];
    const temp = newMembers[index].sort_order;
    newMembers[index].sort_order = newMembers[index + direction].sort_order;
    newMembers[index + direction].sort_order = temp;

    // Update locally immediately
    const swapped = [...newMembers].sort((a, b) => a.sort_order - b.sort_order);
    setMembers(swapped);

    // Save to DB
    await Promise.all([
      supabase.from('team_members').update({ sort_order: newMembers[index].sort_order }).eq('id', newMembers[index].id),
      supabase.from('team_members').update({ sort_order: newMembers[index + direction].sort_order }).eq('id', newMembers[index + direction].id)
    ]);
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setName('');
    setRole('');
    setImageFile(null);
    setExistingImageUrl('');
  };

  if (loading) return <div className="text-center py-10">Loading team...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Members</h2>
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)} className="bg-red-700/90 hover:bg-red-800/90 gap-2">
            <Plus size={20} /> Add Member
          </Button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">{editingId ? 'Edit Team Member' : 'Add New Member'}</h3>
            <button onClick={resetForm}><X className="text-gray-500 hover:text-black" /></button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border rounded" placeholder="E.g. Timir Shah" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role *</label>
                <input required value={role} onChange={e => setRole(e.target.value)} className="w-full px-4 py-2 border rounded" placeholder="E.g. Founder" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Photo *</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full" />
              {existingImageUrl && !imageFile && (
                <div className="mt-2 text-sm text-gray-500">
                  Current: <img src={existingImageUrl} alt="Current" className="w-16 h-16 object-cover rounded mt-1" />
                </div>
              )}
            </div>
            <Button type="submit" disabled={saving} className="bg-red-700/90 hover:bg-red-800/90 text-white px-6">
              {saving ? 'Saving...' : 'Save Member'}
            </Button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {members.map((member, idx) => (
          <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <img src={member.image_url} alt={member.name} className="w-full h-48 object-cover" />
            <div className="p-4 flex-1">
              <h4 className="font-bold text-lg">{member.name}</h4>
              <p className="text-gray-600 text-sm">{member.role}</p>
            </div>
            <div className="border-t border-gray-100 p-2 bg-gray-50 flex justify-between items-center">
              <div className="flex gap-1">
                <button onClick={() => moveMember(idx, -1)} disabled={idx === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30">
                  <ArrowUp size={18} />
                </button>
                <button onClick={() => moveMember(idx, 1)} disabled={idx === members.length - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30">
                  <ArrowDown size={18} />
                </button>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(member)} className="text-blue-600 hover:text-blue-800 p-1">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(member.id, member.image_url)} className="text-red-600 hover:text-red-800 p-1">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

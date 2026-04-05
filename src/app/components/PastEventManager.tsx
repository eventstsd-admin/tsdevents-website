import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, Upload, X, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { pastEventOperations, type PastEvent, CATEGORIES_WITH_SUBCATEGORIES } from '../../supabase';
import { cloudinaryUpload } from '../../cloudinary';

interface FormData {
  title: string;
  date: string;
  time: string;
  category: string;
  subcategory: string;
  location: string;
  photos: File[];
}

export function PastEventManager({ events, onRefresh }: { events: PastEvent[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    date: '',
    time: '',
    category: '',
    subcategory: '',
    location: '',
    photos: [],
  });
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate max 5 photos
    if (files.length + photoPreviewUrls.length > 5) {
      setError('Maximum 5 photos allowed');
      return;
    }

    // Validate file size and type
    for (const file of files) {
      const error = cloudinaryUpload.validateImage(file);
      if (error) {
        setError(error);
        return;
      }
    }

    setFormData({ ...formData, photos: [...formData.photos, ...files] });

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPhotoPreviewUrls([...photoPreviewUrls, ...newPreviews]);
    setError(null);
  };

  const removePhoto = (index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    const newPreviews = photoPreviewUrls.filter((_, i) => i !== index);
    setFormData({ ...formData, photos: newPhotos });
    setPhotoPreviewUrls(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate form
    if (!formData.title || !formData.date || !formData.time || !formData.category || !formData.location) {
      setError('Please fill in all required fields');
      return;
    }

    setUploading(true);

    try {
      let photoUrls: string[] = [];

      // Upload photos to Cloudinary if any
      if (formData.photos.length > 0) {
        photoUrls = await cloudinaryUpload.uploadMultiple(
          formData.photos,
          5,
          (current, total) => {
            setUploadProgress(Math.round((current / total) * 100));
          }
        );
      }

      // Create event in Supabase
      if (editingId) {
        await pastEventOperations.update(editingId, {
          ...formData,
          photo_urls: photoUrls.length > 0 ? photoUrls : undefined,
        });
        setSuccess('Event updated successfully!');
        setEditingId(null);
      } else {
        await pastEventOperations.create({
          ...formData,
          photo_urls: photoUrls,
        });
        setSuccess('Event added successfully!');
      }

      // Reset form
      setFormData({
        title: '',
        date: '',
        time: '',
        category: '',
        subcategory: '',
        location: '',
        photos: [],
      });
      setPhotoPreviewUrls([]);
      setShowForm(false);
      setUploadProgress(0);

      // Refresh events list
      setTimeout(onRefresh, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to add event');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await pastEventOperations.delete(id);
      setSuccess('Event deleted successfully!');
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete event');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Past Events</h2>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              title: '',
              date: '',
              time: '',
              category: '',
              subcategory: '',
              location: '',
              photos: [],
            });
            setPhotoPreviewUrls([]);
            setShowSubcategoryDropdown(false);
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3"
        >
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-green-700">{success}</p>
        </motion.div>
      )}

      {/* Form */}
      {showForm && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Event' : 'Add New Event'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., John & Sarah's Wedding"
                  required
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    setFormData({ ...formData, category: e.target.value, subcategory: '' });
                    setShowSubcategoryDropdown(!!e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  {Object.keys(CATEGORIES_WITH_SUBCATEGORIES).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory Dropdown Card */}
              <AnimatePresence>
                {formData.category && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="relative"
                  >
                    <div className="block text-sm font-medium text-gray-700 mb-2">Subcategory *</div>
                    <button
                      type="button"
                      onClick={() => setShowSubcategoryDropdown(!showSubcategoryDropdown)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left bg-white flex justify-between items-center hover:bg-gray-50"
                    >
                      <span>{formData.subcategory || 'Select subcategory'}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showSubcategoryDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Card */}
                    <AnimatePresence>
                      {showSubcategoryDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -5, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -5, scale: 0.95 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-blue-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
                        >
                          <div className="p-2">
                            {CATEGORIES_WITH_SUBCATEGORIES[formData.category as keyof typeof CATEGORIES_WITH_SUBCATEGORIES]?.map((subcat) => (
                              <button
                                key={subcat}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, subcategory: subcat });
                                  setShowSubcategoryDropdown(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                                  formData.subcategory === subcat
                                    ? 'bg-blue-500 text-white font-medium'
                                    : 'hover:bg-blue-50 text-gray-700'
                                }`}
                              >
                                {subcat}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location (Google Maps Link) *</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="https://maps.google.com/..."
                  type="url"
                  required
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos ({photoPreviewUrls.length}/5)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoChange}
                    disabled={photoPreviewUrls.length >= 5}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Drop images here or click to select (max 200 KB each)
                    </p>
                  </label>
                </div>

                {/* Photo Previews */}
                {photoPreviewUrls.length > 0 && (
                  <div className="grid grid-cols-5 gap-2 mt-4">
                    {photoPreviewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img src={url} alt={`Preview ${index}`} className="w-full h-20 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upload Progress */}
              {uploading && uploadProgress > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Uploading photos...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {uploading ? `Uploading... ${uploadProgress}%` : editingId ? 'Update Event' : 'Add Event'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Events List */}
      <div className="grid gap-4">
        {events.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No events yet. Add your first event!</p>
            </CardContent>
          </Card>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition">
              <CardContent className="py-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{event.title}</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                      <p>📅 {event.date} at {event.time}</p>
                      <p>🏷️ {event.category}</p>
                      <p>📍 <a href={event.location} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Location</a></p>
                      <p>📸 {event.photo_urls?.length || 0} photos</p>
                    </div>

                    {/* Photo Thumbnails */}
                    {event.photo_urls && event.photo_urls.length > 0 && (
                      <div className="flex gap-2 mt-4 overflow-x-auto">
                        {event.photo_urls.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt={`Event ${idx}`}
                            className="h-16 w-16 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setEditingId(event.id);
                        setShowForm(true);
                        setFormData({
                          title: event.title,
                          date: event.date,
                          time: event.time,
                          category: event.category,
                          location: event.location,
                          photos: [],
                        });
                        setPhotoPreviewUrls(event.photo_urls || []);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(event.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

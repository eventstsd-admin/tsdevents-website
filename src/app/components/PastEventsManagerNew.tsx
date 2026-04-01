import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase, CATEGORIES, CATEGORIES_WITH_SUBCATEGORIES } from '../../supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Trash2, ChevronDown, Plus, X } from 'lucide-react';
import { PastEventUploadNew } from './PastEventUploadNew';

interface PastEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  event_date: string;
  location: string;
}

interface EventWithPhotos extends PastEvent {
  photo_count: number;
  expanded: boolean;
}

export function PastEventsManagerNew() {
  const [events, setEvents] = useState<EventWithPhotos[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    event_date: '',
    location: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('past_events')
        .select(`
          id,
          title,
          description,
          category,
          subcategory,
          event_date,
          location,
          event_photos (id)
        `)
        .order('event_date', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        toast.error('Failed to load events');
        setEvents([]);
        return;
      }

      const eventsWithCount: EventWithPhotos[] = (data || []).map((event: any) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        category: event.category,
        subcategory: event.subcategory,
        event_date: event.event_date,
        location: event.location,
        photo_count: event.event_photos?.length || 0,
        expanded: false,
      }));

      setEvents(eventsWithCount);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.event_date || !newEvent.category || !newEvent.subcategory) {
      toast.error('Please fill in all required fields (including subcategory)');
      return;
    }

    if (selectedImages.length < 2) {
      toast.error('Please upload at least 2 photos for the event');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('past_events')
        .insert([newEvent])
        .select();

      if (error) throw error;

      const eventId = data[0].id;
      
      // Upload selected images
      await uploadEventImages(eventId);

      toast.success('Event created with photos!');
      setNewEvent({
        title: '',
        description: '',
        category: '',
        subcategory: '',
        event_date: '',
        location: '',
      });
      setSelectedImages([]);
      setShowAddForm(false);
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const uploadEventImages = async (eventId: string) => {
    for (const file of selectedImages) {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          toast.error('Supabase not configured');
          return;
        }

        const folder = `tsd-events/past-events/${eventId}`;

        // Call Edge Function to get signature
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
          const error = await signResponse.text();
          console.error('Sign error:', error);
          toast.error('Failed to get upload signature');
          continue;
        }

        const { cloud_name, api_key, signature, timestamp, upload_preset } = await signResponse.json();

        // Upload to Cloudinary with signature
        const formData = new FormData();
        formData.append('file', file);
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
          console.error('Cloudinary error:', cloudinaryData);
          toast.error(`Upload failed: ${cloudinaryData.error?.message || 'Unknown error'}`);
          continue;
        }

        // Save URL to Supabase
        const { error: dbError } = await supabase
          .from('event_photos')
          .insert({
            event_id: eventId,
            url: cloudinaryData.secure_url,
            alt_text: file.name,
          });

        if (dbError) {
          console.error('Database error:', dbError);
          toast.error('Failed to save photo URL');
          continue;
        }

        toast.success(`✅ Uploaded: ${file.name}`);
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error(`Error uploading ${file.name}`);
      }
    }

    // Refresh events
    setSelectedImages([]);
    fetchEvents();
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Delete this event and all its photos?')) return;

    try {
      const { error } = await supabase
        .from('past_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast.success('Event deleted');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const toggleExpanded = (eventId: string) => {
    setEvents(
      events.map((e) =>
        e.id === eventId ? { ...e, expanded: !e.expanded } : e
      )
    );
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const totalFiles = selectedImages.length + newFiles.length;

    if (totalFiles > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setSelectedImages([...selectedImages, ...newFiles]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  if (loading && events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Event Button */}
      <div>
        {!showAddForm ? (
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-red-700/90 hover:bg-red-800/90 gap-2"
          >
            <Plus size={20} />
            Add New Event
          </Button>
        ) : (
          // Add Event Form (Collapsible)
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add New Event</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Event Title *"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                />
                <Input
                  type="date"
                  value={newEvent.event_date}
                  onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value, subcategory: '' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subcategory Dropdown - Shows only when category is selected */}
                {newEvent.category && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Subcategory *</label>
                    <select
                      value={newEvent.subcategory}
                      onChange={(e) => setNewEvent({ ...newEvent, subcategory: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    >
                      <option value="">Select Subcategory</option>
                      {CATEGORIES_WITH_SUBCATEGORIES[newEvent.category]?.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <Input
                placeholder="Location (Google Maps link or address)"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />

              <textarea
                placeholder="Event Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows={3}
              />

              {/* Image Upload Section */}
              <div className={`border-2 border-dashed rounded-lg p-4 ${selectedImages.length < 2 ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}>
                <label className="block text-sm font-medium mb-1">
                  Event Images * <span className="text-red-600">(Minimum 2 required, Max 5)</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Upload at least 2 photos to showcase this event
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="block w-full mb-3"
                  disabled={selectedImages.length >= 5}
                />

                {selectedImages.length > 0 && (
                  <div className="space-y-2">
                    <p className={`text-sm ${selectedImages.length < 2 ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                      Selected: {selectedImages.length}/5 images {selectedImages.length < 2 && '(need at least 2)'}
                    </p>
                    {selectedImages.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                      >
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {selectedImages.length === 0 && (
                  <p className="text-sm text-red-600">⚠️ Please select at least 2 images</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || selectedImages.length < 2}
                className="w-full bg-red-700/90 hover:bg-red-800/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating & Uploading...' : `Create Event with ${selectedImages.length} Photo${selectedImages.length !== 1 ? 's' : ''}`}
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Events List */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Events ({events.length})</h2>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Event Header */}
              <div
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => toggleExpanded(event.id)}
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(event.event_date).toLocaleDateString()} • {event.category}
                    {event.subcategory && <> → {event.subcategory}</>} •{' '}
                    <span className="font-medium">{event.photo_count}/5 photos</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEvent(event.id);
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </Button>
                  <ChevronDown
                    size={20}
                    className={`transform transition ${event.expanded ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>

              {/* Expanded Content */}
              {event.expanded && (
                <div className="border-t border-gray-200 p-6 bg-gray-50 space-y-4">
                  {event.description && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Description:</p>
                      <p className="text-gray-600">{event.description}</p>
                    </div>
                  )}
                  {event.location && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Location:</p>
                      <a
                        href={event.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm break-all"
                      >
                        {event.location}
                      </a>
                    </div>
                  )}

                  {/* Upload Photos Section */}
                  {event.photo_count < 5 && (
                    <div className="mt-6">
                      <PastEventUploadNew 
                        eventId={event.id} 
                        eventTitle={event.title}
                        onUploadComplete={fetchEvents}
                      />
                    </div>
                  )}

                  {event.photo_count >= 5 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                      ✓ Maximum 5 photos reached for this event
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {events.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No events yet. Create one above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

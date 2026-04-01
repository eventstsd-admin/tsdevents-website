import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Edit, Trash2, ChevronDown } from 'lucide-react';
import { PastEventUpload } from './PastEventUpload';

interface PastEvent {
  id: number;
  title: string;
  description: string;
  category: string;
  event_date: string;
  location: string;
}

interface EventWithPhotos extends PastEvent {
  photo_count: number;
  expanded: boolean;
}

const CATEGORIES = [
  'Wedding',
  'Religious',
  'Corporate Event',
  'Decoration',
  'Birthday',
  'Anniversary',
  'Engagement',
  'Baby Shower',
];

export function PastEventsManager() {
  const [events, setEvents] = useState<EventWithPhotos[]>([]);
  const [loading, setLoading] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    category: 'Wedding',
    event_date: '',
    location: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('past_events')
        .select(`
          *,
          event_photos (id)
        `)
        .order('event_date', { ascending: false });

      if (error) throw error;

      const eventsWithCount: EventWithPhotos[] = (data || []).map((event: any) => ({
        ...event,
        photo_count: event.event_photos?.length || 0,
        expanded: false,
      }));

      setEvents(eventsWithCount);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.event_date || !newEvent.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('past_events')
        .insert([newEvent]);

      if (error) throw error;

      toast.success('Event created!');
      setNewEvent({
        title: '',
        description: '',
        category: 'Wedding',
        event_date: '',
        location: '',
      });
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
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

  const toggleExpanded = (eventId: number) => {
    setEvents(
      events.map((e) =>
        e.id === eventId ? { ...e, expanded: !e.expanded } : e
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Add New Event Form */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-2xl font-bold mb-6">Add New Past Event</h2>
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

          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              value={newEvent.category}
              onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
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

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-red-700/90 hover:bg-red-800/90"
          >
            {loading ? 'Creating...' : 'Create Event'}
          </Button>
        </form>
      </div>

      {/* Events List */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Past Events ({events.length})</h2>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Event Header */}
              <div className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => toggleExpanded(event.id)}>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(event.event_date).toLocaleDateString()} • {event.category} •{' '}
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
                      <PastEventUpload eventId={event.id} eventTitle={event.title} />
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
              No past events yet. Create one above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

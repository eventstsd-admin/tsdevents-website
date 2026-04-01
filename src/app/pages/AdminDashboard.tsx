import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import {
  LayoutDashboard,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  Menu,
  X,
  Plus,
  Edit,
  Trash2,
  Home,
  AlertCircle,
  Film,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { PastEventManager } from '../components/PastEventManager';
import { 
  bookingOperations, 
  eventOperations, 
  inquiryOperations,
  pastEventOperations,
  statsOperations,
  type Booking,
  type Event,
  type Inquiry,
  type PastEvent,
} from '../../supabase';

export function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  
  // Data states
  const [stats, setStats] = useState<any[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [pastEvents, setPastEvents] = useState<PastEvent[]>([]);

  // Load data from Supabase
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setSupabaseError(null);
    
    try {
      if (activeTab === 'dashboard') {
        const statsData = await statsOperations.getStats();
        setStats([
          { icon: Calendar, label: 'Total Bookings', value: statsData.totalBookings, change: '+0%', color: 'bg-blue-500' },
          { icon: DollarSign, label: 'Revenue', value: `₹${(statsData.revenue / 100000).toFixed(1)}L`, change: '+0%', color: 'bg-green-500' },
          { icon: Users, label: 'Active Clients', value: statsData.activeClients, change: '+0%', color: 'bg-purple-500' },
          { icon: TrendingUp, label: 'Avg. Rating', value: statsData.avgRating.toFixed(1), change: '+0', color: 'bg-amber-500' },
        ]);
        
        const bookingsData = await bookingOperations.getRecent(10);
        setBookings(bookingsData || []);
      } else if (activeTab === 'bookings') {
        const bookingsData = await bookingOperations.getRecent(100);
        setBookings(bookingsData || []);
      } else if (activeTab === 'events') {
        const eventsData = await eventOperations.getAll();
        setEvents(eventsData || []);
      } else if (activeTab === 'pastEvents') {
        const pastEventsData = await pastEventOperations.getAll();
        setPastEvents(pastEventsData || []);
      } else if (activeTab === 'inquiries') {
        const inquiriesData = await inquiryOperations.getAll();
        setInquiries(inquiriesData || []);
      }
    } catch (error: any) {
      const message = error?.message || 'Failed to load data. Please check your Supabase configuration.';
      setSupabaseError(message);
      console.error('Supabase error:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'bookings', icon: Calendar, label: 'Bookings' },
    { id: 'events', icon: ImageIcon, label: 'Manage Events' },
    { id: 'pastEvents', icon: Film, label: 'Past Events' },
    { id: 'inquiries', icon: MessageSquare, label: 'Inquiries' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? '280px' : '80px' }}
        className="fixed left-0 top-0 h-screen bg-black text-white z-50 shadow-2xl"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            {sidebarOpen && (
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-red-700/90 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">T</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold">TSD Events</h2>
                  <p className="text-xs text-amber-400">Admin Panel</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-red-700/90'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <Icon size={20} />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <Link to="/">
              <Button
                variant="outline"
                className="w-full bg-white/10 border-white/20 hover:bg-white/20 text-white"
              >
                <Home className="mr-2" size={18} />
                {sidebarOpen && 'Back to Website'}
              </Button>
            </Link>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div
        className="transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? '280px' : '80px' }}
      >
        {/* Header */}
        <header className="bg-white shadow-sm p-6 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {menuItems.find((item) => item.id === activeTab)?.label}
              </h1>
              <p className="text-gray-600">Welcome back, Admin</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-red-700/90 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Supabase Configuration Warning */}
          {supabaseError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900">Supabase Not Configured</h3>
                <p className="text-sm text-amber-800 mt-1">{supabaseError}</p>
                <p className="text-sm text-amber-800 mt-2">
                  To set up Supabase:
                </p>
                <ol className="text-sm text-amber-800 mt-2 list-decimal list-inside space-y-1">
                  <li>Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="underline">supabase.com</a> and create a project</li>
                  <li>Create tables: <code className="bg-amber-100 px-2 py-1 rounded">bookings</code>, <code className="bg-amber-100 px-2 py-1 rounded">events</code>, <code className="bg-amber-100 px-2 py-1 rounded">inquiries</code></li>
                  <li>Copy your Project URL and API key to a <code className="bg-amber-100 px-2 py-1 rounded">.env</code> file</li>
                  <li>Set <code className="bg-amber-100 px-2 py-1 rounded">VITE_SUPABASE_URL</code> and <code className="bg-amber-100 px-2 py-1 rounded">VITE_SUPABASE_ANON_KEY</code></li>
                </ol>
              </div>
            </motion.div>
          )}

          {activeTab === 'dashboard' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="border-none shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.color} p-3 rounded-xl`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-green-500 text-sm font-semibold">
                              {stat.change}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                          <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Recent Bookings */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading bookings...</div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No bookings yet. When users book through your website, they'll appear here.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-4 font-semibold text-gray-600">Client</th>
                          <th className="text-left p-4 font-semibold text-gray-600">Event Type</th>
                          <th className="text-left p-4 font-semibold text-gray-600">Date</th>
                          <th className="text-left p-4 font-semibold text-gray-600">Status</th>
                          <th className="text-left p-4 font-semibold text-gray-600">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr key={booking.id} className="border-b hover:bg-gray-50">
                            <td className="p-4 font-medium text-gray-900">{booking.client_name}</td>
                            <td className="p-4 text-gray-600">{booking.event_type}</td>
                            <td className="p-4 text-gray-600">{booking.date}</td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  booking.status === 'confirmed'
                                    ? 'bg-green-100 text-green-700'
                                    : booking.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {booking.status}
                              </span>
                            </td>
                            <td className="p-4 font-semibold text-gray-900">₹{booking.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>)}
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'events' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Manage Events</h2>
                <Button className="bg-red-700/90 hover:bg-red-800/90 text-white">
                  <Plus className="mr-2" size={18} />
                  Add New Event
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading events...</div>
              ) : events.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No events yet. Create your first event package to get started.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <Card key={event.id} className="shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{event.name}</h3>
                            <p className="text-gray-600 text-sm">{event.category}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              event.active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {event.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-amber-600 mb-4">{event.price_range}</p>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-2 hover:bg-amber-50"
                          >
                            <Edit size={16} className="mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-2 hover:bg-red-50 hover:border-red-300 hover:text-red-700/90"
                          >
                            <Trash2 size={16} className="mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Loading bookings...</div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No bookings yet. When users book through your website, they'll appear here.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4 font-semibold text-gray-600">Client</th>
                          <th className="text-left p-4 font-semibold text-gray-600">Event Type</th>
                          <th className="text-left p-4 font-semibold text-gray-600">Date</th>
                          <th className="text-left p-4 font-semibold text-gray-600">Status</th>
                          <th className="text-left p-4 font-semibold text-gray-600">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr key={booking.id} className="border-b hover:bg-gray-50">
                            <td className="p-4 font-medium text-gray-900">{booking.client_name}</td>
                            <td className="p-4 text-gray-600">{booking.event_type}</td>
                            <td className="p-4 text-gray-600">{booking.date}</td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                  booking.status === 'confirmed'
                                    ? 'bg-green-100 text-green-700'
                                    : booking.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {booking.status}
                              </span>
                            </td>
                            <td className="p-4 font-semibold text-gray-900">₹{booking.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'pastEvents' && (
            <PastEventManager events={pastEvents} onRefresh={loadData} />
          )}

          {activeTab === 'inquiries' && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Customer Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Loading inquiries...</div>
                ) : inquiries.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No inquiries yet. When customers send inquiries through your website, they'll appear here.</div>
                ) : (
                  <div className="space-y-4">
                    {inquiries.map((inquiry) => (
                      <div key={inquiry.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{inquiry.customer_name}</h4>
                            <p className="text-sm text-gray-600">{inquiry.email}</p>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">{inquiry.message}</p>
                        <Button className="mt-3" size="sm" variant="outline">
                          Reply
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'settings' && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Admin Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Name
                      </label>
                      <Input placeholder="Admin Name" defaultValue="TSD Admin" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <Input placeholder="Email" defaultValue="admin@tsdevents.com" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Notification Settings
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
                      <span className="text-gray-700">Email notifications for new bookings</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
                      <span className="text-gray-700">SMS alerts for urgent inquiries</span>
                    </label>
                  </div>
                </div>
                <Button className="bg-red-700/90 hover:bg-red-800/90 text-white">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
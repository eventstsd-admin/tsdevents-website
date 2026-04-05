import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../../supabase';
import { toast } from 'sonner';
import { PastEventsManagerNew } from '../components/PastEventsManagerNew';
import { InquiryManager } from '../components/InquiryManager';
import { Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inquiries');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        // No session at all, redirect to login
        if (!session) {
          navigate('/admin', { replace: true });
          return;
        }

        // Session exists, check if user is admin
        const userRole = session.user?.user_metadata?.role;
        if (userRole !== 'admin') {
          // Not admin, sign out and redirect to login
          await supabase.auth.signOut();
          toast.error('Admin access required');
          navigate('/admin', { replace: true });
          return;
        }

        // Admin confirmed, set user and allow access
        setUser(session.user);
        setLoading(false);
      } catch (error) {
        console.error('Error verifying admin access:', error);
        toast.error('Session error');
        navigate('/admin', { replace: true });
      }
    };

    verifyAdminAccess();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out');
      navigate('/admin', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Verifying admin access...</div>
      </div>
    );
  }

  // Dashboard content
  const renderContent = () => {
    switch (activeTab) {
      case 'inquiries':
        return <InquiryManager />;
      case 'events':
        return <PastEventsManagerNew />;
      default:
        return <InquiryManager />;
    }
  };

  return (
    <AdminLayoutWithTabs
      userName={user?.user_metadata?.name || 'Admin'}
      onLogout={handleLogout}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </AdminLayoutWithTabs>
  );
}

// StatCard component
function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
}

// Admin Layout with multiple tabs
interface AdminLayoutWithTabsProps {
  children: React.ReactNode;
  userName: string;
  onLogout: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

function AdminLayoutWithTabs({
  children,
  userName,
  onLogout,
  activeTab,
  onTabChange,
}: AdminLayoutWithTabsProps) {
  const menuItems = [
    { id: 'inquiries', label: 'Inquiries' },
    { id: 'events', label: 'Events' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-red-700">TSD Admin</h1>
          <p className="text-sm text-gray-600 mt-2">Welcome, {userName}</p>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                activeTab === item.id
                  ? 'bg-red-100 text-red-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t absolute bottom-0 w-64">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-medium py-2 rounded-lg transition-colors"
          >
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b shadow-sm p-6">
          <h2 className="text-3xl font-bold text-gray-800">
            {menuItems.find((item) => item.id === activeTab)?.label}
          </h2>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../../supabase';
import { toast } from 'sonner';
import { PastEventsManager } from '../components/PastEventsManager';
import { AdminLayout } from '../components/AdminLayout';

export function AdminPanelPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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

  return (
    <AdminLayout 
      userName={user?.user_metadata?.name || 'Admin'} 
      onLogout={handleLogout}
    >
      <PastEventsManager />
    </AdminLayout>
  );
}

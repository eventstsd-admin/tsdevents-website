import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../../supabase';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // On mount, check if user is already logged in as admin
    const checkExistingSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        // If session exists AND user has admin role, redirect to admin-dashboard
        if (session?.user) {
          const role = session.user.user_metadata?.role;
          if (role === 'admin') {
            navigate('/admin-dashboard', { replace: true });
            return;
          } else {
            // Session exists but not admin, so sign them out
            await supabase.auth.signOut();
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setChecking(false);
      }
    };

    checkExistingSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error('Invalid email or password');
        console.error('Login error:', error);
        setLoading(false);
        return;
      }

      // Check if the signed-in user has admin role
      const userRole = data.user?.user_metadata?.role;
      if (userRole !== 'admin') {
        // Not an admin, sign them out
        await supabase.auth.signOut();
        toast.error('Admin access required');
        setLoading(false);
        return;
      }

      // Admin login successful
      toast.success('Admin login successful!');
      navigate('/admin-dashboard', { replace: true });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Login failed. Please try again.');
      setLoading(false);
    }
  };

  // Show loading while checking existing session
  if (checking) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-700 mb-2">TSD Admin</h1>
          <p className="text-gray-600">Admin Login</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100 transition"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100 transition"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-700/90 hover:bg-red-800 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Admin credentials required to access
        </p>
      </div>
    </div>
  );
}

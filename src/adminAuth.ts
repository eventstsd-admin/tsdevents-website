import { supabase } from './supabase';

export const checkAdminAccess = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) return false;
  
  return session.user?.user_metadata?.role === 'admin';
};

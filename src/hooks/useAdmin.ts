/**
 * Admin authentication hook
 * 
 * This hook checks if the current user is an admin by querying the admin_users table.
 * SECURITY: Admin status is verified server-side through RLS policies.
 * 
 * For template users: Add your user_id to the admin_users table to enable admin access.
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseAdminReturn {
  isAdmin: boolean;
  isLoading: boolean;
  userId: string | null;
  error: string | null;
}

export function useAdmin(): UseAdminReturn {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function checkAdmin() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          if (mounted) {
            setIsAdmin(false);
            setUserId(null);
            setIsLoading(false);
          }
          return;
        }

        if (mounted) {
          setUserId(session.user.id);
        }

        // SECURITY: Use the is_admin() database function for secure server-side check
        // This function runs with SECURITY DEFINER and checks the admin_users table
        const { data, error: adminError } = await supabase.rpc('is_admin');

        if (mounted) {
          if (adminError) {
            // SECURITY: On error, deny access - never allow by default
            console.error('Admin check failed:', adminError.message);
            setIsAdmin(false);
            setError('Unable to verify admin status');
          } else {
            setIsAdmin(data === true);
            setError(null);
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          // SECURITY: On error, deny access - never allow by default
          console.error('Admin check error:', err);
          setIsAdmin(false);
          setError('Unable to verify admin status');
          setIsLoading(false);
        }
      }
    }

    checkAdmin();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { isAdmin, isLoading, userId, error };
}

/**
 * For template users:
 * 
 * To add yourself as an admin, run this SQL in the Supabase SQL editor:
 * 
 * INSERT INTO public.admin_users (user_id)
 * VALUES ('YOUR_USER_ID_HERE');
 * 
 * You can find your user_id in the Authentication > Users section of Supabase.
 */

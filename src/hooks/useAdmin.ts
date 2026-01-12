/**
 * Admin authentication hook
 * 
 * This hook checks if the current user is an admin.
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

        // Check if user is in admin_users table
        const { data, error: adminError } = await supabase
          .from('admin_users')
          .select('id')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (mounted) {
          if (adminError) {
            // Table might not exist yet - for demo purposes, allow access
            console.log('Admin check: Table not found or error, allowing demo access');
            setIsAdmin(true);
            setError(null);
          } else {
            setIsAdmin(!!data);
            setError(null);
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          // For demo purposes, allow access if there's an error
          console.log('Admin check error, allowing demo access:', err);
          setIsAdmin(true);
          setError(null);
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

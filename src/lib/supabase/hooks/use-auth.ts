import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../client';
import { useAuth } from '@/hooks/use-auth';

export function useSupabaseAuth() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Get user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser({
              id: profile.id,
              name: profile.full_name,
              email: profile.email,
              role: profile.role,
              practice: profile.practice_name,
              labName: profile.lab_name,
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          navigate('/login');
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, setUser]);
}
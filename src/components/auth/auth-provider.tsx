import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/lib/supabase/hooks/use-auth';
import { useAuth } from '@/hooks/use-auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Initialize Supabase auth listener
  useSupabaseAuth();

  // Handle initial auth state
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return <>{children}</>;
}
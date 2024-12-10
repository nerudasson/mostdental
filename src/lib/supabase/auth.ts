import { supabase } from './client';
import type { User } from '@/lib/types/user';

export async function signUp(email: string, password: string, userData: Omit<User, 'id'>) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;

  if (authData.user) {
    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        full_name: userData.name,
        role: userData.role,
        practice_name: userData.practice,
        lab_name: userData.labName,
      });

    if (profileError) throw profileError;
  }

  return authData;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) return null;

  return {
    id: profile.id,
    name: profile.full_name,
    email: profile.email,
    role: profile.role,
    practice: profile.practice_name,
    labName: profile.lab_name,
  };
}

export async function updateProfile(userId: string, updates: Partial<User>) {
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: updates.name,
      practice_name: updates.practice,
      lab_name: updates.labName,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) throw error;
}
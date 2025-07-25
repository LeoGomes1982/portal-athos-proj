import React from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  user_id: string;
  nome: string | null;
  email: string | null;
  cargo: string | null;
  departamento: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
}

export const useAuth = () => {
  const authState: AuthState = {
    user: null,
    session: null,
    profile: null,
    loading: false,
    initialized: true
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const isAdmin = () => {
    return authState.profile?.role === 'admin';
  };

  const isManager = () => {
    return authState.profile?.role === 'manager' || authState.profile?.role === 'admin';
  };

  return {
    ...authState,
    signOut,
    isAdmin,
    isManager
  };
};
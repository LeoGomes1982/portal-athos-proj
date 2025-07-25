import { useState, useEffect } from 'react';
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
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    loading: true,
    initialized: false
  });

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.id);

        if (session?.user) {
          // Fetch user profile after successful authentication
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();

            if (error && error.code !== 'PGRST116') {
              console.error('Error fetching profile:', error);
            }

            if (mounted) {
              setAuthState({
                user: session.user,
                session,
                profile: profile || null,
                loading: false,
                initialized: true
              });
            }
          } catch (error) {
            console.error('Profile fetch error:', error);
            if (mounted) {
              setAuthState({
                user: session.user,
                session,
                profile: null,
                loading: false,
                initialized: true
              });
            }
          }
        } else {
          if (mounted) {
            setAuthState({
              user: null,
              session: null,
              profile: null,
              loading: false,
              initialized: true
            });
          }
        }
      }
    );

    // Simplified initialization with faster timeout
    const initializeAuth = async () => {
      try {
        // Quick session check with shorter timeout
        const { data: { session } } = await Promise.race([
          supabase.auth.getSession(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 3000)
          )
        ]) as any;

        if (mounted) {
          setAuthState({
            user: session?.user || null,
            session: session || null,
            profile: null,
            loading: false,
            initialized: true
          });
        }
      } catch (error) {
        console.log('Auth timeout or error, proceeding without auth:', error);
        if (mounted) {
          setAuthState({
            user: null,
            session: null,
            profile: null,
            loading: false,
            initialized: true
          });
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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
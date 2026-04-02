import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { authService } from '../services/authService';
import type { Profile } from '../types';

interface AuthContextType {
  user: any;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async (userId: string) => {
      try {
        console.log('AUTH: loadProfile start', userId);
        const p = await authService.getProfile(userId);
        console.log('AUTH: profile =', p);
        setProfile(p);
      } catch (err) {
        console.error('AUTH: loadProfile error:', err);
        setProfile(null);
      }
    };

    const setupAuth = async () => {
      try {
        console.log('AUTH: setupAuth start');

        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('AUTH: session =', session, 'error =', error);

        if (error) {
          console.error('getSession error:', error);
          setUser(null);
          setProfile(null);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          setLoading(false); // cho vào app trước
          void loadProfile(session.user.id); // load profile nền
        } else {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      } catch (err) {
        console.error('setupAuth error:', err);
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    };

    setupAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      try {
        console.log('AUTH CHANGE: session =', session);

        if (session?.user) {
          setUser(session.user);
          setLoading(false); // không chờ profile
          void loadProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      } catch (err) {
        console.error('onAuthStateChange error:', err);
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await authService.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
import { supabase } from './supabaseClient';
import type { Profile, UserRole } from '../types';

export const authService = {
  async signIn(email: string) {
    // For MVP, we'll use OTP or simple password.
    // Assuming password for now.
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: 'password123', // Demo password
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data as Profile;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  hasRole(profile: Profile | null, requiredRoles: UserRole[]) {
    if (!profile) return false;
    if (profile.role === 'Admin') return true;
    return requiredRoles.includes(profile.role);
  }
};

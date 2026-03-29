import { supabase } from '../lib/supabaseClient';
import type { User, Department } from '../types';

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('profiles') // Supabase pattern usually uses 'profiles' for users
      .select('*');
    
    if (error) {
      console.error('Error fetching users:', error);
      return JSON.parse(localStorage.getItem('wf_users') || '[]');
    }
    return data || [];
  },
  
  getUser: async (id: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  },
  
  getDepartments: async (): Promise<Department[]> => {
    const { data, error } = await supabase
      .from('departments')
      .select('*');
    
    if (error) {
      console.error('Error fetching departments:', error);
      return JSON.parse(localStorage.getItem('wf_departments') || '[]');
    }
    return data || [];
  },
  
  getDepartment: async (id: string): Promise<Department | null> => {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  }
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { userService } from '../services/userService';

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  login: (userId: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        // Load available users from Supabase (or fallback)
        const allUsers = await userService.getUsers();
        setUsers(allUsers);
        
        // Auto-login the Director by default for demo purposes or use saved ID
        const savedUserId = localStorage.getItem('wf_current_user_id');
        const userToLogin = allUsers.find(u => u.id === savedUserId) || allUsers.find(u => u.role === 'director');
        
        if (userToLogin) {
          setCurrentUser(userToLogin);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('wf_current_user_id', user.id);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('wf_current_user_id');
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, users, login, logout, loading }}>
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

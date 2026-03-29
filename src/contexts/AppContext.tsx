import React, { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { initializeMockData } from '../data/mockData';

interface AppContextType {
  isInitialized: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <AppContext.Provider value={{ isInitialized: true }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

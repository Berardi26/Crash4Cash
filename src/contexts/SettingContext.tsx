'use client'
import { Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { createContext } from "react";

interface SettingContextType {
    sidebarOpen: boolean;
    setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const SettingContext = createContext<SettingContextType | undefined>(undefined);

export const useSetting = () => {
  const context = useContext(SettingContext);
  if (context === undefined) {
    throw new Error('useSetting must be used within an SettingProvider');
  }
  return context;
};

interface SettingProviderProps {
  children: ReactNode;
}

export const SettingProvider: React.FC<SettingProviderProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);


  const value: SettingContextType = {
    sidebarOpen,
    setSidebarOpen,
  };

  return (
    <SettingContext.Provider value={value}>
      {children}
    </SettingContext.Provider>
  );
}; 
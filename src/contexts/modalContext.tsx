'use client'
import { Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { createContext } from "react";

interface modalContextType {
  showProfileModal: boolean;
  setShowProfileModal: Dispatch<SetStateAction<boolean>>;
}

const modalContext = createContext<modalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(modalContext);
  if (context === undefined) {
    throw new Error('useData must be used within an DataProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  const value: modalContextType = {
    showProfileModal,
    setShowProfileModal,
  };

  return (
    <modalContext.Provider value={value}>
      {children}
    </modalContext.Provider>
  );
}; 
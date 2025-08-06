'use client'
import { Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { createContext } from "react";

interface User {
  _id: string,
  username: string;
  avatar: string;
}


interface userDataContextType {
  user: {};
  setUser: Dispatch<SetStateAction<{}>>;
  messages: [];
  setMessages: Dispatch<SetStateAction<any[]>>;
  selectedUser: User | undefined;
  setSelectedUser: Dispatch<SetStateAction<User | undefined>>;
}

const userDataContext = createContext<userDataContextType | undefined>(undefined);

export const useUserData = () => {
  const context = useContext(userDataContext);
  if (context === undefined) {
    throw new Error('useData must be used within an DataProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserDataProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState<any>([]);
  const [selectedUser, setSelectedUser] = useState<User>()


  const value: userDataContextType = {
    user,
    setUser,
    messages,
    setMessages,
    selectedUser,
    setSelectedUser
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}; 
import { Props } from "next/script";
import React, { createContext, useState, useContext, Dispatch, SetStateAction } from "react";

// Define the type of User
interface User {
  userId: string;
  name: string;
}

// Define the shape of the context data
interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>; // Correct the type here
}


// Initialize the context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

 
export const UserProvider: React.FC = ({children}: Props): React.ReactNode => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

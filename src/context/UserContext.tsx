"use client";

import axios from "axios";
import React, {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
} from "react";
import { AppRole, normalizeRole } from "@/lib/role-routing";

export interface AppUser {
  userId: string;
  fullName: string;
  email: string;
  role: AppRole | null;
  isVerified: boolean;
  hasPassword: boolean;
}

interface UserContextType {
  user: AppUser | null;
  isLoading: boolean;
  setUser: Dispatch<SetStateAction<AppUser | null>>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await axios.get("/api/auth/me");
      const data = response.data?.data as
        | {
            _id?: string;
            fullName?: string;
            email?: string;
            role?: string;
            isVerified?: boolean;
            hasPassword?: boolean;
          }
        | undefined;

      if (!data?._id) {
        setUser(null);
        return;
      }

      setUser({
        userId: data._id,
        fullName: data.fullName ?? "",
        email: data.email ?? "",
        role: normalizeRole(data.role),
        isVerified: Boolean(data.isVerified),
        hasPassword: Boolean(data.hasPassword),
      });
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  return (
    <UserContext.Provider value={{ user, isLoading, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};


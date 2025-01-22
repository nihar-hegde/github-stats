// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { getStoredToken, removeStoredToken } from "../auth/githubAuth";
import { githubAPI } from "@/utils/githubAPI";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await getStoredToken();
      if (token) {
        githubAPI.setAccessToken(token);
        setAccessToken(token);
      }
    } catch (error) {
      console.error("Error checking token:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await removeStoredToken();
      githubAPI.setAccessToken(null);
      setAccessToken(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (isLoading) {
    return null; // Or a loading spinner if you prefer
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!accessToken,
        isLoading,
        accessToken,
        setAccessToken,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

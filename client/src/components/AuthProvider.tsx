import { axiosInstance } from "@/lib/utils";
import { createContext, useState, useContext, useEffect } from "react";

interface AuthContextType {
  loading: boolean;
  isLoggedIn: boolean;
  logout: () => void;
  login: () => void;
  fetchAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const logout = () => {
    setIsLoggedIn(false);
  };

  const login = () => {
    setIsLoggedIn(true);
  };

  const fetchAuthStatus = async () => {
    setLoading(true);
    try {
      await axiosInstance.get("/auth/check");
      setIsLoggedIn(true);
    } catch (error) {
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, loading, logout, login, fetchAuthStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function UseAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("UseAuth must be used within an AuthProvider");
  }

  return context;
}

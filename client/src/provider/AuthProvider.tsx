import { axiosInstance } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { createContext, useState, useContext, useEffect } from "react";

interface AuthContextType {
  loading: boolean;
  isLoggedIn: boolean;
  logout: () => void;
  login: (id: string, username: string) => void;
  userData: {
    username: string;
  };
  fetchAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    id: "",
    username: "",
  });

  const navigate = useNavigate();

  const logout = () => {
    if (isLoggedIn) navigate("/", { replace: true });
    setIsLoggedIn(false);
    setUserData({ id: "", username: "" });
  };

  const login = (id: string, username: string) => {
    setUserData({ id, username });
    setIsLoggedIn(true);
  };

  const fetchAuthStatus = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/auth/check");
      if (!isLoggedIn)
        login(response.data.data.id, response.data.data.username);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        loading,
        logout,
        login,
        fetchAuthStatus,
        userData,
      }}
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

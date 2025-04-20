import axios from "axios";
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "@/provider/AuthProvider";

const refreshAccessToken = async () => {
  try {
    axios.defaults.withCredentials = true;
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/auth/refresh-token`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const AxiosProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, logout, login } = UseAuth();
  const [isSet, setIsSet] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const response = await refreshAccessToken();
            if (!isLoggedIn) login(response.data.username);
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            logout();
            if (originalRequest.url !== "/auth/check") {
              navigate("/signin");
            }
          }
        }
        return Promise.reject(error);
      }
    );
    setIsSet(true);

    return () => {
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return isSet && <>{children}</>;
};

export default AxiosProvider;

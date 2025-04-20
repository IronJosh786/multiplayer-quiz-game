import Loader from "./Loader";
import { useEffect } from "react";
import { UseAuth } from "../provider/AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = () => {
  const { isLoggedIn, loading, fetchAuthStatus } = UseAuth();

  const location = useLocation();

  useEffect(() => {
    fetchAuthStatus();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return isLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate to={"/signin"} state={{ from: location }} replace />
  );
};

export default PrivateRoute;

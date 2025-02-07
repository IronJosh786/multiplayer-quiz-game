import { Link } from "react-router-dom";
import { UseAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";
import { axiosInstance, showErrorToast, showSuccessToast } from "@/lib/utils";

const Base = () => {
  const { isLoggedIn, logout } = UseAuth();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      logout();
      showSuccessToast("Logged out");
    } catch (error: any) {
      showErrorToast("Already Logged out");
    }
  };

  return (
    <div
      className={`mt-auto flex ${
        isLoggedIn ? "justify-between" : "justify-center"
      } items-center`}
    >
      {isLoggedIn && (
        <Button onClick={handleLogout} variant={"link"} className="p-0">
          Logout
        </Button>
      )}
      <Link to={"/secret"} className="text-center text-muted">
        Secret
      </Link>
    </div>
  );
};

export default Base;

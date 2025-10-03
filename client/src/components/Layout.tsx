import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";
import { BrainCircuit, User } from "lucide-react";
import { UseAuth } from "@/provider/AuthProvider";
import { Large, Muted, Small } from "./ui/typography";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { axiosInstance, showErrorToast, showSuccessToast } from "@/lib/utils";

const Layout = () => {
  const { isLoggedIn, loading, logout, userData } = UseAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const isNotAnAuthPage =
    location.pathname !== "/signin" && location.pathname !== "/signup";

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
    <div className="flex flex-col max-w-4xl mx-auto min-h-dvh p-4 gap-8 lg:gap-12">
      {/* Navigation */}
      <nav
        className={`flex items-center ${
          isNotAnAuthPage ? "justify-between" : "justify-center"
        }`}
      >
        <div className="flex items-center space-x-2">
          <BrainCircuit className="h-8 w-8 text-indigo-400" />
          <Large className="font-bold hidden xs:block">QuizMaster</Large>
        </div>

        {isNotAnAuthPage && (
          <div>
            {loading && <Skeleton className="h-9 w-[69.5px]" />}

            {!loading && !isLoggedIn && (
              <Button
                onClick={() => navigate("/signin")}
                variant={"outline"}
                className="border-slate-700"
              >
                Login
              </Button>
            )}

            {!loading && isLoggedIn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-slate-700">
                    <User />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-slate-700 text-slate-300"
                  align="end"
                >
                  <DropdownMenuLabel>
                    <Muted>{userData.username}</Muted>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#CBD5E1] opacity-50" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex gap-2 items-center hover:!bg-slate-800/80"
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <Outlet />

      {/* Footer */}
      <footer>
        <div className="mx-auto text-center">
          <Small>
            © {new Date().getFullYear()} QuizMaster. All rights reserved.
          </Small>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

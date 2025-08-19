import { Outlet } from "react-router-dom";
import { NavBar } from "./nav-bar";
import BottomNavigation from "./bottom-navigation";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMe } from "@/features/user/hooks/use-user";
import { useAuthStore } from "@/stores/auth.store";
import { Routes } from "@/routes/routes";

const DashboardLayout = () => {
  const { updateUser } = useAuthStore();
  const navigate = useNavigate();
  const { data: user } = useGetMe();

  useEffect(() => {
    if (!user?.enabled) {
      updateUser({
        enabled: false,
      });
      navigate(Routes.auth.confirmation);
    }
  }, [user, navigate]);

  return (
    <div className="h-full bg-background flex flex-col">
      <NavBar />
      <div className="flex-1 pb-20 overflow-y-auto">
        <Outlet />
      </div>
      <BottomNavigation />
    </div>
  );
};

export default DashboardLayout;

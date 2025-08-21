import { Outlet } from "react-router-dom";
import { NavBar } from "./nav-bar";
import BottomNavigation from "./bottom-navigation";
import { useEffect } from "react";
import { useGetMe } from "@/features/user/hooks/use-user";
import { useAuthStore } from "@/stores/auth.store";

const DashboardLayout = () => {
  const { updateUser } = useAuthStore();
  const { data: user } = useGetMe();

  useEffect(() => {
    if (user) {
      updateUser({
        verified: user.verified,
        enabled: user.enabled,
      });
    }
  }, [user, updateUser]);

  return (
    <div className="h-full bg-background flex flex-col overflow-hidden">
      <NavBar />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
      <BottomNavigation />
    </div>
  );
};

export default DashboardLayout;

import { Outlet } from "react-router-dom";
import { NavBar } from "./nav-bar";
import BottomNavigation from "./bottom-navigation";

const MainLayout = () => {
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

export default MainLayout;

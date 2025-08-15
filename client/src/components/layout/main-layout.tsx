import { Outlet } from "react-router-dom";
import { NavBar } from "./nav-bar";
import BottomNavigation from "./bottom-navigation";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="pb-20">
        <Outlet />
      </div>
      <BottomNavigation />
    </div>
  );
};

export default MainLayout;

import { useNavigate, useLocation } from "react-router-dom";
import { Home, Bot, Shield, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { RoleTypes } from "@/features/user/interfaces/user.interface";
import { Routes } from "@/routes/routes";

interface BottomNavigationProps {
  className?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  admin?: boolean;
}

const BottomNavigation = ({ className }: BottomNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuthStore();

  const navItems: NavItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: Routes.dashboard.root,
    },
    {
      id: "bots",
      label: "Bots",
      icon: Bot,
      path: Routes.bots.root,
    },
    {
      id: "account",
      label: "Account",
      icon: User,
      path: Routes.account.root,
    },
    {
      id: "admin",
      label: "Admin",
      icon: Shield,
      path: Routes.admin.root,
      admin: true,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    if (path === "/dashboard/account") {
      return location.pathname === "/dashboard/account";
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const visibleNavItems = navItems.filter((item) => !item.admin || role === RoleTypes.admin);

  return (
    <div className={cn("fixed bottom-0 left-0 right-0 z-50", "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", "border-t border-border", "safe-area-pb-4", className)}>
      <div className="flex h-16 items-center justify-around px-4">
        {visibleNavItems.map((item) => {
          const isItemActive = isActive(item.path);
          const IconComponent = item.icon;

          return (
            <button key={item.id} onClick={() => handleNavigation(item.path)} className={cn("flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200", "hover:bg-accent hover:text-accent-foreground", "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", "active:scale-95", isItemActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground")} aria-label={`Navigate to ${item.label}`}>
              <IconComponent className={cn("h-5 w-5 transition-transform duration-200", isItemActive && "scale-110")} />
              <span className={cn("text-xs font-medium transition-colors duration-200", isItemActive && "text-primary")}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;

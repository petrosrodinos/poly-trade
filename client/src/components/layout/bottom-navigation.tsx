import { useNavigate, useLocation } from "react-router-dom";
import { Home, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  className?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const BottomNavigation = ({ className }: BottomNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/dashboard",
    },
    {
      id: "bots",
      label: "Bots",
      icon: Bot,
      path: "/dashboard/bots",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className={cn("fixed bottom-0 left-0 right-0 z-50", "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", "border-t border-border", "safe-area-pb-4", className)}>
      <div className="flex h-16 items-center justify-around px-4">
        {navItems.map((item) => {
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

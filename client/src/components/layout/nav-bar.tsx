import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { Routes } from "@/routes/routes";
import { APP_NAME } from "@/constants";
import { LogOut, User } from "lucide-react";
import { Button } from "../ui/button";

export const NavBar = () => {
  const { isLoggedIn, username, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex h-12 sm:h-14 items-center justify-between">
          <div className="flex items-center min-w-0 flex-1">
            {isLoggedIn ? (
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium truncate max-w-[100px] sm:max-w-[120px] md:max-w-none">{username || "User"}</span>
              </div>
            ) : (
              <Link to="/" className="text-base sm:text-lg font-bold text-foreground hover:text-primary transition-colors truncate">
                {APP_NAME}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {isLoggedIn ? (
              <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-1 sm:gap-2 hover:bg-destructive hover:text-destructive-foreground h-8 px-2 sm:h-9 sm:px-3">
                <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline text-xs sm:text-sm">Logout</span>
              </Button>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Button variant="ghost" size="sm" asChild className="hover:bg-muted h-8 px-2 sm:h-9 sm:px-3">
                  <Link to={Routes.auth.sign_in}>
                    <span className="text-xs sm:text-sm">Login</span>
                  </Link>
                </Button>
                <Button variant="default" size="sm" asChild className="bg-primary hover:bg-primary/90 h-8 px-2 sm:h-9 sm:px-3">
                  <Link to={Routes.auth.sign_up}>
                    <span className="text-xs sm:text-sm">Register</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

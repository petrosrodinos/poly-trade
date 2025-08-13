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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium truncate max-w-[120px] sm:max-w-none">{username || "User"}</span>
              </div>
            ) : (
              <Link to="/" className="text-lg font-bold text-foreground hover:text-primary transition-colors">
                {APP_NAME}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2 hover:bg-destructive hover:text-destructive-foreground">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild className="hover:bg-muted">
                  <Link to={Routes.auth.sign_in}>
                    <span className="text-sm">Login</span>
                  </Link>
                </Button>
                <Button variant="default" size="sm" asChild className="bg-primary hover:bg-primary/90">
                  <Link to={Routes.auth.sign_up}>
                    <span className="text-sm">Register</span>
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

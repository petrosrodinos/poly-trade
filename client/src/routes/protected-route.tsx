import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { RoleTypes, type RoleType } from "@/features/user/interfaces/user.interface";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: RoleType[];
  loggedIn?: boolean;
  requireVerified?: boolean;
  requireEnabled?: boolean;
  fallbackPath?: string;
}

export default function ProtectedRoute({ children, requiredRoles, loggedIn, requireVerified, requireEnabled, fallbackPath = "/auth/sign-in" }: ProtectedRouteProps) {
  const { isLoggedIn, role, verified, enabled } = useAuthStore();

  if (!isLoggedIn && loggedIn) {
    return <Navigate to={fallbackPath} replace />;
  }

  if (isLoggedIn && !loggedIn) {
    if (!verified) {
      return <Navigate to={"/auth/credentials"} replace />;
    }
    return <Navigate to={"/dashboard"} replace />;
  }

  if (requireVerified && !verified) {
    return <Navigate to={"/auth/credentials"} replace />;
  }

  if (requireEnabled && !enabled) {
    return <Navigate to={"/auth/confirmation"} replace />;
  }

  if (requiredRoles && !requiredRoles.includes(role || RoleTypes.user)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}

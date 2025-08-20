import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { RoleTypes, type RoleType } from "@/features/user/interfaces/user.interface";
import { Routes } from "./routes";

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

  // If user is logged in but accessing non-auth routes, redirect to dashboard
  if (loggedIn === false && isLoggedIn) {
    return <Navigate to={Routes.dashboard.root} replace />;
  }

  // If not logged in but trying to access protected route
  if (loggedIn === true && !isLoggedIn) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Only redirect if requireVerified is explicitly true and user is not verified
  if (requireVerified === true && !verified) {
    return <Navigate to={Routes.auth.credentials} replace />;
  }

  // Only redirect if requireEnabled is explicitly true and user is not enabled
  if (requireEnabled === true && !enabled) {
    return <Navigate to={Routes.auth.confirmation} replace />;
  }

  if (requiredRoles && !requiredRoles.includes(role || RoleTypes.user)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}

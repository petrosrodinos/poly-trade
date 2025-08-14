import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import DashboardPage from "@/pages/dashboard";
import BotPage from "@/pages/bot";
import SignUp from "@/pages/auth/pages/sign-up";
import SignIn from "@/pages/auth/pages/sign-in";
import ProtectedRoute from "./protected-route";
import AuthLayout from "@/pages/auth/layout";
import { NavBar } from "@/components/layout/NavBar";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <ProtectedRoute loggedIn={false}>
            <AuthLayout />
          </ProtectedRoute>
        }
      >
        <Route path="sign-up" element={<SignUp />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route index element={<Navigate to="/auth/sign-in" replace />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute loggedIn={true}>
            <div className="min-h-screen bg-background">
              <NavBar />
              <Outlet />
            </div>
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="bot/:uuid" element={<BotPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />

      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
}

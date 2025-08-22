import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "@/pages/dashboard";
import BotPage from "@/pages/bot";
import BotsPage from "@/pages/bots";
import AdminDashboardPage from "@/pages/admin";
import AccountPage from "@/pages/account";
import SignUp from "@/pages/auth/pages/sign-up";
import SignIn from "@/pages/auth/pages/sign-in";
import CredentialsPage from "@/pages/auth/pages/credentials";
import ConfirmationPage from "@/pages/auth/pages/confirmation";
import ProtectedRoute from "./protected-route";
import AuthLayout from "@/pages/auth/layout";
import DashboardLayout from "@/components/layout/dashboard-layout";
// import { RoleTypes } from "@/features/user/interfaces/user.interface";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />

      <Route path="/auth" element={<AuthLayout />}>
        <Route
          path="sign-up"
          element={
            <ProtectedRoute loggedIn={false}>
              <SignUp />
            </ProtectedRoute>
          }
        />
        <Route
          path="sign-in"
          element={
            <ProtectedRoute loggedIn={false}>
              <SignIn />
            </ProtectedRoute>
          }
        />
        <Route
          path="credentials"
          element={
            <ProtectedRoute loggedIn={true}>
              <CredentialsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="confirmation"
          element={
            <ProtectedRoute loggedIn={true}>
              <ConfirmationPage />
            </ProtectedRoute>
          }
        />
        <Route index element={<Navigate to="/auth/sign-in" replace />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute loggedIn={true} requireVerified={true} requireEnabled={true}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="bots" element={<BotsPage />} />
        <Route path="bots/:uuid" element={<BotPage />} />
        <Route path="admin" element={<AdminDashboardPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
}

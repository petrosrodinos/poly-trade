import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "@/pages/dashboard";
import BotPage from "@/pages/bot";
import BotsPage from "@/pages/bots";
import SignUp from "@/pages/auth/pages/sign-up";
import SignIn from "@/pages/auth/pages/sign-in";
import CredentialsPage from "@/pages/auth/pages/credentials";
import ProtectedRoute from "./protected-route";
import AuthLayout from "@/pages/auth/layout";
import MainLayout from "@/components/layout/main-layout";

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
        path="/auth"
        element={
          <ProtectedRoute loggedIn={true}>
            <AuthLayout />
          </ProtectedRoute>
        }
      >
        <Route path="credentials" element={<CredentialsPage />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute loggedIn={true} requireVerified={true}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="bots" element={<BotsPage />} />
        <Route path="bots/:uuid" element={<BotPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />

      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
}

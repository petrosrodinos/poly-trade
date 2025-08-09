import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "@/pages/dashboard/pages/dashboard";
import BotPage from "@/pages/dashboard/pages/bot";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth">
        {/* <Route path="sign-in" element={<SignIn />} /> */}
        <Route index element={<Navigate to="/auth/sign-in" replace />} />
      </Route>

      <Route path="/dashboard">
        <Route index element={<DashboardPage />} />
        <Route path="bot/:id" element={<BotPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

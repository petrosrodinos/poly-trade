import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/routes/protected-route";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/auth">
        {/* <Route path="sign-in" element={<SignIn />} /> */}
        <Route index element={<Navigate to="/auth/sign-in" replace />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
}

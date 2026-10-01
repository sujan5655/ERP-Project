import { Routes, Route } from "react-router-dom";

import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import LogoutButton from "../features/auth/LogoutButton";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <div>
            <h1>Dashboard</h1>
            <LogoutButton />
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;

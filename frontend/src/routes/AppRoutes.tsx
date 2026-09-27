import { Routes, Route } from "react-router-dom";

import LoginPage from "../features/auth/LoginPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default AppRoutes;

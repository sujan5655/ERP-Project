import { useState } from "react";

import "./App.css";
import { useAppSelector } from "./app/hooks";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import AuthInitializer from "./features/auth/AuthInitializer";
import LogoutButton from "./features/auth/LogoutButton";

function App() {
  const state = useAppSelector((state) => state);
  console.log("Reduc State", state);
  return (
    <>
      <h1>Retail ERP</h1>
      <p>Redux Toolkit connected.</p>
      <AuthInitializer />

      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;

import { useState } from "react";

import "./App.css";
import { useAppSelector } from "./app/hooks";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const state = useAppSelector((state) => state);
  console.log("Reduc State", state);
  return (
    <>
      <h1>Retail ERP</h1>
      <p>Redux Toolkit connected.</p>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;

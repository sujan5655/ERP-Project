import { Routes, Route } from "react-router-dom";

import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import LogoutButton from "../features/auth/LogoutButton";
import ProtectedRoute from "./ProtectedRoute";
import CompanyPage from "../features/companies/CompanyPage";
import BranchPage from "../features/branches/BranchPage";
import WarehousePage from "../features/warehouses/WarehousePage";
import CategoryPage from "../features/categories/CategoryPage";
import BrandPage from "../features/brands/BrandPage";
import ProductPage from "../features/products/productPage";
import InventoryPage from "../features/inventory/InventoryPage";
import StockMovementPage from "../features/inventory/StockMovementPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={
            <div>
              <h1>Dashboard</h1>
              <LogoutButton />
            </div>
          }
        />
        <Route path="/warehouses" element={<WarehousePage />} />
        <Route path="/companies" element={<CompanyPage />} />
      </Route>

      <Route path="/branches" element={<BranchPage />} />

      <Route path="/categories" element={<CategoryPage />} />

      <Route path="/brands" element={<BrandPage />} />
      <Route path="/products" element={<ProductPage />} />

      <Route path="/inventory" element={<InventoryPage />} />

      <Route path="/stock-movements" element={<StockMovementPage />} />
    </Routes>
  );
};

export default AppRoutes;

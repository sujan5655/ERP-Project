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
import StockTransferPage from "../features/inventory/StockTransferPage";
import SupplierPage from "../features/suppliers/supplierPage";
import PurchasingPage from "../pages/PurchasePage";
import CustomersPage from "../pages/CustomerPage";
import SalesPage from "../pages/SalesPage";
import PaymentsPage from "../pages/PaymentsPage";
import DashboardPage from "../pages/DashboardPage";
import ReportsPage from "../pages/ReportsPage";
import AuditLogsPage from "../pages/AuditLogsPage";
import NotificationsPage from "../pages/NotificationsPage";

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
              <DashboardPage />
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

      <Route path="/stock-transfers" element={<StockTransferPage />} />

      <Route path="/suppliers" element={<SupplierPage />} />

      <Route path="/purchasing" element={<PurchasingPage />} />

      <Route path="/customers" element={<CustomersPage />} />
      <Route path="/sales" element={<SalesPage />} />

      <Route path="/payments" element={<PaymentsPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/audit-logs" element={<AuditLogsPage />} />

      <Route path="/notifications" element={<NotificationsPage />} />
    </Routes>
  );
};

export default AppRoutes;

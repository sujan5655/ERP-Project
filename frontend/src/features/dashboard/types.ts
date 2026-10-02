export interface DashboardSummary {
  total_companies: number;
  total_branches: number;
  total_warehouses: number;
  total_products: number;
  total_inventory_quantity: number;
  low_stock_products: number;
  total_suppliers: number;
  total_customers: number;
  total_employees: number;
  total_purchase_orders: number;
  total_sales_orders: number;
  total_paid: number;
  total_pending_payments: number;
}

export interface RecentSale {
  id: number;
  order_number: string;
  customer: string;
  warehouse: string;
  status: string;
  order_date: string;
  created_at: string;
}

export interface RecentStockMovement {
  id: number;
  product: string;
  warehouse: string;
  movement_type: string;
  quantity: number;
  reference: string;
  created_at: string;
}

export interface DashboardResponse {
  success: boolean;
  summary: DashboardSummary;
  recent_sales: RecentSale[];
  recent_stock_movements: RecentStockMovement[];
}

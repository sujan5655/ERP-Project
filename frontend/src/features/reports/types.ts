export type ReportType = "sales" | "purchases" | "inventory" | "payments";

export interface SalesSummary {
  total_orders: number;
  total_items: number;
  total_amount: number | string;
}

export interface PurchaseSummary {
  total_orders: number;
  total_items: number;
  total_amount: number | string;
}

export interface InventorySummary {
  total_products: number;
  total_quantity: number | string;
}

export interface PaymentSummary {
  total_payments: number;
  total_amount: number | string;
  paid_amount: number | string;
  pending_amount: number | string;
}

export interface SalesRecord {
  id: number;
  order_number: string;
  customer: string;
  warehouse: string;
  status: string;
  order_date: string;
  total_amount: number | string;
}

export interface PurchaseRecord {
  id: number;
  order_number: string;
  supplier: string;
  warehouse: string;
  status: string;
  order_date: string;
  total_amount: number | string;
}

export interface InventoryRecord {
  id: number;
  product: string;
  sku: string;
  warehouse: string;
  quantity: number | string;
  reorder_level: number;
  is_low_stock: boolean;
}

export interface PaymentRecord {
  id: number;
  payment_number: string;
  sales_order: string;
  amount: number | string;
  payment_method: string;
  status: string;
  transaction_reference: string;
  payment_date: string | null;
}

export interface ReportsResponse {
  success: boolean;
  report_type: ReportType;
  summary: SalesSummary | PurchaseSummary | InventorySummary | PaymentSummary;
  records:
    | SalesRecord[]
    | PurchaseRecord[]
    | InventoryRecord[]
    | PaymentRecord[];
}

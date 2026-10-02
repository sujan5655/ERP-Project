export type SalesOrderStatus = "DRAFT" | "CONFIRMED" | "CANCELLED";

export interface SalesOrderItem {
  id: number;
  sales_order: number;
  product: number;
  quantity: string;
  unit_price: string;
  tax_rate: string;
  subtotal: string;
  tax_amount: string;
  total: string;
  created_at: string;
  updated_at: string;
}

export interface SalesOrder {
  id: number;
  customer: number;
  warehouse: number;
  order_number: string;
  order_date: string;
  status: SalesOrderStatus;
  notes: string;
  items: SalesOrderItem[];
  created_at: string;
  updated_at: string;
}

export interface SalesOrderListResponse {
  success: boolean;
  sales_orders: SalesOrder[];
}

export interface SalesOrderResponse {
  success: boolean;
  message?: string;
  sales_order: SalesOrder;
}

export interface CreateSalesOrderRequest {
  customer: number;
  warehouse: number;
  order_number: string;
  order_date: string;
  notes?: string;
}

export interface CreateSalesOrderItemRequest {
  product: number;
  quantity: string;
  unit_price: string;
  tax_rate: string;
}

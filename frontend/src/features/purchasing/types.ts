export type PurchaseOrderStatus =
  | "DRAFT"
  | "CONFIRMED"
  | "RECEIVED"
  | "CANCELLED";

export interface PurchaseOrderItem {
  id: number;
  purchase_order: number;
  product: number;
  quantity: string;
  unit_cost: string;
  tax_rate: string;
  subtotal: string;
  tax_amount: string;
  total: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrder {
  id: number;
  supplier: number;
  warehouse: number;
  order_number: string;
  order_date: string;
  expected_date: string | null;
  status: PurchaseOrderStatus;
  notes: string;
  items: PurchaseOrderItem[];
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderListResponse {
  success: boolean;
  purchase_orders: PurchaseOrder[];
}

export interface PurchaseOrderResponse {
  success: boolean;
  message?: string;
  purchase_order: PurchaseOrder;
}

export interface CreatePurchaseOrderRequest {
  supplier: number;
  warehouse: number;
  order_number: string;
  order_date: string;
  expected_date?: string;
  notes?: string;
}

export interface CreatePurchaseOrderItemRequest {
  product: number;
  quantity: string;
  unit_cost: string;
  tax_rate: string;
}

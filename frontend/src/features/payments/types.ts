export type PaymentMethod =
  | "CASH"
  | "BANK_TRANSFER"
  | "CARD"
  | "ESEWA"
  | "KHALTI"
  | "OTHER";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "PARTIAL"
  | "FAILED"
  | "REFUNDED"
  | "CANCELLED";

export interface Payment {
  id: number;
  sales_order: number;
  payment_number: string;
  amount: string;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  transaction_reference: string;
  payment_date: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentListResponse {
  success: boolean;
  payments: Payment[];
}

export interface PaymentResponse {
  success: boolean;
  message?: string;
  payment: Payment;
}

export interface CreatePaymentRequest {
  sales_order: number;
  payment_number: string;
  amount: string;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  transaction_reference: string;
  payment_date: string;
  notes: string;
}

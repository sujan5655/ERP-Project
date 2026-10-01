export type StockMovementType =
  | "PURCHASE"
  | "SALE"
  | "RETURN"
  | "TRANSFER_IN"
  | "TRANSFER_OUT"
  | "ADJUSTMENT";

export interface StockMovement {
  id: number;
  product: number;
  warehouse: number;
  movement_type: StockMovementType;
  quantity: string;
  reference: string;
  note: string;
  created_at: string;
}

export interface StockMovementsResponse {
  success: boolean;
  message: string;
  movements: StockMovement[];
}

export interface CreateStockMovementRequest {
  product: number;
  warehouse: number;
  movement_type: StockMovementType;
  quantity: string;
  reference: string;
  note: string;
}

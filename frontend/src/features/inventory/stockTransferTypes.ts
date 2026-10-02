export interface StockTransfer {
  id: number;
  product: number;
  from_warehouse: number;
  to_warehouse: number;
  quantity: string;
  reference: string;
  note: string;
  created_at: string;
}

export interface StockTransfersResponse {
  success: boolean;
  message: string;
  transfers: StockTransfer[];
}

export interface CreateStockTransferRequest {
  product: number;
  from_warehouse: number;
  to_warehouse: number;
  quantity: string;
  reference: string;
  note: string;
}

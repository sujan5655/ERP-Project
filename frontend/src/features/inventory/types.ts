export interface Inventory {
  id: number;

  product: number;
  warehouse: number;

  quantity: string;
  reorder_level: number;

  created_at: string;
  updated_at: string;
}

export interface InventoriesResponse {
  success: boolean;
  message: string;
  inventories: Inventory[];
}

export interface CreateInventoryRequest {
  product: number;
  warehouse: number;
  quantity: string;
  reorder_level: number;
}

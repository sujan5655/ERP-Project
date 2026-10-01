export interface Warehouse {
  id: number;
  branch: number;
  name: string;
  code: string;
  photo: string | null;
  address: string;
  manager_name: string;
  phone: string;
  capacity: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WarehousesResponse {
  success: boolean;
  message: string;
  warehouses: Warehouse[];
}

export interface CreateWarehouseRequest {
  branch: number;
  name: string;
  code: string;
  address: string;
  manager_name: string;
  phone: string;
  capacity: string;
  is_active: boolean;
  photo?: File | null;
}

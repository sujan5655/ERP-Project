export interface Product {
  id: number;

  category: number;
  brand: number | null;

  name: string;
  sku: string;
  description: string;

  image: string | null;

  cost_price: string;
  selling_price: string;
  tax_rate: string;

  reorder_level: number;
  unit: string;

  is_active: boolean;

  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  products: Product[];
}

export interface CreateProductRequest {
  category: number;
  brand: number | null;

  name: string;
  sku: string;
  description: string;

  cost_price: string;
  selling_price: string;
  tax_rate: string;

  reorder_level: number;
  unit: string;

  is_active: boolean;

  image?: File | null;
}

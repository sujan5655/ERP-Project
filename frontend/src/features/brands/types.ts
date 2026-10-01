export interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BrandsResponse {
  success: boolean;
  message: string;
  brands: Brand[];
}

export interface CreateBrandRequest {
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  logo?: File | null;
}

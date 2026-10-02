export interface Supplier {
  id: number;
  name: string;
  code: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  tax_number: string;
  payment_terms: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SuppliersResponse {
  success: boolean;
  message: string;
  suppliers: Supplier[];
}

export interface CreateSupplierRequest {
  name: string;
  code: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  tax_number: string;
  payment_terms: string;
  is_active: boolean;
}

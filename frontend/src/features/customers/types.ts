export interface Customer {
  id: number;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  tax_number: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerListResponse {
  success: boolean;
  customers: Customer[];
}

export interface CustomerResponse {
  success: boolean;
  message?: string;
  customer: Customer;
}

export interface CreateCustomerRequest {
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  tax_number: string;
  is_active: boolean;
}

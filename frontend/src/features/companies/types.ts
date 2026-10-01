export interface Company {
  id: number;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompaniesResponse {
  success: boolean;
  message: string;
  companies: Company[];
}

export interface CreateCompanyRequest {
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  logo?: File | null;
}

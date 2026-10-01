export interface Branch {
  id: number;
  company: number;
  name: string;
  code: string;
  photo: string | null;
  email: string;
  phone: string;
  address: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BranchesResponse {
  success: boolean;
  message: string;
  branches: Branch[];
}

export interface CreateBranchRequest {
  company: number;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  photo?: File | null;
}

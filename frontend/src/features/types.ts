export type UserRole =
  | "SUPER_ADMIN"
  | "COMPANY_ADMIN"
  | "BRANCH_MANAGER"
  | "WAREHOUSE_MANAGER"
  | "SALES_STAFF"
  | "ACCOUNTANT";

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}

export interface RegisterRequest {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface MeResponse {
  success: boolean;
  message: string;
  user: User;
}

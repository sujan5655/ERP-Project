export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  categories: Category[];
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  image?: File | null;
}

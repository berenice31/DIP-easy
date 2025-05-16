export interface Ingredient {
  id: string;
  nom: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateIngredientRequest {
  nom: string;
  description?: string;
}

export interface UpdateIngredientRequest
  extends Partial<CreateIngredientRequest> {
  id: string;
}

export interface IngredientResponse {
  items: Ingredient[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

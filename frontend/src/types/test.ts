export interface StabilityTest {
  id: string;
  product_id: string;
  type: string;
  resultat: string;
  date_test: string;
  created_at: string;
  updated_at: string;
}

export interface CompatibilityTest {
  id: string;
  product_id: string;
  ingredient_id: string;
  resultat: string;
  date_test: string;
  created_at: string;
  updated_at: string;
}

export interface CreateStabilityTestRequest {
  product_id: string;
  type: string;
  resultat: string;
  date_test: string;
}

export interface CreateCompatibilityTestRequest {
  product_id: string;
  ingredient_id: string;
  resultat: string;
  date_test: string;
}

export interface UpdateStabilityTestRequest
  extends Partial<CreateStabilityTestRequest> {
  id: string;
}

export interface UpdateCompatibilityTestRequest
  extends Partial<CreateCompatibilityTestRequest> {
  id: string;
}

export interface TestResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

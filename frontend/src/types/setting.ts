export interface Setting {
  id: string;
  cle: string;
  valeur: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSettingRequest {
  cle: string;
  valeur: string;
  description?: string;
}

export interface UpdateSettingRequest extends Partial<CreateSettingRequest> {
  id: string;
}

export interface SettingResponse {
  items: Setting[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

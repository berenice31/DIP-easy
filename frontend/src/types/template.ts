export interface Template {
  id: string;
  nom: string;
  contenu: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTemplateRequest {
  nom: string;
  contenu: string;
}

export interface UpdateTemplateRequest extends Partial<CreateTemplateRequest> {
  id: string;
}

export interface TemplateResponse {
  items: Template[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

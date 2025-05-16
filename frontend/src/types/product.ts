export interface Product {
  id: string;
  nom_commercial: string;
  fournisseur: string;
  ref_formule: string;
  ref_produit?: string;
  date_mise_marche: string;
  resp_mise_marche: string;
  faconnerie: string;
  pc_ph?: number;
  pc_densite?: number;
  pc_organoleptiques?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductRequest {
  nom_commercial: string;
  fournisseur: string;
  ref_formule: string;
  ref_produit?: string;
  date_mise_marche: string;
  resp_mise_marche: string;
  faconnerie: string;
  pc_ph?: number;
  pc_densite?: number;
  pc_organoleptiques?: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

export interface ProductResponse {
  items: Product[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

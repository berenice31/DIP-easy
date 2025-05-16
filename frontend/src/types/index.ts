// Types d'authentification
export interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

// Types de produits
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

// Types d'ingrédients
export interface Ingredient {
  id: string;
  nom: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Types de tests
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

// Types de documents
export interface Template {
  id: string;
  nom: string;
  contenu: string;
  created_at: string;
  updated_at: string;
}

export interface Generation {
  id: string;
  template_id: string;
  product_id: string;
  contenu: string;
  created_at: string;
  updated_at: string;
}

// Types de tâches
export interface Task {
  id: string;
  title: string;
  prompt: string;
  schedule: string;
  is_enabled: boolean;
  next_run?: string;
  last_run?: string;
  created_at: string;
  updated_at: string;
}

// Types de logs
export interface Log {
  id: string;
  user_id: string;
  action: string;
  details: string;
  created_at: string;
}

// Types de paramètres
export interface Setting {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export * from "./auth";
export * from "./product";
export * from "./ingredient";
export * from "./test";
export * from "./template";
export * from "./task";
export * from "./log";
export * from "./setting";

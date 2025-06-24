import axios from "axios";
import { storage } from "../utils/storage";

const API_URL =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:8000/api/v1";

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refresh_token";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Fonction utilitaire pour vérifier l'expiration d'un JWT
function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  async (config) => {
    let token = storage.get<string | null>(TOKEN_KEY, null as any);
    const refreshToken = storage.get<string | null>(
      REFRESH_TOKEN_KEY,
      null as any
    );
    // Si le token est expiré mais qu'on a un refresh token, tente un refresh proactif
    if (token && isTokenExpired(token) && refreshToken) {
      try {
        const response = await api.post("/auth/refresh", {
          refresh_token: refreshToken,
        });
        const { access_token } = response.data;
        storage.set(TOKEN_KEY, access_token);
        token = access_token;
      } catch (refreshError) {
        storage.remove(TOKEN_KEY);
        storage.remove(REFRESH_TOKEN_KEY);
        alert("Votre session a expiré. Merci de vous reconnecter.");
        window.location.href = "/login";
        throw refreshError;
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si l'erreur est 401 et qu'on n'a pas déjà tenté de rafraîchir le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = storage.get<string | null>(
          REFRESH_TOKEN_KEY,
          null as any
        );
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await api.post("/auth/refresh", {
          refresh_token: refreshToken,
        });
        const { access_token } = response.data;

        storage.set(TOKEN_KEY, access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Si le rafraîchissement échoue, on déconnecte l'utilisateur
        storage.remove(TOKEN_KEY);
        storage.remove(REFRESH_TOKEN_KEY);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export interface Product {
  id: string;
  nom_client?: string;
  marque?: string;
  gamme?: string;
  nom_produit?: string;
  nom_commercial?: string;
  format?: string;
  version?: string;
  status: "DRAFT" | "VALIDATED";
  progression?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DipFormData {
  nom_client: string;
  marque: string;
  gamme: string;
  nom_produit: string;
  nom_commercial: string;
  ref_formule: string;
  ref_produit: string;
  date_mise_marche: Date | string | null;
  resp_mise_marche: string;
  faconnerie: string;
  ingredients: string;
  ph: string;
  viscosite: string;
  densite: string;
  point_eclair: string;
  germes_aerobies: string;
  levures_moisissures: string;
  e_coli: string;
  staphylocoques: string;
  metaux_lourds: string;
  arsenic: string;
  plomb: string;
  mercure: string;
  type_emballage: string;
  materiau_emballage: string;
  utilisation_normale: string;
  instructions_utilisation: string;
  surface_exposee: string;
  quantite_appliquee: string;
  concentration_air: string;
  volume_respire: string;
  quantite_ingeree: string;
  dl50_orale: string;
  dl50_cutanee: string;
  cl50_inhalation: string;
  dose_sans_effet: string;
  dose_min_effet: string;
  irritation_cutanee: string;
  sensibilisation_cutanee: string;
  irritation_oculaire: string;
  duree_conservation: string;
  conditions_conservation: string;
  resultats_stabilite: string;
  valide_par: string;
  date_validation: Date | string | null;
  status?: "DRAFT" | "VALIDATED";
  progression?: number;
}

export const authService = {
  login: async (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);
    const response = await api.post("/auth/token", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return response.data;
  },

  register: async (userData: {
    email: string;
    password: string;
    password_confirm: string;
    role: string;
  }) => {
    const response = await api.post("/auth/signup", userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post("/auth/refresh", {
      refresh_token: refreshToken,
    });
    return response.data;
  },
};

export const productService = {
  // Récupérer tous les produits
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get("/products/");
    return response.data;
  },

  // Récupérer un produit par son ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Créer un nouveau produit
  createProduct: async (data: DipFormData): Promise<Product> => {
    const response = await api.post("/products/", data);
    return response.data;
  },

  // Mettre à jour un produit
  updateProduct: async (
    id: string,
    data: Partial<Product>
  ): Promise<Product> => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  // Supprimer un produit
  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

export default api;

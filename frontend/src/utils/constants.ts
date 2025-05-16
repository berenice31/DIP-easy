// Configuration de l'application
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || "DIP-easy",
  version: import.meta.env.VITE_APP_VERSION || "0.1.0",
  description:
    import.meta.env.VITE_APP_DESCRIPTION || "Application de gestion des DIP",
};

// Configuration de l'API
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",
  version: import.meta.env.VITE_API_VERSION || "v1",
  timeout: 30000, // 30 secondes
};

// Configuration de l'authentification
export const AUTH_CONFIG = {
  tokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || "token",
  refreshTokenKey:
    import.meta.env.VITE_AUTH_REFRESH_TOKEN_KEY || "refresh_token",
  tokenExpiry: 3600, // 1 heure
};

// Configuration des fonctionnalités
export const FEATURE_FLAGS = {
  enableTwoFactor: import.meta.env.VITE_ENABLE_TWO_FACTOR === "true",
  enableRegistration: import.meta.env.VITE_ENABLE_REGISTRATION === "true",
};

// Configuration de Google Drive
export const GOOGLE_DRIVE_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID,
  apiKey: import.meta.env.VITE_GOOGLE_DRIVE_API_KEY,
};

// Configuration du logging
export const LOGGING_CONFIG = {
  enabled: import.meta.env.VITE_ENABLE_LOGGING === "true",
  level: import.meta.env.VITE_LOG_LEVEL || "info",
};

// Messages d'erreur
export const ERROR_MESSAGES = {
  network: "Erreur de connexion au serveur",
  auth: "Session expirée, veuillez vous reconnecter",
  validation: "Veuillez vérifier les informations saisies",
  unknown: "Une erreur inattendue est survenue",
};

// Messages de succès
export const SUCCESS_MESSAGES = {
  save: "Enregistrement effectué avec succès",
  delete: "Suppression effectuée avec succès",
  update: "Mise à jour effectuée avec succès",
};

// Configuration des routes
export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  products: "/products",
  ingredients: "/ingredients",
  tests: "/tests",
  templates: "/templates",
  settings: "/settings",
};

// Configuration des rôles
export const ROLES = {
  admin: "admin",
  user: "user",
};

// Configuration des permissions
export const PERMISSIONS = {
  create: "create",
  read: "read",
  update: "update",
  delete: "delete",
};

// Configuration des statuts
export const STATUS = {
  active: "active",
  inactive: "inactive",
  pending: "pending",
  completed: "completed",
  failed: "failed",
};

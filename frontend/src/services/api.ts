import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(
      import.meta.env.VITE_AUTH_TOKEN_KEY || "token"
    );
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
        const refreshToken = localStorage.getItem(
          import.meta.env.VITE_AUTH_REFRESH_TOKEN_KEY || "refresh_token"
        );
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await api.post("/auth/refresh", {
          refresh_token: refreshToken,
        });
        const { access_token } = response.data;

        localStorage.setItem(
          import.meta.env.VITE_AUTH_TOKEN_KEY || "token",
          access_token
        );
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Si le rafraîchissement échoue, on déconnecte l'utilisateur
        localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY || "token");
        localStorage.removeItem(
          import.meta.env.VITE_AUTH_REFRESH_TOKEN_KEY || "refresh_token"
        );
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string) => {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);
    const response = await api.post("/auth/token", params, {
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

export default api;

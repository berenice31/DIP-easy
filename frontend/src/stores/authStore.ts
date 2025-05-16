import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const response = await axios.post("/api/v1/auth/token", {
          username: email,
          password,
        });
        const { access_token, user } = response.data;
        localStorage.setItem("token", access_token);
        set({ user, token: access_token, isAuthenticated: true });
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${access_token}`;
      },

      register: async (email: string, password: string) => {
        await axios.post("/api/v1/auth/signup", {
          email,
          password,
        });
      },

      logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null, isAuthenticated: false });
        delete axios.defaults.headers.common["Authorization"];
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

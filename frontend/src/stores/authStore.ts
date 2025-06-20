import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/api";

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
        const response = await authService.login(email, password);
        const { access_token } = response;
        localStorage.setItem("token", access_token);
        set({ token: access_token, isAuthenticated: true });
      },

      register: async (email: string, password: string) => {
        await authService.register({
          email,
          password,
          password_confirm: password,
          role: "user",
        });
      },

      logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

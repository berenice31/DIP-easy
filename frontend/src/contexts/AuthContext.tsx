import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

interface AuthContextType {
  isAuthenticated: boolean;
  is2FARequired: boolean;
  login: (email: string, password: string) => Promise<void>;
  verify2FA: (code: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [is2FARequired, setIs2FARequired] = useState(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      console.log("Tentative de connexion avec:", { email });
      const response = await api.post("/auth/login", { email, password });
      console.log("Réponse de connexion:", response.data);

      if (response.data.requires2FA) {
        console.log("2FA requis");
        setIs2FARequired(true);
        return;
      }

      if (response.data.token) {
        console.log("Token reçu, connexion réussie");
        localStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
        navigate("/dashboard");
      } else {
        console.error("Pas de token dans la réponse");
        throw new Error("Pas de token dans la réponse");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      throw error;
    }
  };

  const verify2FA = async (code: string) => {
    try {
      console.log("Vérification 2FA avec le code:", code);
      const response = await api.post("/auth/verify-2fa", { code });
      console.log("Réponse 2FA:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
        setIs2FARequired(false);
        navigate("/dashboard");
      } else {
        throw new Error("Pas de token dans la réponse");
      }
    } catch (error) {
      console.error("Erreur de vérification 2FA:", error);
      throw error;
    }
  };

  const logout = () => {
    console.log("Déconnexion");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setIs2FARequired(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, is2FARequired, login, verify2FA, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

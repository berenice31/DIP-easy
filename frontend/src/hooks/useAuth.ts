import { useState, useEffect } from "react";
import { useApi } from "./useApi";
import { authService } from "../services/api";
import { User } from "../types/auth";
import { storage } from "../utils/storage";
import { useNavigate } from "react-router-dom";

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refresh_token";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loginApi = useApi(authService.login, {
    onSuccess: async (response) => {
      storage.set(TOKEN_KEY, response.access_token);
      storage.set(REFRESH_TOKEN_KEY, response.refresh_token);
      await fetchUserApi.execute();
      navigate("/dashboard");
    },
  });

  const registerApi = useApi(authService.register, {
    onSuccess: async (response) => {
      storage.set(TOKEN_KEY, response.access_token);
      storage.set(REFRESH_TOKEN_KEY, response.refresh_token);
      await fetchUserApi.execute();
      navigate("/dashboard");
    },
  });

  const logoutApi = useApi(async () => {
    storage.remove(TOKEN_KEY);
    storage.remove(REFRESH_TOKEN_KEY);
    setUser(null);
    navigate("/login");
  });

  const fetchUserApi = useApi(authService.getCurrentUser, {
    onSuccess: (user) => {
      setUser(user);
    },
    onError: () => {
      storage.remove(TOKEN_KEY);
      storage.remove(REFRESH_TOKEN_KEY);
      setUser(null);
    },
  });

  useEffect(() => {
    const token = storage.get(TOKEN_KEY, null);
    if (token) {
      fetchUserApi.execute();
    }
    setIsLoading(false);
  }, []);

  return {
    user,
    isLoading,
    login: loginApi.execute,
    register: registerApi.execute,
    logout: logoutApi.execute,
    fetchUser: fetchUserApi.execute,
  };
}

import { useState, useCallback } from "react";
import { authService } from "../services/api";

interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

interface UseApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  loading: boolean;
  execute: (...args: any[]) => Promise<void>;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: ApiError) => void;
  } = {}
): UseApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiFunction(...args);
        setData(response);
        options.onSuccess?.(response);
      } catch (err: any) {
        const apiError: ApiError = {
          message:
            err.response?.data?.detail ||
            err.message ||
            "Une erreur est survenue",
          status: err.response?.status,
          data: err.response?.data,
        };
        setError(apiError);
        options.onError?.(apiError);
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, options]
  );

  return { data, error, loading, execute };
}

// Exemple d'utilisation avec les services d'authentification
export const useAuth = () => {
  const login = useApi(authService.login);
  const register = useApi(authService.register);
  const getCurrentUser = useApi(authService.getCurrentUser);

  return {
    login,
    register,
    getCurrentUser,
  };
};

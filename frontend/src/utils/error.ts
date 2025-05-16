import { logger } from "./logger";

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    logger.error("Application error", { error });
    return new AppError(error.message);
  }

  logger.error("Unknown error", { error });
  return new AppError("Une erreur inattendue est survenue");
};

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AppError) {
    return error.code === "NETWORK_ERROR";
  }
  return false;
};

export const isAuthError = (error: unknown): boolean => {
  if (error instanceof AppError) {
    return error.status === 401 || error.status === 403;
  }
  return false;
};

export const isValidationError = (error: unknown): boolean => {
  if (error instanceof AppError) {
    return error.status === 422;
  }
  return false;
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur inattendue est survenue";
};

export const getErrorDetails = (error: unknown): any => {
  if (error instanceof AppError) {
    return error.data;
  }

  return null;
};

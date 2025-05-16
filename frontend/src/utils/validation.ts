import { logger } from "./logger";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

export const required = (message = "Ce champ est requis"): ValidationRule => ({
  validate: (value) => value !== undefined && value !== null && value !== "",
  message,
});

export const email = (message = "Email invalide"): ValidationRule => ({
  validate: (value) => {
    if (!value) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  message,
});

export const minLength = (
  length: number,
  message?: string
): ValidationRule => ({
  validate: (value) => {
    if (!value) return true;
    return value.length >= length;
  },
  message: message || `Minimum ${length} caractères requis`,
});

export const maxLength = (
  length: number,
  message?: string
): ValidationRule => ({
  validate: (value) => {
    if (!value) return true;
    return value.length <= length;
  },
  message: message || `Maximum ${length} caractères autorisés`,
});

export const pattern = (regex: RegExp, message: string): ValidationRule => ({
  validate: (value) => {
    if (!value) return true;
    return regex.test(value);
  },
  message,
});

export const validate = (
  value: any,
  rules: ValidationRule[]
): ValidationError | null => {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      logger.debug("Validation failed", { value, rule: rule.message });
      return {
        field: "",
        message: rule.message,
      };
    }
  }
  return null;
};

export const validateForm = (
  values: Record<string, any>,
  rules: Record<string, ValidationRule[]>
): ValidationError[] => {
  const errors: ValidationError[] = [];

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = values[field];
    const error = validate(value, fieldRules);
    if (error) {
      errors.push({
        field,
        message: error.message,
      });
    }
  }

  return errors;
};

import { logger } from "./logger";

export const formatNumber = (
  number: number,
  options: Intl.NumberFormatOptions = {}
): string => {
  try {
    return new Intl.NumberFormat("fr-FR", options).format(number);
  } catch (error) {
    logger.error("Error formatting number", { number, options, error });
    return number.toString();
  }
};

export const formatCurrency = (
  amount: number,
  currency: string = "EUR"
): string => {
  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
    }).format(amount);
  } catch (error) {
    logger.error("Error formatting currency", { amount, currency, error });
    return `${amount} ${currency}`;
  }
};

export const formatPercentage = (
  value: number,
  decimals: number = 2
): string => {
  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "percent",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value / 100);
  } catch (error) {
    logger.error("Error formatting percentage", { value, decimals, error });
    return `${value}%`;
  }
};

export const formatFileSize = (bytes: number): string => {
  try {
    if (bytes === 0) return "0 B";

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  } catch (error) {
    logger.error("Error formatting file size", { bytes, error });
    return `${bytes} B`;
  }
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  try {
    const cleaned = phoneNumber.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
    }
    return phoneNumber;
  } catch (error) {
    logger.error("Error formatting phone number", { phoneNumber, error });
    return phoneNumber;
  }
};

export const formatAddress = (address: {
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}): string => {
  try {
    const parts = [
      address.street,
      address.postalCode,
      address.city,
      address.country,
    ].filter(Boolean);

    return parts.join(", ");
  } catch (error) {
    logger.error("Error formatting address", { address, error });
    return "";
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  try {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
  } catch (error) {
    logger.error("Error truncating text", { text, maxLength, error });
    return text;
  }
};

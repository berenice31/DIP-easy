import { logger } from "./logger";

export const formatDate = (
  date: string | Date,
  format: string = "DD/MM/YYYY"
): string => {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      throw new Error("Invalid date");
    }

    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const seconds = d.getSeconds().toString().padStart(2, "0");

    return format
      .replace("DD", day)
      .replace("MM", month)
      .replace("YYYY", year.toString())
      .replace("HH", hours)
      .replace("mm", minutes)
      .replace("ss", seconds);
  } catch (error) {
    logger.error("Error formatting date", { date, format, error });
    return "";
  }
};

export const parseDate = (
  dateString: string,
  format: string = "DD/MM/YYYY"
): Date | null => {
  try {
    const parts = dateString.split(/[\/\-]/);
    if (parts.length !== 3) {
      throw new Error("Invalid date format");
    }

    let day: number, month: number, year: number;

    if (format === "DD/MM/YYYY") {
      [day, month, year] = parts.map(Number);
    } else if (format === "YYYY-MM-DD") {
      [year, month, day] = parts.map(Number);
    } else {
      throw new Error("Unsupported date format");
    }

    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    return date;
  } catch (error) {
    logger.error("Error parsing date", { dateString, format, error });
    return null;
  }
};

export const isDateValid = (date: string | Date): boolean => {
  try {
    const d = new Date(date);
    return !isNaN(d.getTime());
  } catch (error) {
    logger.error("Error validating date", { date, error });
    return false;
  }
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const addYears = (date: Date, years: number): Date => {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
};

export const getDaysBetween = (startDate: Date, endDate: Date): number => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

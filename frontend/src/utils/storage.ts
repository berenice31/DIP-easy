import { logger } from "./logger";

class Storage {
  private prefix: string;

  constructor(prefix = "dip-easy") {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  set<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(this.getKey(key), serializedValue);
      logger.debug("Storage set", { key, value });
    } catch (error) {
      logger.error("Error setting storage value", { key, error });
    }
  }

  get<T>(key: string, defaultValue: T): T {
    try {
      const serializedValue = localStorage.getItem(this.getKey(key));
      if (serializedValue === null) {
        return defaultValue;
      }
      const value = JSON.parse(serializedValue) as T;
      logger.debug("Storage get", { key, value });
      return value;
    } catch (error) {
      logger.error("Error getting storage value", { key, error });
      return defaultValue;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key));
      logger.debug("Storage remove", { key });
    } catch (error) {
      logger.error("Error removing storage value", { key, error });
    }
  }

  clear(): void {
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith(this.prefix))
        .forEach((key) => localStorage.removeItem(key));
      logger.debug("Storage clear");
    } catch (error) {
      logger.error("Error clearing storage", { error });
    }
  }
}

export const storage = new Storage();

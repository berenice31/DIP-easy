import api from "./api";
import {
  Log,
  CreateLogRequest,
  UpdateLogRequest,
  LogResponse,
} from "../types/log";
import { logger } from "../utils";

class LogService {
  private readonly baseUrl = "/logs";

  async getLogs(page: number = 1, size: number = 10): Promise<LogResponse> {
    try {
      const response = await api.get(this.baseUrl, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      logger.error("Error fetching logs", { error });
      throw error;
    }
  }

  async getLog(id: string): Promise<Log> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      logger.error("Error fetching log", { id, error });
      throw error;
    }
  }

  async createLog(data: CreateLogRequest): Promise<Log> {
    try {
      const response = await api.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      logger.error("Error creating log", { data, error });
      throw error;
    }
  }

  async updateLog(id: string, data: UpdateLogRequest): Promise<Log> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      logger.error("Error updating log", { id, data, error });
      throw error;
    }
  }

  async deleteLog(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      logger.error("Error deleting log", { id, error });
      throw error;
    }
  }

  async searchLogs(
    query: string,
    page: number = 1,
    size: number = 10
  ): Promise<LogResponse> {
    try {
      const response = await api.get(this.baseUrl, {
        params: {
          search: query,
          page,
          size,
        },
      });
      return response.data;
    } catch (error) {
      logger.error("Error searching logs", { query, error });
      throw error;
    }
  }

  async getLogsByLevel(
    level: string,
    page: number = 1,
    size: number = 10
  ): Promise<LogResponse> {
    try {
      const response = await api.get(this.baseUrl, {
        params: {
          level,
          page,
          size,
        },
      });
      return response.data;
    } catch (error) {
      logger.error("Error fetching logs by level", { level, error });
      throw error;
    }
  }

  async getLogsByUser(
    userId: string,
    page: number = 1,
    size: number = 10
  ): Promise<LogResponse> {
    try {
      const response = await api.get(this.baseUrl, {
        params: {
          user_id: userId,
          page,
          size,
        },
      });
      return response.data;
    } catch (error) {
      logger.error("Error fetching logs by user", { userId, error });
      throw error;
    }
  }

  async getLogsByDateRange(
    startDate: string,
    endDate: string,
    page: number = 1,
    size: number = 10
  ): Promise<LogResponse> {
    try {
      const response = await api.get(this.baseUrl, {
        params: {
          start_date: startDate,
          end_date: endDate,
          page,
          size,
        },
      });
      return response.data;
    } catch (error) {
      logger.error("Error fetching logs by date range", {
        startDate,
        endDate,
        error,
      });
      throw error;
    }
  }

  async getLogsByModule(
    module: string,
    page: number = 1,
    size: number = 10
  ): Promise<LogResponse> {
    try {
      const response = await api.get(this.baseUrl, {
        params: {
          module,
          page,
          size,
        },
      });
      return response.data;
    } catch (error) {
      logger.error("Error fetching logs by module", { module, error });
      throw error;
    }
  }

  async clearLogs(): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/clear`);
    } catch (error) {
      logger.error("Error clearing logs", { error });
      throw error;
    }
  }

  async exportLogs(format: "csv" | "json" = "json"): Promise<Blob> {
    try {
      const response = await api.get(`${this.baseUrl}/export`, {
        params: { format },
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      logger.error("Error exporting logs", { format, error });
      throw error;
    }
  }
}

export const logService = new LogService();

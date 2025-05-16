import api from "./api";
import {
  Setting,
  CreateSettingRequest,
  UpdateSettingRequest,
  SettingResponse,
} from "../types/setting";
import { logger } from "../utils";

class SettingService {
  private readonly baseUrl = "/settings";

  async getSettings(
    page: number = 1,
    size: number = 10
  ): Promise<SettingResponse> {
    try {
      const response = await api.get(this.baseUrl, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      logger.error("Error fetching settings", { error });
      throw error;
    }
  }

  async getSetting(id: string): Promise<Setting> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      logger.error("Error fetching setting", { id, error });
      throw error;
    }
  }

  async createSetting(data: CreateSettingRequest): Promise<Setting> {
    try {
      const response = await api.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      logger.error("Error creating setting", { data, error });
      throw error;
    }
  }

  async updateSetting(
    id: string,
    data: UpdateSettingRequest
  ): Promise<Setting> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      logger.error("Error updating setting", { id, data, error });
      throw error;
    }
  }

  async deleteSetting(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      logger.error("Error deleting setting", { id, error });
      throw error;
    }
  }

  async searchSettings(
    query: string,
    page: number = 1,
    size: number = 10
  ): Promise<SettingResponse> {
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
      logger.error("Error searching settings", { query, error });
      throw error;
    }
  }

  async getSettingsByCategory(
    category: string,
    page: number = 1,
    size: number = 10
  ): Promise<SettingResponse> {
    try {
      const response = await api.get(this.baseUrl, {
        params: {
          category,
          page,
          size,
        },
      });
      return response.data;
    } catch (error) {
      logger.error("Error fetching settings by category", { category, error });
      throw error;
    }
  }

  async getSettingsByUser(
    userId: string,
    page: number = 1,
    size: number = 10
  ): Promise<SettingResponse> {
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
      logger.error("Error fetching settings by user", { userId, error });
      throw error;
    }
  }

  async getSettingsByModule(
    module: string,
    page: number = 1,
    size: number = 10
  ): Promise<SettingResponse> {
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
      logger.error("Error fetching settings by module", { module, error });
      throw error;
    }
  }

  async validateSetting(
    id: string
  ): Promise<{ valid: boolean; errors?: string[] }> {
    try {
      const response = await api.post(`${this.baseUrl}/${id}/validate`);
      return response.data;
    } catch (error) {
      logger.error("Error validating setting", { id, error });
      throw error;
    }
  }

  async resetSetting(id: string): Promise<Setting> {
    try {
      const response = await api.post(`${this.baseUrl}/${id}/reset`);
      return response.data;
    } catch (error) {
      logger.error("Error resetting setting", { id, error });
      throw error;
    }
  }

  async importSettings(file: File): Promise<void> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      await api.post(`${this.baseUrl}/import`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      logger.error("Error importing settings", { error });
      throw error;
    }
  }

  async exportSettings(format: "csv" | "json" = "json"): Promise<Blob> {
    try {
      const response = await api.get(`${this.baseUrl}/export`, {
        params: { format },
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      logger.error("Error exporting settings", { format, error });
      throw error;
    }
  }
}

export const settingService = new SettingService();

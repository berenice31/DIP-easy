import api from "./api";
import {
  Template,
  CreateTemplateRequest,
  UpdateTemplateRequest,
  TemplateResponse,
} from "../types/template";
import { logger } from "../utils";

class TemplateService {
  private readonly baseUrl = "/templates";

  async getTemplates(
    page: number = 1,
    size: number = 10
  ): Promise<TemplateResponse> {
    try {
      const response = await api.get(this.baseUrl, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      logger.error("Error fetching templates", { error });
      throw error;
    }
  }

  async getTemplate(id: string): Promise<Template> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      logger.error("Error fetching template", { id, error });
      throw error;
    }
  }

  async createTemplate(data: CreateTemplateRequest): Promise<Template> {
    try {
      const response = await api.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      logger.error("Error creating template", { data, error });
      throw error;
    }
  }

  async updateTemplate(
    id: string,
    data: UpdateTemplateRequest
  ): Promise<Template> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      logger.error("Error updating template", { id, data, error });
      throw error;
    }
  }

  async deleteTemplate(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      logger.error("Error deleting template", { id, error });
      throw error;
    }
  }

  async searchTemplates(
    query: string,
    page: number = 1,
    size: number = 10
  ): Promise<TemplateResponse> {
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
      logger.error("Error searching templates", { query, error });
      throw error;
    }
  }

  async generateDocument(
    templateId: string,
    productId: string
  ): Promise<{ url: string }> {
    try {
      const response = await api.post(
        `${this.baseUrl}/${templateId}/generate`,
        {
          product_id: productId,
        }
      );
      return response.data;
    } catch (error) {
      logger.error("Error generating document", {
        templateId,
        productId,
        error,
      });
      throw error;
    }
  }

  async previewTemplate(
    templateId: string,
    data: Record<string, any>
  ): Promise<string> {
    try {
      const response = await api.post(
        `${this.baseUrl}/${templateId}/preview`,
        data
      );
      return response.data.preview;
    } catch (error) {
      logger.error("Error previewing template", { templateId, data, error });
      throw error;
    }
  }

  async validateTemplate(
    templateId: string
  ): Promise<{ valid: boolean; errors?: string[] }> {
    try {
      const response = await api.post(`${this.baseUrl}/${templateId}/validate`);
      return response.data;
    } catch (error) {
      logger.error("Error validating template", { templateId, error });
      throw error;
    }
  }

  async duplicateTemplate(
    templateId: string,
    newName: string
  ): Promise<Template> {
    try {
      const response = await api.post(
        `${this.baseUrl}/${templateId}/duplicate`,
        {
          name: newName,
        }
      );
      return response.data;
    } catch (error) {
      logger.error("Error duplicating template", {
        templateId,
        newName,
        error,
      });
      throw error;
    }
  }

  async uploadTemplate(name: string, file: File) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file);
    const response = await api.post(this.baseUrl + "/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
}

export const templateService = new TemplateService();
